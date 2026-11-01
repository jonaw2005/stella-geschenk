import { createHmac, timingSafeEqual } from 'node:crypto'
import { createServer } from 'node:http'
import { mkdir, readFile, stat, unlink, writeFile } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const distDir = join(root, 'dist')
const dataDir = resolve(process.env.DATA_DIR || join(root, 'data'))
const stateFile = join(dataDir, 'selection-state.json')
const destinationData = JSON.parse(await readFile(join(root, 'src', 'content', 'destinations.generated.json'), 'utf8'))
const allowedDestinationIds = new Set(destinationData.map((destination) => destination.id))
const port = Number(process.env.PORT || 4173)
const host = process.env.HOST || '0.0.0.0'
const accessDate = process.env.ACCESS_DATE || '2008-11-03'
const sessionSecret = process.env.SESSION_SECRET || 'lokale-reise-swipe-entwicklung-2026'
const sessionMaxAgeSeconds = 60 * 60 * 24 * 180
const attempts = new Map()

const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json; charset=utf-8', '.ico': 'image/x-icon',
}

function baseHeaders(extra = {}) {
  return {
    'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    ...extra,
  }
}

function send(response, status, body, headers = {}) {
  response.writeHead(status, baseHeaders(headers))
  response.end(body)
}

function sign(value) {
  return createHmac('sha256', sessionSecret).update(value).digest('base64url')
}

function createSessionToken() {
  const expires = String(Date.now() + sessionMaxAgeSeconds * 1000)
  return `${expires}.${sign(expires)}`
}

function isValidSession(request) {
  const cookie = request.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith('reise_session='))
  if (!cookie) return false
  const [expires, signature] = cookie.slice('reise_session='.length).split('.')
  if (!expires || !signature || Number(expires) < Date.now()) return false
  const expected = Buffer.from(sign(expires))
  const received = Buffer.from(signature)
  return expected.length === received.length && timingSafeEqual(expected, received)
}

function safeEqual(left, right) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

function loginPage(error = '') {
  const message = error ? `<p class="error" role="alert">${error}</p>` : ''
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Geschenk öffnen</title><style>
  :root{font-family:Inter,Avenir,"Segoe UI",system-ui,sans-serif;color:#112c3e;background:#f8f1e5}*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 85% 10%,#f3cbb5 0,transparent 30%),#f8f1e5}.card{width:min(100%,430px);background:#fffdf8;border:1px solid rgba(17,44,62,.12);border-radius:28px;padding:36px 28px;box-shadow:0 22px 55px rgba(28,50,56,.13);text-align:center}.mark{width:62px;height:62px;margin:auto;display:grid;place-items:center;border-radius:50%;background:#e66552;color:#fff;font:italic 700 1.8rem Georgia,serif;transform:rotate(-5deg)}.eyebrow{margin-top:22px;color:#c94d3b;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;font-weight:800}h1{font:600 2.5rem/1.05 Georgia,serif;margin:8px 0 14px}p{color:#647273;line-height:1.55}label{display:block;text-align:left;font-weight:700;margin:26px 0 8px}input{width:100%;min-height:52px;border:1px solid #9ba7a5;border-radius:14px;padding:10px 14px;font-size:1rem;background:#fff}input:focus{outline:3px solid #087f8c;outline-offset:2px}button{width:100%;min-height:54px;margin-top:16px;border:0;border-radius:999px;background:#e66552;color:white;font-weight:800;cursor:pointer}.hint{font-size:.75rem}.error{padding:10px;border-radius:10px;background:#f9dfd8;color:#8f3028;font-weight:700}
  </style></head><body><main class="card"><div class="mark">W</div><div class="eyebrow">Nur für dich</div><h1>Dein Geschenk wartet</h1><p>Gib das besondere Datum ein, um unser nächstes Abenteuer zu öffnen.</p>${message}<form method="post" action="/reise/unlock"><label for="date">Datum</label><input id="date" name="date" type="date" required autocomplete="bday"><button type="submit">Geschenk öffnen</button></form><p class="hint">Der Zugang bleibt auf diesem Gerät gespeichert.</p></main></body></html>`
}

async function readBody(request, maxBytes = 100_000) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > maxBytes) throw new Error('too_large')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

function validState(value) {
  if (!value || typeof value !== 'object' || !value.decisions || typeof value.decisions !== 'object' || typeof value.updatedAt !== 'string') return false
  const allowedDecisions = new Set(['unseen', 'liked', 'passed'])
  return Object.entries(value.decisions).every(([id, decision]) => allowedDestinationIds.has(id) && allowedDecisions.has(decision))
}

async function serveFile(response, filePath) {
  const resolved = resolve(filePath)
  if (!resolved.startsWith(distDir)) return send(response, 403, 'Forbidden', { 'Content-Type': 'text/plain; charset=utf-8' })
  try {
    const info = await stat(resolved)
    if (!info.isFile()) throw new Error('not_file')
    const content = await readFile(resolved)
    send(response, 200, content, { 'Content-Type': mimeTypes[extname(resolved)] || 'application/octet-stream', 'Cache-Control': extname(resolved) === '.html' ? 'no-store' : 'public, max-age=31536000, immutable' })
  } catch {
    send(response, 404, 'Nicht gefunden', { 'Content-Type': 'text/plain; charset=utf-8' })
  }
}

export function createAppServer() {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
      const forwardedFor = request.headers['x-forwarded-for']
      const clientKey = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(',')[0].trim()
        || request.socket.remoteAddress
        || 'unknown'

      if (url.pathname === '/reise/health' && request.method === 'GET') {
        return send(response, 204, '')
      }

      if (url.pathname === '/reise/unlock' && request.method === 'POST') {
        const recent = (attempts.get(clientKey) || []).filter((time) => Date.now() - time < 15 * 60 * 1000)
        if (recent.length >= 10) return send(response, 429, loginPage('Zu viele Versuche. Bitte warte einige Minuten.'), { 'Content-Type': 'text/html; charset=utf-8' })
        const form = new URLSearchParams(await readBody(request))
        if (!safeEqual(form.get('date') || '', accessDate)) {
          attempts.set(clientKey, [...recent, Date.now()])
          return send(response, 401, loginPage('Dieses Datum passt leider nicht.'), { 'Content-Type': 'text/html; charset=utf-8' })
        }
        attempts.delete(clientKey)
        const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
        response.writeHead(303, baseHeaders({
          Location: '/reise/',
          'Set-Cookie': `reise_session=${createSessionToken()}; Path=/reise; HttpOnly; SameSite=Strict; Max-Age=${sessionMaxAgeSeconds}${secure}`,
        }))
        return response.end()
      }

      if (!isValidSession(request)) {
        if (url.pathname.startsWith('/reise/api/')) return send(response, 401, JSON.stringify({ error: 'Nicht freigeschaltet' }), { 'Content-Type': 'application/json; charset=utf-8' })
        return send(response, 200, loginPage(), { 'Content-Type': 'text/html; charset=utf-8' })
      }

      if (url.pathname === '/reise/api/state') {
        if (request.method === 'GET') {
          try { return send(response, 200, await readFile(stateFile), { 'Content-Type': 'application/json; charset=utf-8' }) }
          catch { return send(response, 404, JSON.stringify({ error: 'Noch kein Stand gespeichert' }), { 'Content-Type': 'application/json; charset=utf-8' }) }
        }
        if (request.method === 'PUT') {
          const value = JSON.parse(await readBody(request))
          if (!validState(value)) return send(response, 400, JSON.stringify({ error: 'Ungültiger Auswahlstand' }), { 'Content-Type': 'application/json; charset=utf-8' })
          await mkdir(dataDir, { recursive: true })
          await writeFile(`${stateFile}.tmp`, JSON.stringify(value, null, 2), 'utf8')
          await writeFile(stateFile, await readFile(`${stateFile}.tmp`))
          await unlink(`${stateFile}.tmp`).catch(() => {})
          return send(response, 204, '')
        }
        if (request.method === 'DELETE') {
          await unlink(stateFile).catch(() => {})
          return send(response, 204, '')
        }
        return send(response, 405, 'Method Not Allowed', { Allow: 'GET, PUT, DELETE' })
      }

      if (url.pathname === '/' || url.pathname === '/reise' || url.pathname === '/reise/') return serveFile(response, join(distDir, 'index.html'))
      if (url.pathname.startsWith('/reise/')) {
        const relative = normalize(url.pathname.slice('/reise/'.length)).replace(/^(\.\.[/\\])+/, '')
        return serveFile(response, join(distDir, relative))
      }
      response.writeHead(302, baseHeaders({ Location: '/reise/' }))
      response.end()
    } catch (error) {
      console.error(error)
      send(response, 500, 'Interner Serverfehler', { 'Content-Type': 'text/plain; charset=utf-8' })
    }
  })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createAppServer()
  server.listen(port, host, () => console.log(`Reise-Swipe-Server: http://localhost:${port}/reise/`))
}