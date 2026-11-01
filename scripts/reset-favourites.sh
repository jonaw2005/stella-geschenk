#!/usr/bin/env bash
set -Eeuo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() { printf '\n\033[1;34m[reise-swipe-reset]\033[0m %s\n' "$*"; }
die() { printf '\n\033[1;31m[Fehler]\033[0m %s\n' "$*" >&2; exit 1; }

[[ -f "${REPO_ROOT}/compose.yaml" && -f "${REPO_ROOT}/.env" ]] \
  || die "Bitte zuerst scripts/install-server.sh ausführen."

if [[ "${EUID}" -eq 0 ]]; then
  SUDO=()
else
  command -v sudo >/dev/null 2>&1 || die "sudo wurde nicht gefunden."
  SUDO=(sudo)
  sudo -v
fi

cd "${REPO_ROOT}"
"${SUDO[@]}" docker compose config --quiet

container_id="$("${SUDO[@]}" docker compose ps -q app)"
[[ -n "${container_id}" ]] || die "Der App-Container läuft nicht. Starte ihn zuerst mit: sudo docker compose up -d"

log "Setze alle gespeicherten Entscheidungen zurück"
"${SUDO[@]}" docker compose exec -T app node --input-type=module <<'NODE'
import { readFile, rename, writeFile } from 'node:fs/promises'

const destinations = JSON.parse(await readFile('/app/src/content/destinations.generated.json', 'utf8'))
const stateFile = '/app/data/selection-state.json'
const temporaryFile = `${stateFile}.reset.tmp`
const state = {
  decisions: Object.fromEntries(destinations.map(({ id }) => [id, 'unseen'])),
  updatedAt: new Date().toISOString(),
}

await writeFile(temporaryFile, JSON.stringify(state, null, 2), 'utf8')
await rename(temporaryFile, stateFile)
console.log(`${destinations.length} Reiseziele wurden zurückgesetzt.`)
NODE

log "Prüfe den gespeicherten Stand"
"${SUDO[@]}" docker compose exec -T app node --input-type=module <<'NODE'
import { readFile } from 'node:fs/promises'

const state = JSON.parse(await readFile('/app/data/selection-state.json', 'utf8'))
const decisions = Object.values(state.decisions)
if (!decisions.length || decisions.some((decision) => decision !== 'unseen')) {
  throw new Error('Der gespeicherte Stand wurde nicht vollständig zurückgesetzt.')
}
console.log(`Reset bestätigt: ${decisions.length} von ${decisions.length} Zielen sind ungesehen.`)
NODE

log "Favoriten und bisherige Entscheidungen sind zurückgesetzt"
printf 'Die App auf bereits geöffneten Geräten jetzt neu laden.\n\n'