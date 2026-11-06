import assert from 'node:assert/strict'
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { after, before, test } from 'node:test'
import { createAppServer } from './server.mjs'

let server
let baseUrl
let previousState
const stateFile = resolve('data/selection-state.json')

before(async () => {
  previousState = await readFile(stateFile).catch(() => null)
  server = createAppServer()
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
  await new Promise((resolve) => server.close(resolve))
  if (previousState) {
    await mkdir(resolve('data'), { recursive: true })
    await writeFile(stateFile, previousState)
  } else {
    await unlink(stateFile).catch(() => {})
  }
})

test('zeigt ohne Sitzung die Abfrage des Geburtsdatums', async () => {
  const response = await fetch(`${baseUrl}/`)
  assert.equal(response.status, 200)
  const page = await response.text()
  assert.match(page, /<div class="mark">DT<\/div>/)
  assert.match(page, /Gib dein Geburtsdatum ein/)
  assert.match(page, /<label for="date">Geburtsdatum<\/label>/)
  assert.match(page, /type="date"/)
})

test('stellt einen inhaltsfreien Healthcheck ohne Sitzung bereit', async () => {
  const response = await fetch(`${baseUrl}/health`)
  assert.equal(response.status, 204)
  assert.equal(await response.text(), '')
})

test('lehnt ein falsches Datum ab und akzeptiert das richtige', async () => {
  const wrong = await fetch(`${baseUrl}/unlock`, { method: 'POST', body: new URLSearchParams({ date: '2000-01-01' }), redirect: 'manual' })
  assert.equal(wrong.status, 401)

  const correct = await fetch(`${baseUrl}/unlock`, { method: 'POST', body: new URLSearchParams({ date: '2008-11-03' }), redirect: 'manual' })
  assert.equal(correct.status, 303)
  assert.match(correct.headers.get('set-cookie') || '', /HttpOnly/)
  assert.match(correct.headers.get('set-cookie') || '', /Path=\//)
  assert.equal(correct.headers.get('location'), '/')
})

test('löscht beim Abmelden das Sitzungscookie', async () => {
  const login = await fetch(`${baseUrl}/unlock`, { method: 'POST', body: new URLSearchParams({ date: '2008-11-03' }), redirect: 'manual' })
  const cookie = (login.headers.get('set-cookie') || '').split(';')[0]
  const logout = await fetch(`${baseUrl}/logout`, { method: 'POST', headers: { Cookie: cookie }, redirect: 'manual' })

  assert.equal(logout.status, 303)
  assert.equal(logout.headers.get('location'), '/')
  assert.match(logout.headers.get('set-cookie') || '', /^reise_session=;/)
  assert.match(logout.headers.get('set-cookie') || '', /Max-Age=0/)
  assert.match(logout.headers.get('set-cookie') || '', /HttpOnly/)
})

test('leitet den bisherigen Hosting-Pfad auf die Hauptdomain um', async () => {
  const response = await fetch(`${baseUrl}/reise/`, { redirect: 'manual' })
  assert.equal(response.status, 308)
  assert.equal(response.headers.get('location'), '/')
})

test('speichert und lädt den Auswahlstand mit gültiger Sitzung', async () => {
  const login = await fetch(`${baseUrl}/unlock`, { method: 'POST', body: new URLSearchParams({ date: '2008-11-03' }), redirect: 'manual' })
  const cookie = (login.headers.get('set-cookie') || '').split(';')[0]
  const state = {
    decisions: { kos: 'liked', malta: 'unseen', valencia: 'passed', 'split-makarska': 'unseen', malaga: 'unseen', 'gran-canaria': 'unseen' },
    updatedAt: '2026-10-23T18:00:00.000Z',
  }
  const save = await fetch(`${baseUrl}/api/state`, {
    method: 'PUT', headers: { Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify(state),
  })
  assert.equal(save.status, 204)
  const load = await fetch(`${baseUrl}/api/state`, { headers: { Cookie: cookie } })
  assert.equal(load.status, 200)
  assert.deepEqual(await load.json(), state)
})