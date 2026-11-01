# Reise-Swipe-Geschenk

Mobile React-Anwendung für einen persönlichen Reise-Gutschein. Die Anwendung enthält die Begrüßung, 50 datengetriebene Reiseziele, sechs geordnete Bildreferenzen je Ziel, Swipe/Buttons, Aktivitäten und Unterkunft direkt in der scrollbaren Karte, Details, Fortschritt, Rückgängig, Favoriten sowie lokale und serverseitige Speicherung.

## Entwicklung

```bash
npm install
npm run dev
```

Die Anwendung wird lokal und im Deployment direkt unter `/` bereitgestellt.

## Docker-Deployment auf Arch Linux

Das Deployment verwendet Docker Compose mit zwei Containern:

- `app`: getesteter Node.js-Produktionsbuild als unprivilegierter Benutzer,
- `caddy`: Reverse Proxy mit automatischem HTTPS und Zertifikatserneuerung.

Die feste Standarddomain ist `stellas-reiseplanung.de`. Sie muss vorab per A/AAAA-DNS-Eintrag auf den Server zeigen. TCP 80 und TCP/UDP 443 müssen von außen erreichbar sein.

```bash
git clone <DEINE-REPOSITORY-URL> stella-geschenk
cd stella-geschenk
bash scripts/install-server.sh \
  --email admin@example.de
```

Der Arch-Installer übernimmt automatisch:

- Installation von `docker`, `docker-compose` und `docker-buildx` über `yay` oder `pacman`,
- Aktivierung von `docker.service` beim Systemstart,
- Erzeugung einer geschützten `.env` mit zufälligem Session-Secret,
- Inhaltsprüfung, Typecheck, Tests und Build innerhalb des Docker-Builds,
- Start von App und Caddy mit automatischem HTTPS,
- persistente Speicherung der Favoriten in einem benannten Docker-Volume,
- Healthcheck und automatische Container-Neustarts.

Das Zugangsdatum ist standardmäßig `03.11.2008`. Ein anderes Datum kann im ISO-Format gesetzt werden:

```bash
bash scripts/install-server.sh \
  --email admin@example.de \
  --access-date 2008-11-03
```

Die öffentliche URL lautet anschließend:

```text
https://stellas-reiseplanung.de/
```

`--domain` bleibt als optionale Überschreibung verfügbar, falls die Domain später geändert werden soll.

Spätere Aktualisierung nach einem kontrollierten `git pull`:

```bash
bash scripts/update-server.sh
```

Favoriten und alle bisherigen Entscheidungen zurücksetzen:

```bash
bash scripts/reset-favourites.sh
```

Das Reset-Skript überschreibt ausschließlich den gemeinsamen Auswahlstand im Volume `selection-data`. Zertifikate, Deployment-Konfiguration und andere Volumes bleiben erhalten. Danach muss die App auf bereits geöffneten Geräten neu geladen werden, damit auch dort der leere Stand übernommen wird.

Nützliche Befehle:

```bash
sudo docker compose ps
sudo docker compose logs -f
sudo docker compose restart
sudo docker compose down
sudo docker compose up -d
```

`docker compose down` löscht die Favoriten und Zertifikate nicht. Nur `docker compose down --volumes` würde die persistenten Volumes entfernen und sollte daher nicht verwendet werden.

Die Skripte fügen den Benutzer absichtlich nicht automatisch zur Gruppe `docker` hinzu: Mitglieder dieser Gruppe besitzen praktisch Root-Rechte. Stattdessen führen die Skripte Docker-Kommandos kontrolliert über `sudo` aus.

## Prüfungen

```bash
npm run typecheck
npm test
npm run test:server
npm run validate:content
npm run build
npm run serve
```

## Wichtiger Stand

- Alle Reisekosten sind absichtlich als offen gekennzeichnet. Es gibt keine erfundenen Preise oder Verfügbarkeiten.
- `50-reiseziele-fuer-zwei.md` ist die redaktionelle Quelle. `npm run generate:content` erzeugt daraus `src/content/destinations.generated.json`.
- Die sechs externen Bildlinks je Ziel werden in der Reihenfolge der Markdown-Datei dargestellt. Die Links sind keine geklärten Bildlizenzen; vor öffentlicher Veröffentlichung müssen Rechte geprüft und freigegebene Bilder lokal gehostet werden.
- Nicht erreichbare oder vom Anbieter blockierte Bilder werden durch ein neutrales lokales Fallback ersetzt.
- Vergleich, Wunschbestätigung, Export, redaktionelle JSON-Schemas, echte lizenzierte Reisefotos sowie QR-/Druckartefakte folgen in weiteren Iterationen.
- Der lokale Speicherschlüssel lautet `reise-swipe:18-geburtstag:state`.
- Lokal speichert der Server den gemeinsamen Stand in `data/selection-state.json`; im Docker-Deployment liegt er im Volume `reise-swipe_selection-data`.
- Der Standardzugang wird serverseitig mit dem Datum `03.11.2008` geprüft. Für ein Deployment können `ACCESS_DATE` (`YYYY-MM-DD`) und `SESSION_SECRET` als Umgebungsvariablen gesetzt werden.
- Unter HTTPS sollte der Server mit `NODE_ENV=production` gestartet werden, damit das Sitzungscookie zusätzlich das Attribut `Secure` erhält.