#!/usr/bin/env bash
set -Eeuo pipefail

DOMAIN="stellas-reiseplanung.de"
EMAIL=""
ACCESS_DATE="2008-11-03"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() { printf '\n\033[1;34m[reise-swipe]\033[0m %s\n' "$*"; }
warn() { printf '\n\033[1;33m[Warnung]\033[0m %s\n' "$*" >&2; }
die() { printf '\n\033[1;31m[Fehler]\033[0m %s\n' "$*" >&2; exit 1; }

usage() {
  cat <<'EOF'
Installiert die Reise-Swipe-App auf Arch Linux mit Docker Compose und Caddy.

Aufruf:
  bash scripts/install-server.sh --email admin@example.de

Optionen:
  --domain NAME       Abweichende Domain (Standard: stellas-reiseplanung.de)
  --email ADRESSE     E-Mail für die automatische Zertifikatserteilung
  --access-date DATUM Zugangsdatum als YYYY-MM-DD (Standard: 2008-11-03)
  -h, --help          Hilfe anzeigen

Voraussetzungen für HTTPS:
  - Der A/AAAA-DNS-Eintrag der Domain zeigt auf diesen Server.
  - TCP 80 und TCP/UDP 443 sind von außen erreichbar.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain) DOMAIN="${2:-}"; shift 2 ;;
    --email) EMAIL="${2:-}"; shift 2 ;;
    --access-date) ACCESS_DATE="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unbekannte Option: $1" ;;
  esac
done

[[ -f "${REPO_ROOT}/compose.yaml" && -f "${REPO_ROOT}/Dockerfile" ]] \
  || die "Das Skript muss aus dem geklonten Repository ausgeführt werden."
command -v sudo >/dev/null 2>&1 || [[ "${EUID}" -eq 0 ]] \
  || die "sudo wurde nicht gefunden."

if [[ -z "${EMAIL}" && -t 0 ]]; then
  read -r -p "E-Mail für HTTPS-Zertifikate: " EMAIL
fi

[[ "${DOMAIN}" =~ ^([A-Za-z0-9-]+\.)+[A-Za-z]{2,63}$ ]] \
  || die "Ungültige Domain: ${DOMAIN:-<leer>}"
[[ "${EMAIL}" =~ ^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$ ]] \
  || die "Ungültige E-Mail-Adresse: ${EMAIL:-<leer>}"
[[ "${ACCESS_DATE}" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] \
  || die "Das Zugangsdatum muss YYYY-MM-DD entsprechen."

if [[ ! -f /etc/os-release ]]; then
  die "Dieses Skript unterstützt Arch Linux mit systemd."
fi
# shellcheck disable=SC1091
source /etc/os-release
[[ "${ID:-}" == "arch" || " ${ID_LIKE:-} " == *" arch "* ]] \
  || die "Nicht unterstütztes System: ${PRETTY_NAME:-unbekannt}. Erwartet wird Arch Linux."
command -v systemctl >/dev/null 2>&1 || die "systemd wurde nicht gefunden."

if [[ "${EUID}" -eq 0 ]]; then
  SUDO=()
else
  SUDO=(sudo)
  sudo -v
fi

packages=(docker docker-compose docker-buildx curl openssl)
missing_packages=()
for package in "${packages[@]}"; do
  pacman -Q "${package}" >/dev/null 2>&1 || missing_packages+=("${package}")
done

if (( ${#missing_packages[@]} > 0 )); then
  log "Installiere Arch-Pakete: ${missing_packages[*]}"
  if [[ "${EUID}" -ne 0 ]] && command -v yay >/dev/null 2>&1; then
    yay -S --needed --noconfirm "${missing_packages[@]}"
  else
    "${SUDO[@]}" pacman -S --needed --noconfirm "${missing_packages[@]}"
  fi
fi

log "Aktiviere Docker beim Systemstart"
"${SUDO[@]}" systemctl enable --now docker.service
"${SUDO[@]}" systemctl is-active --quiet docker.service || die "Docker konnte nicht gestartet werden."

cd "${REPO_ROOT}"
session_secret=""
if [[ -f .env ]]; then
  session_secret="$(sed -n 's/^SESSION_SECRET=//p' .env | head -n 1)"
fi
if [[ ! "${session_secret}" =~ ^[A-Fa-f0-9]{64,}$ ]]; then
  session_secret="$(openssl rand -hex 48)"
fi

log "Schreibe lokale, nicht versionierte Deployment-Konfiguration"
umask 077
cat > .env <<EOF
SITE_ADDRESS=${DOMAIN}
EMAIL=${EMAIL}
ACCESS_DATE=${ACCESS_DATE}
SESSION_SECRET=${session_secret}
EOF
chmod 0600 .env

log "Prüfe Compose-Konfiguration"
"${SUDO[@]}" docker compose config --quiet

log "Lade Caddy und baue die getestete Anwendung"
"${SUDO[@]}" docker compose pull caddy
"${SUDO[@]}" docker compose build --pull app
"${SUDO[@]}" docker compose up -d --remove-orphans

log "Warte auf den App-Healthcheck"
healthy="false"
for _ in $(seq 1 60); do
  container_id="$("${SUDO[@]}" docker compose ps -q app)"
  status="$("${SUDO[@]}" docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${container_id}" 2>/dev/null || true)"
  if [[ "${status}" == "healthy" ]]; then
    healthy="true"
    break
  fi
  if [[ "${status}" == "unhealthy" || "${status}" == "exited" ]]; then
    break
  fi
  sleep 2
done

if [[ "${healthy}" != "true" ]]; then
  "${SUDO[@]}" docker compose ps
  "${SUDO[@]}" docker compose logs --tail=100 app
  die "Der App-Container wurde nicht gesund."
fi

"${SUDO[@]}" docker compose ps
if ! curl --fail --silent --show-error --max-time 15 "https://${DOMAIN}/health" >/dev/null; then
  warn "Die Container laufen, aber HTTPS ist von hier noch nicht erreichbar. Prüfe DNS, Router/NAT und Firewall für 80/443 sowie die Caddy-Logs."
fi

log "Installation abgeschlossen"
printf '\nURL: https://%s/\n' "${DOMAIN}"
printf 'Zugangsdatum: %s\n' "${ACCESS_DATE}"
printf 'Status: sudo docker compose ps\n'
printf 'Logs: sudo docker compose logs -f\n'
printf 'Update nach git pull: bash scripts/update-server.sh\n\n'