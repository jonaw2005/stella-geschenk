import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const inputPath = resolve(root, '50-reiseziele-fuer-zwei.md')
const outputPath = resolve(root, 'src/content/destinations.generated.json')

const fixedIds = new Map([
  ['Kos', 'kos'], ['Malta', 'malta'], ['Valencia', 'valencia'],
  ['Split und Makarska', 'split-makarska'], ['Málaga', 'malaga'], ['Gran Canaria', 'gran-canaria'],
])

function slugify(title) {
  if (fixedIds.has(title)) return fixedIds.get(title)
  return title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss')
    .toLowerCase().replace(/&/g, ' und ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function section(body, heading, nextHeadings) {
  const start = body.indexOf(`### ${heading}`)
  if (start < 0) return ''
  const contentStart = start + heading.length + 4
  const endings = nextHeadings.map((next) => body.indexOf(`### ${next}`, contentStart)).filter((index) => index >= 0)
  const end = endings.length ? Math.min(...endings) : body.length
  return body.slice(contentStart, end).trim()
}

function plainText(value) {
  return value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1').replace(/\*\*/g, '').trim()
}

function parseList(block) {
  return block.split(/\r?\n/).filter((line) => line.startsWith('- ')).map((line) => {
    const content = line.slice(2).trim()
    const link = content.match(/\[([^\]]+)\]\(([^)]+)\)/)
    const label = link?.[1] || plainText(content.split(' - ')[0]).replace(/^Hotel \/ Pension:\s*/, '')
    return { label, text: plainText(content).replace(/^Hotel \/ Pension:\s*/, ''), url: link?.[2] || null }
  })
}

function parseImages(block, title) {
  return block.split(/\r?\n/).filter((line) => /^\d+\.\s/.test(line)).map((line) => {
    const match = line.match(/^\d+\.\s+\[([^\]]+)\]\((.*?)\)\s+·\s+\[Bildquelle\]\((.*?)\)\s*$/)
    if (!match) throw new Error(`Bildzeile konnte nicht gelesen werden (${title}): ${line}`)
    const [, label, src, sourceUrl] = match
    return { src, alt: `${title}: ${label.replace(/\s*-\s*/g, ' ')}`, sourceUrl, label, kind: label.startsWith('Unterkunft') ? 'accommodation' : 'place' }
  })
}

const markdown = await readFile(inputPath, 'utf8')
const parts = markdown.split(/^## (?=\d{2}\.\s)/m).slice(1)
const destinations = parts.map((part, index) => {
  const firstLineEnd = part.indexOf('\n')
  const title = part.slice(0, firstLineEnd).trim().replace(/^\d{2}\.\s+/, '')
  const body = part.slice(firstLineEnd + 1).split(/^---\s*$/m)[0].trim()
  const identity = body.match(/^\*\*([^·*]+)\s*·\s*([^*]+)\*\*/)
  if (!identity) throw new Error(`Land/Charakter fehlen: ${title}`)
  const country = identity[1].trim()
  const theme = identity[2].trim()
  const description = body.slice(identity[0].length).trim().split(/\r?\n\r?\n/)[0].trim()
  const timing = body.match(/\*\*Dauer:\*\*\s*([^.]*)\.\s*\*\*Reisezeit:\*\*\s*([^\n]*)/)
  const origin = body.match(/\*\*Ab Dresden\/Berlin:\*\*\s*([^\n]*)/)
  const accommodations = parseList(section(body, 'Übernachten', ['Food-Spots']))
  const foodSpots = parseList(section(body, 'Food-Spots', ['Aktivitäten']))
  const activities = parseList(section(body, 'Aktivitäten', ['Sechs Bildlinks'])).map((item) => item.text)
  const images = parseImages(section(body, 'Sechs Bildlinks', ['Planung und Budget']), title)
  const planningParagraphs = section(body, 'Planung und Budget', []).split(/\r?\n\r?\n/).map(plainText).filter(Boolean)
  const officialMatch = body.match(/\[Offizielle Zielinformationen\]\(([^)]+)\)/)
  const tags = theme.split(/\s+/).filter((word) => !['und', 'mit'].includes(word.toLowerCase())).slice(0, 3)
  return {
    id: slugify(title), order: index + 1, title, country, teaser: theme, description, tags,
    duration: timing?.[1]?.trim() || 'Dauer noch offen',
    travelTime: timing?.[2]?.trim().replace(/\.$/, '') || 'Reisezeit flexibel',
    originNote: origin?.[1]?.trim() || 'Anreise ab Dresden oder Berlin prüfen.',
    images, activities, accommodations, foodSpots,
    planningNote: planningParagraphs[0] || 'Planung noch gemeinsam prüfen.',
    budgetNote: planningParagraphs.find((paragraph) => paragraph.startsWith('Budget')) || 'Vollständiges Budget für zwei noch prüfen.',
    officialUrl: officialMatch?.[1] || null,
  }
})

const ids = new Set(destinations.map((destination) => destination.id))
const imageUrls = new Set()
const errors = []
if (destinations.length !== 50) errors.push(`Erwartet: 50 Ziele, gefunden: ${destinations.length}`)
if (ids.size !== destinations.length) errors.push('Ziel-IDs sind nicht eindeutig.')
for (const destination of destinations) {
  if (destination.images.length !== 6) errors.push(`${destination.title}: ${destination.images.length} statt 6 Bilder`)
  if (!destination.activities.length) errors.push(`${destination.title}: keine Aktivitäten`)
  if (!destination.accommodations.length) errors.push(`${destination.title}: keine Unterkunft`)
  destination.images.forEach((image, index) => {
    const prefix = `${destination.title}, Bild ${index + 1}`
    if (!image.alt || !image.label || !image.sourceUrl || !image.kind) errors.push(`${prefix}: unvollständige Bildmetadaten`)
    if (!image.src.startsWith('https://')) errors.push(`${prefix}: Bild-URL muss HTTPS verwenden`)
    if (!image.sourceUrl.startsWith('https://')) errors.push(`${prefix}: Quellen-URL muss HTTPS verwenden`)
    if (imageUrls.has(image.src)) errors.push(`${prefix}: Bild-URL wird mehrfach verwendet`)
    imageUrls.add(image.src)
  })
  destination.accommodations.forEach((item) => {
    if (item.url && !item.url.startsWith('https://')) errors.push(`${destination.title}: Unterkunfts-URL muss HTTPS verwenden`)
  })
}
if (errors.length) throw new Error(errors.join('\n'))

const json = `${JSON.stringify(destinations, null, 2)}\n`
if (process.argv.includes('--check')) {
  const existing = await readFile(outputPath, 'utf8').catch(() => '')
  if (existing !== json) throw new Error('Generierter Zieldatensatz ist nicht aktuell. Bitte npm run generate:content ausführen.')
  console.log(`Inhalte gültig: ${destinations.length} Ziele, je 6 Bilder, Aktivitäten und Unterkunft vorhanden.`)
} else {
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, json, 'utf8')
  console.log(`Generiert: ${destinations.length} Ziele.`)
}