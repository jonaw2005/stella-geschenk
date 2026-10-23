# Reise-Swipe-Geschenk – erste Version

Mobile React-Anwendung für einen persönlichen Reise-Gutschein. Die Anwendung enthält die Begrüßung, sechs datengetriebene Beispielziele, lokale illustrative Bildmotive, Swipe/Buttons, Details, Fortschritt, Rückgängig, Favoriten sowie lokale und serverseitige Speicherung.

## Entwicklung

```bash
npm install
npm run dev
```

Die lokale Vite-URL endet wegen des späteren Hosting-Pfads auf `/reise/`.

## Prüfungen

```bash
npm run typecheck
npm test
npm run build
npm run serve
```

## Wichtiger Stand

- Alle Reisekosten sind absichtlich als offen gekennzeichnet. Es gibt keine erfundenen Preise oder Verfügbarkeiten.
- Die sechs Bilder unter `public/images/` sind eigens erstellte SVG-Illustrationen für den Prototyp und keine vermeintlich echten Ortsfotografien.
- Vergleich, Wunschbestätigung, Export, redaktionelle JSON-Schemas, echte lizenzierte Reisefotos sowie QR-/Druckartefakte folgen in weiteren Iterationen.
- Der lokale Speicherschlüssel lautet `reise-swipe:18-geburtstag:state`.
- Der geschützte Server speichert den gemeinsamen Stand in `data/selection-state.json`.
- Der Standardzugang wird serverseitig mit dem Datum `03.11.2008` geprüft. Für ein Deployment können `ACCESS_DATE` (`YYYY-MM-DD`) und `SESSION_SECRET` als Umgebungsvariablen gesetzt werden.
- Unter HTTPS sollte der Server mit `NODE_ENV=production` gestartet werden, damit das Sitzungscookie zusätzlich das Attribut `Secure` erhält.