#!/usr/bin/env bash
set -Eeuo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() { printf '\n\033[1;34m[reise-swipe-update]\033[0m %s\n' "$*"; }
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

log "Aktualisiere Basisimages und baue die vollständig getestete App"
"${SUDO[@]}" docker compose pull caddy
"${SUDO[@]}" docker compose build --pull app

log "Ersetze Container; das Favoriten-Volume bleibt erhalten"
"${SUDO[@]}" docker compose up -d --remove-orphans

for _ in $(seq 1 60); do
  container_id="$("${SUDO[@]}" docker compose ps -q app)"
  status="$("${SUDO[@]}" docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${container_id}" 2>/dev/null || true)"
  [[ "${status}" == "healthy" ]] && break
  if [[ "${status}" == "unhealthy" || "${status}" == "exited" ]]; then
    "${SUDO[@]}" docker compose logs --tail=100 app
    die "Der App-Container wurde nach dem Update nicht gesund."
  fi
  sleep 2
done

container_id="$("${SUDO[@]}" docker compose ps -q app)"
status="$("${SUDO[@]}" docker inspect --format '{{.State.Health.Status}}' "${container_id}" 2>/dev/null || true)"
[[ "${status}" == "healthy" ]] || die "Zeitüberschreitung beim Healthcheck."

"${SUDO[@]}" docker compose ps
log "Update erfolgreich abgeschlossen"