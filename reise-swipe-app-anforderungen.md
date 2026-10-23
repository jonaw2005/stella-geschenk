# Reise-Swipe-App – Projektanforderungen

Version: 1.0 · Stand: 23. Oktober 2026 · Sprache: Deutsch

**Übergabe an den Coding-Agenten:** Entwickle anhand dieser Spezifikation eine mobile Website als persönlichen Reise-Gutschein zum 18. Geburtstag. Liefere eine funktionsfähige Anwendung, konfigurierbare Inhalte, Tests, eine Betriebsanleitung und einen geprüften QR-/Druck-Workflow. Diese Datei beschreibt das zu entwickelnde Produkt; sie enthält weder eine Buchung noch recherchierte Reiseangebote.

## 1. Produktidee und verbindlicher Rahmen

Ein gedruckter Boarding-Pass ist das materielle Geschenk. Sein QR-Code öffnet eine persönliche Website. Die beschenkte Freundin entdeckt dort Reiseziele anhand großer Fotos, wischt nach links oder rechts, öffnet Details, vergleicht ihre Favoriten und bestätigt einen Reisewunsch. Die Gestaltung greift die vertraute Kartenbedienung einer Dating-App auf; es gibt keine Partnersuche, Profile anderer Personen oder sozialen Funktionen.

| Rahmen | Verbindliche Anforderung |
|---|---|
| Anlass | Reise-Gutschein zum 18. Geburtstag einer Freundin |
| Reisende | Zwei Personen insgesamt |
| Start | Dresden oder Berlin; Flughäfen DRS und BER als mögliche, erst zu prüfende Abflugorte |
| Erlebnis | Meer/Strand und Sehenswürdigkeiten gemeinsam berücksichtigen |
| Zeitraum | Flexibel; keine konkreten Reisedaten bekannt |
| Dauer | Noch offen; technische Planungsannahme: 7 Nächte, konfigurierbar und sichtbar als Annahme |
| Gesamtbudget | Maximal 2.000 € für beide Personen zusammen einschließlich relevanter Nebenkosten und Reserve |
| Erste Zielauswahl | Kos, Malta, Valencia, Split/Makarska, Málaga, Gran Canaria |
| Plattform | Responsive Website, Smartphone zuerst, ohne Installation |
| Preiswahrheit | Keine erfundenen Livepreise, Flugverbindungen, Verfügbarkeiten, Hotels, Buchungsnummern oder Reservierungen |
| Abschluss | Persönlichen Reisewunsch bestätigen; verbindliche Planung und Buchung erfolgen anschließend außerhalb der App |

Die genannten Ziele sind **Vorschlagsziele**, keine Zusicherung, dass jedes Ziel zu jedem Termin für 2.000 € erreichbar ist. Das Budget darf nicht durch Weglassen von Kosten oder Reduzieren der Reisendenzahl passend gerechnet werden.

### 1.1 Ziele und Erfolgskriterien

- Der Geschenkcharakter ist nach dem Öffnen sofort verständlich.
- Der erste Bewertungsdurchlauf ist ohne Erklärung durch den Schenkenden möglich.
- Jede Geste hat eine gleichwertige, beschriftete Schaltfläche.
- Die Empfängerin kann ihre Entscheidung ändern, ohne von vorn beginnen zu müssen.
- Der Kostenstand und offene Planungspunkte sind vor der Bestätigung klar.
- Der Ablauf funktioniert auf einem Smartphone vollständig mit Touch sowie vollständig ohne Wischgesten.
- Ein erneut gescannter QR-Code führt dauerhaft zum Geschenk und auf demselben Browser zum gespeicherten Fortschritt.

### 1.2 Rollen und Nicht-Ziele

**Empfängerin:** Ziele entdecken, bewerten, vergleichen, Wunsch festhalten und auf Wunsch teilen.

**Schenkender/Betreiber:** Inhalte, Bilder, Budgetannahmen und URL vorab konfigurieren; anschließend außerhalb der App Angebote prüfen und gemeinsam buchen. Im MVP ist hierfür kein Adminbereich erforderlich.

**Nicht im MVP:** Buchung oder Bezahlung, Konten, Login, Chat, automatische Benachrichtigungen, Reise-API, Preis-Scraping, Tracking, KI-Reiseberatung, Hotelbewertungen, echte Flugtickets, gemeinsamer Gerätestand, PWA-Installation oder vollständiger Offlinebetrieb. Keine Airline-Marken oder täuschend echten Buchungsbestätigungen verwenden.

## 2. Prioritäten und feste MVP-Entscheidungen

`P0/MUSS` ist Voraussetzung für die Abnahme. `P1/SOLL` folgt nach dem stabilen MVP. `P2/KANN` ist optional. Wenn nicht anders markiert, gilt eine Anforderung in dieser Datei als P0.

| Priorität | Umfang |
|---|---|
| P0 | Begrüßung, sechs Zielkarten, echte lizenzierte Reisefotos, Swipe und Buttons, Details mit Galerie, Rückgängig, Fortschritt |
| P0 | Favoriten, Wiederansehen verworfener Ziele, Vergleich von zwei oder drei Favoriten, genau ein bestätigter Wunsch |
| P0 | Vollständiges Kostenmodell, ehrliche Offen-/Schätzstatus, feste Budgetgrenze, Änderbarkeit der Auswahl |
| P0 | Lokale Speicherung mit Fehlermodus, Textkopie und TXT-Download des Wunsches, Löschen eigener Daten |
| P0 | Barrierearme Navigation, mobile Qualität, Bildnachweise, Datenschutzinformation, HTTPS, stabile QR-Adresse, druckfähiger Gutschein |
| P0 | Konfigurationsprüfung, automatisierte Kernprüfungen, manuelle Mobil-/Druckabnahme, README |
| P1 | Native Teilen-Funktion als Komfortergänzung, JSON-Export/-Import für Gerätewechsel, zusätzliche Zielvarianten |
| P1 | Filter nach Reisecharakter, sortierbarer Vergleich, freiwillige lokale Notiz zum Wunsch |
| P2 | Geschützter Cloud-Abgleich und Benachrichtigung an den Schenkenden, CMS, Offline-PWA |

**Architekturentscheidung:** Statische Anwendung ohne Backend. „Bestätigen“ speichert lokal. Der Schenkende wird im MVP nicht automatisch informiert. Auf dem Ergebnisbildschirm stehen „Wunsch kopieren“ und „Als Text speichern“, damit die Empfängerin das Ergebnis zeigen oder selbst versenden kann. Das darf weder als „versendet“ noch als „beim Schenkenden eingegangen“ bezeichnet werden.

## 3. User Journey und Navigation

1. Boarding-Pass lesen und QR-Code scannen; alternativ die gedruckte URL eingeben.
2. Persönliche Begrüßung sehen: Geburtstag, Reise zu zweit, Meer und Entdeckungen.
3. „Reiseziele entdecken“ wählen; kurze Anleitung: links „Eher nicht“, rechts „Gefällt mir“.
4. Sechs Ziele entdecken; jederzeit Details öffnen, Bewertung zurücknehmen oder Favoriten ansehen.
5. Am Ende Favoriten prüfen oder verworfene Ziele erneut ansehen.
6. Zwei bis drei Favoriten vergleichen; bei nur einem Favoriten direkt dessen Wunsch bestätigen.
7. Ein Ziel auswählen, die Zusammenfassung prüfen und bewusst bestätigen.
8. Ergebnis kopieren/herunterladen oder zurückkehren und Wunsch ändern.

### 3.1 Routenvertrag

Der dauerhafte Einstieg ist `https://<eigene-domain>/reise/`. Die konkrete Domain wird vor Veröffentlichung eingetragen. Für statisches Hosting ohne Rewrite-Abhängigkeit verwendet der MVP Hash-Routing:

| Route relativ zum Einstieg | Inhalt |
|---|---|
| `#/` | Begrüßung; bei vorhandenem Stand zusätzlich „Weitermachen“ |
| `#/entdecken` | Kartenstapel oder Ende des Durchlaufs |
| `#/ziele` | Alle Ziele mit Filter „Alle“, „Favoriten“, „Eher nicht“, „Noch offen“ |
| `#/ziel/:id` | Detailseite eines aktiven Ziels |
| `#/favoriten` | Favoriten und Vergleichsauswahl |
| `#/vergleich` | Vergleich der ausgewählten Ziele |
| `#/wunsch/:id` | Prüfen und Bestätigen eines Ziels |
| `#/ergebnis` | Aktueller bestätigter Wunsch |
| `#/info` | Erklärung, Datenverwaltung, Datenschutz, Bildnachweise |

Die untere Hauptnavigation enthält „Entdecken“, „Favoriten“ mit Anzahl und „Info“. „Alle Ziele“ ist in Entdecken, am Stapelende und in Favoriten erreichbar. Nach Bestätigung erscheint zusätzlich ein deutlicher Link „Dein Reisewunsch“; die Hauptnavigation bleibt stabil.

Browser-Zurück verändert keine Bewertung. Detail-Zurück stellt Ursprungsroute und Scrollposition wieder her. Bei direktem Detailaufruf führt der sichtbare Zurück-Link zu „Alle Ziele“. Ungültige IDs und unbekannte Routen zeigen eine verständliche Meldung mit Rückweg. `#/ergebnis` ohne Bestätigung führt zu Favoriten; `#/vergleich` mit weniger als zwei gültigen IDs zeigt die Auswahlaufforderung.

Beim ersten Besuch öffnet der QR-Link die Begrüßung. Bei Folgebesuchen zeigt sie „Weitermachen“ und gegebenenfalls „Dein Reisewunsch“. Keine automatische Weiterleitung, die die Geburtstagsbotschaft unsichtbar macht. Ein Direktlink zu einer Unterseite wird respektiert.

## 4. Funktionale Anforderungen

| ID | Anforderung |
|---|---|
| F-01 | Anrede, Geschenktext, Signatur, Farben und Reiserahmen sind konfigurierbar; neutrale Texte funktionieren ohne Namen. |
| F-02 | Jede aktive Destination erscheint einmal im initialen Stapel, in konfigurierter Reihenfolge. Kein zufälliges Umsortieren beim Neuladen. |
| F-03 | Rechts bewertet als `liked`, links als `passed`; unbewertet ist `unseen`. Favoriten werden aus `liked` abgeleitet. |
| F-04 | Alle Bewertungen funktionieren identisch per Geste und Schaltfläche. Ein technischer Ereignis-Doppler erzeugt keine zweite Entscheidung. |
| F-05 | Die letzte Bewertungsänderung ist rückgängig zu machen; wiederholtes Rückgängig arbeitet die Sitzungshistorie ab. |
| F-06 | Details enthalten Galerie, Reisecharakter, Meer-/Kulturideen, mögliche Basis, Anreise-Prüfhinweise, Dauerannahme, Kosten und Quellenstand. |
| F-07 | „Eher nicht“ ist jederzeit über „Alle Ziele“ erreichbar; Bewertungen sind dort änderbar. |
| F-08 | Favoriten lassen sich entfernen und zwei bis drei davon gezielt vergleichen. Kein automatischer „Sieger“. |
| F-09 | Ein Favorit kann als Wunsch ausgewählt werden; ein anderer Wunsch ersetzt ihn erst nach erneuter ausdrücklicher Bestätigung. |
| F-10 | Erfolgsmeldung unterscheidet persistent gespeichert, nur temporär vorgemerkt und ausdrücklich exportiert. |
| F-11 | Neuladen und erneutes Scannen erhalten den Stand im selben Browser, sofern dessen Speicher verfügbar ist. |
| F-12 | „Auswahl zurücksetzen“ löscht nach Bestätigung Bewertungen, Vergleich, Historie und Wunsch; kein Löschen fremder Website-Daten. |
| F-13 | Wunschtext enthält Ziel, zwei Reisende, Startoptionen, flexible Daten, Dauerannahme, Budgetgrenze, Kostenstatus und „Noch nicht gebucht“. |
| F-14 | Bild-, Speicher- und Netzwerkfehler führen zu nutzbaren Rückwegen, nicht zu einem leeren Bildschirm. |
| F-15 | Der Betreiber kann Ziele und Texte durch Datenänderung und Neubau pflegen, ohne UI-Komponenten zu ändern. |

### 4.1 Exakte Swipe-Interaktion

**Geometrie und Auslösung** – Werte sind verbindliche Ausgangswerte und bei begründeter Geräteprüfung zentral anpassbar:

- Nur die vorderste Karte ist interaktiv; nachfolgende Karten sind aus Fokusreihenfolge und Accessibility Tree entfernt.
- `pointerdown` auf der nicht interaktiven Kartenfläche startet eine mögliche Geste. Buttons, Links und Galerieelemente starten keine Geste.
- Ein Tap unter 10 CSS-Pixel Gesamtbewegung bewertet nichts. Details werden über den beschrifteten Detailbutton geöffnet.
- Richtung ab 12 CSS-Pixel Bewegung bestimmen: horizontal sperren, wenn `abs(dx) >= 1.25 * abs(dy)`; vertikal freigeben, wenn `abs(dy) >= 1.25 * abs(dx)`; sonst weiter beobachten.
- Eine einmal als vertikal erkannte Bewegung bleibt für diese Geste Scrollen. Native Zoom- und vertikale Scrollgesten erhalten; Kartenfläche mit `touch-action: pan-y pinch-zoom` testen.
- Commit ausschließlich bei `pointerup` einer horizontal erkannten Geste: `abs(dx) >= max(80, 0.25 * Kartenbreite)` CSS-Pixel. Keine alleinige Auslösung durch Geschwindigkeit.
- `dx > 0`: „Gefällt mir“. `dx < 0`: „Eher nicht“. Unterhalb der Schwelle springt die Karte ohne Zustandsänderung zurück.
- `pointercancel`, Fokusverlust, Wechsel des Tabs oder zweiter Touch brechen ab. Keine Bewertung durch abgebrochene Gesten.
- Während des Ziehens bewegt sich die Karte proportional; Rotation maximal ±8°. Text plus Symbol zeigen die Richtung, Farbe allein genügt nicht.
- Commit schreibt genau einmal den neuen Zustand und startet etwa 200 ms Ausblendung. Währenddessen ist eine zweite Bewertung gesperrt. Sperre nach Abschluss oder spätestens 400 ms aufheben, auch wenn kein Animationsereignis eintrifft.
- Nach der Entscheidung zeigt sich die nächste unbewertete Karte. Eine höfliche Statusansage nennt Ziel, Bewertung und verbleibende Anzahl.
- Bei `prefers-reduced-motion` Rotation und Fluganimation entfernen; sofortiger Austausch oder kurzes Überblenden bis 100 ms.
- Die ersten 20 CSS-Pixel am linken/rechten Viewportrand nicht als Swipe-Startfläche nutzen, um Browser-Navigationsgesten zu respektieren.

**Buttons:** Unter der Karte dauerhaft „Eher nicht“, „Details“, „Gefällt mir“; darunter/oberhalb „Rückgängig“. Keine reine Symbolbedienung. Rückgängig ohne Historie ist deaktiviert und erklärt „Noch keine Entscheidung“.

**Tastatur:** Tab erreicht alle sichtbaren Aktionen; Enter/Leertaste aktiviert Buttons. Links/Rechts dürfen nur bei Fokus auf dem ausdrücklich beschrifteten Kartencontainer dieselben Bewertungsaktionen auslösen; keine globalen Tastenkürzel in Formularen, Galerie oder Dialogen. Escape schließt Dialoge, verändert keine Auswahl.

**Zustandsregeln:**

- Der Fortschritt ist „X von N Zielen bewertet“, wobei `X` alle aktiven Ziele mit Status ungleich `unseen` zählt. Like und Pass zählen beide.
- Details öffnen/schließen, Bilder wechseln und Tabs wechseln verändern weder Bewertung noch Fortschritt.
- „Favorit entfernen“ setzt auf `passed`. „Wieder offen“ setzt auf `unseen`; dieses Ziel erscheint wieder entsprechend der ursprünglichen Reihenfolge.
- „Verworfene Ziele erneut ansehen“ setzt ausschließlich `passed` auf `unseen`, behält Likes und zeigt den Stapel. Dies ist eine zusammenhängende, rückgängig machbare Aktion.
- Rückgängig stellt den vollständigen vorherigen Bewertungs-/Vergleichszustand der letzten Aktion wieder her. Im Stapel wird das zuletzt betroffene Ziel sichtbar, auch wenn es zuvor schon bewertet war; danach folgen wieder offene Ziele. Eine erneute Bewertung desselben Zustands ist ein No-op und erzeugt keinen Historieneintrag.
- Eine laufende Bestätigung ist keine Swipe-Aktion und wird nicht über Rückgängig aufgehoben. Änderungen an bestätigten Zielen erfordern den gesonderten Ablauf aus Abschnitt 4.3.
- Nach erfolgreicher Wunschbestätigung die bisherige Undo-Historie leeren. Jede spätere Undo-Aktion, die den bestätigten Favoriten entfernen würde, unterliegt ebenfalls dem Aufhebungsdialog aus Abschnitt 4.3.

### 4.2 Favoriten und Vergleich

Favoriten sind nach konfigurierter Zielreihenfolge sortiert. Jede Zeile zeigt Bild, Zielname, Charakter, Kostenstatus, „Details“, „Vergleichen“ und „Als Wunsch auswählen“. Favoriten entfernen und Vergleichsauswahl sind getrennte Aktionen.

- Keine Favoriten: „Noch kein Ziel dabei? Schau dir die Ziele noch einmal an.“ Aktionen: „Weiter entdecken“, „Alle Ziele“.
- Ein Favorit: Bestätigung möglich; Vergleich erklärt „Wähle mindestens zwei Favoriten“.
- Zwei bis drei ausgewählte Favoriten: „Vergleichen (N)“ aktiv.
- Bei einem vierten Auswahlversuch bleibt die bisherige Auswahl erhalten; Meldung „Du kannst bis zu drei Ziele vergleichen.“
- Entfernte Favoriten verschwinden auch aus der Vergleichsauswahl. Unter zwei verbleibenden Zielen ersetzt ein Auswahlhinweis den Vergleich.
- Vergleichskriterien: Meer/Strand, Sehenswürdigkeiten, Reisecharakter, Basis/Transfers, mögliche Startorte mit Prüfstatus, Dauer/Zeitraum, Kostenspanne, enthaltene Kosten, offene Punkte und Quellenalter.
- Unbekannte Werte erscheinen als „Noch offen“; keine erfundenen Sterne, Scores oder behaupteten Flugzeiten.
- Kosten nur bei gleichen Grundlagen direkt vergleichbar nennen: zwei Personen, dieselbe Nachtzahl und derselbe Datums-/Zeitraumstand. Sonst „Unterschiedliche Planungsgrundlagen“ anzeigen.
- Auf kleinen Displays Kriterien untereinander mit jeweils zwei/drei beschrifteten Zielwerten darstellen; kein ausschließlich horizontal scrollbarer Tabellenvergleich. Auf breiten Displays Tabelle mit klaren Spaltenüberschriften.

### 4.3 Wunsch bestätigen und ändern

Die Prüfseite nennt Ziel, gegebenenfalls Basisvariante, Reiserahmen, Budget und Kostenstatus. Der Pflichttext lautet sinngemäß:

> Das ist dein Reisewunsch für uns zwei. Termine, Anreise und Unterkunft planen wir gemeinsam. Die Reise ist noch nicht gebucht; wir bleiben insgesamt bei höchstens 2.000 €.

Bei unbekannten, unvollständigen oder veralteten Kosten ergänzt die Seite: „Ob diese Reise in unser Budget passt, prüfen wir noch.“ Eine leere, erforderliche Checkbox lautet „Ich möchte dieses Ziel vormerken und weiß, dass die konkrete Reise noch geprüft wird.“ Auch bei vollständiger Schätzung bleibt der Buchungshinweis sichtbar. Abschließender Button: **„Reisewunsch bestätigen“**.

Kostenregeln aus Abschnitt 6 gelten: Bei `over_budget` ist der Bestätigungsbutton gesperrt; „Budgetplanung überarbeiten“ erklären, keine Bezahl- oder Aufstockungsaufforderung. Bei `unknown`, `stale` oder `uncertain` ist ausschließlich ein ausdrücklich bedingter Wunsch erlaubt. Ein Like ist immer zulässig und keine Budgetfreigabe.

Eine Bestätigung schreibt genau einen `confirmedWish`-Datensatz. Doppelklick wiederholt denselben Vorgang nicht. Der Ergebnisbildschirm nennt den Speicherstatus und „Noch nicht gebucht“. Keine Reservierungsnummer erzeugen.

„Wunsch ändern“ führt zurück zu den Favoriten; der bisherige Wunsch bleibt erhalten, bis ein neuer bestätigt wird. Abbrechen behält den bisherigen Wunsch. Beim Entfernen/Zurücksetzen der Bewertung des bestätigten Ziels erscheint ein Dialog: „Damit hebst du deinen bisherigen Reisewunsch auf.“ Erst Bestätigung löscht den Wunsch und führt die Änderung aus. Diese Aktion leert die Undo-Historie, damit sie keine Bestätigung unbemerkt wiederherstellt. Globales Zurücksetzen erfordert ebenfalls Bestätigung.

Bereits bestätigte Wünsche bleiben bei späteren Datenänderungen als datierter Snapshot lesbar. Wird das Ziel deaktiviert oder seine Planung verändert, erscheint „Planung wurde aktualisiert – bitte erneut prüfen“. Ein überbudgetärer neuer Stand darf nicht als weiterhin finanzierbar erscheinen.

## 5. UX-Screens und Gestaltung

| Screen | Pflichtinhalt und Aktionen | Sonderzustände |
|---|---|---|
| S-01 Begrüßung | „Alles Gute zum 18.!“, persönliche Botschaft, „Wir zwei. Meer. Neue Orte.“, Reiseziele entdecken, Budgetrahmen dezent aber auffindbar | Ohne Namen neutrale Ansprache; vorhandenen Stand fortsetzen |
| S-02 Entdecken | Fortschritt, großes Foto, Ziel/Land, ein Satz, höchstens drei Tags, Kostenstatus, drei Hauptbuttons, Rückgängig | Ladezustand mit reservierter Bildfläche, Bildfallback, Stapelende |
| S-03 Details | Zielüberschrift, 3–5 Fotos, Galeriebuttons mit Zähler, Meerideen, Kulturideen, Anreise, Planungsannahmen, Kostenaufschlüsselung, Quellen | Keine horizontalen Swipe-Gesten in der Galerie; Galeriebuttons vermeiden Konflikte mit Kartenbewertung |
| S-04 Alle Ziele | Sechs Ziele, Statusfilter, Details, Like/Pass/Wieder-offen-Aktionen | Kein Treffer erklärt Filter; keine scheinbar verschwundenen Ziele |
| S-05 Favoriten | Anzahl, Zielkarten, Vergleichsauswahl, Wunsch auswählen | 0/1/2/3/>3 Favoriten; maximal drei Vergleichsspalten |
| S-06 Vergleich | Einheitliche Kriterien mit Zielzuordnung, Details, Wunsch auswählen | Unvollständige Kosten und ungleiche Annahmen deutlich markieren |
| S-07 Wunsch prüfen | Vollständige Zusammenfassung, Pflichtbestätigung, Zurück, Reisewunsch bestätigen | Über Budget, offene Planung, bisheriger Wunsch vorhanden |
| S-08 Ergebnis | Gewähltes Ziel, „Das wird unser nächstes Abenteuer“, Buchungs-/Speicherstatus, Kopieren, TXT-Download, Wunsch ändern | Speicherfehler, Kopierfehler, später veränderte Planung |
| S-09 Info | So funktioniert es, Reiserahmen, lokale Speicherung, Daten löschen, Datenschutz, Bildnachweise | Bestätigungsdialog zum Löschen, Fehler beim Zugriff auf Speicher |
| S-10 Druckvorlage | Boarding-Pass als Gutschein, zwei Reisende, Start Dresden/Berlin, Ziel „Du entscheidest“, Datum „Nach Absprache“, QR und Klartext-URL | Nur Betreiber-Artefakt; nicht Teil der Empfängerinnen-Navigation |

**Visuelle Richtung:** Warm, persönlich, sommerlich, hochwertig. Heller sandfarbener Hintergrund, tiefes Marineblau für Text, Koralle als Akzent, großzügige Reisefotos. Farben anhand der Kontrasttests finalisieren. Kein kopiertes Dating-App-Logo. „Gefällt mir“ ist verständlicher als „Match“. Kein Countdown, künstlicher Zeitdruck, Autoplay-Ton oder Pflicht-Konfetti.

Mobile Karte mit ungefähr 4:5-Bildfläche; auf niedrigen Displays Bildfläche verkleinern oder Seite scrollen lassen, ohne Buttons abzuschneiden. Mindestens 16 px Fließtext als Projektvorgabe. Breite ab 320 CSS-Pixel; Tablet/Desktop bis mindestens 1440 px sinnvoll nutzen. `safe-area-inset-bottom` berücksichtigen. Feste Navigation darf Inhalt und Fokus nicht verdecken.

Text, Fehlermeldungen, Währung und Datumsdarstellung sind deutsch (`de-DE`, EUR). „2.000 € für zwei Personen insgesamt“ verwenden, nicht nur „ab 999 €“.

## 6. Reiseinhalte, Kosten und Budgetlogik

### 6.1 Redaktioneller Startbestand

Die folgende Tabelle ist eine Inhaltsvorlage, keine aktuelle Reiseempfehlung oder bestätigte Reiseroute. Der Coding-Agent recherchiert für veröffentlichte konkrete Sehenswürdigkeiten und Reisehinweise passende offizielle Tourismusquellen und speichert sie im Datensatz. Keine aktuellen Eintrittspreise, Öffnungszeiten, Direktflüge, Wetter- oder Badegarantien ohne Nachweis ergänzen.

| ID / Ziel | Charakter für den Kartenentwurf | Zu füllende Inhaltsbereiche | Besondere Planungsfrage |
|---|---|---|---|
| `kos` / Kos, Griechenland | „Strandtage und griechische Geschichte“ | Tatsächliche Strandmotive, Stadt-/Geschichtsorte, Ausflugsideen | Unterkunftslage und Transferbedarf prüfen |
| `malta` / Malta | „Meerblicke und historische Städte“ | Küsten-/Bademöglichkeiten, Stadtbesuche, Ausflüge | Gewünschte Strandart und Wege zwischen Basis und Ausflügen prüfen |
| `valencia` / Valencia, Spanien | „Stadt entdecken, am Meer entspannen“ | Stadtstrand, historische und moderne Stadtorte | Lage zwischen Innenstadt und Meer berücksichtigen |
| `split-makarska` / Split/Makarska, Kroatien | „Küstenurlaub mit Kulturstopps“ | Stadt-/Küstenmotive, Strandideen, Tagesausflüge | Split und Makarska als unterschiedliche Basisvarianten kennzeichnen; Transfer nicht unterschlagen |
| `malaga` / Málaga, Spanien | „Stadtleben und Meer in Andalusien“ | Stadt-/Strandmotive, Kulturorte, mögliche Tagesausflüge | Stadturlaub und weitere Küstenbasis nicht vermischen |
| `gran-canaria` / Gran Canaria, Spanien | „Meer, Inselorte und Landschaften“ | Strandmotive, Stadt-/Ortsbesuche, Landschaftsausflüge | Konkrete Inselbasis und Ausflugstransfers prüfen |

Split/Makarska bleibt im MVP **eine** Karte mit Varianten „Basis Split“, „Basis Makarska“ und „Noch offen“. Wahl der Variante ist optional, für konkrete Kosten aber Teil der Annahmen. Keine Kosten einer Split-Basis für eine Makarska-Basis ausgeben. Alle anderen Ziele können zunächst eine Basis „Noch offen“ haben.

Pro Ziel erforderlich: ein Teaser, drei Charakter-Tags, mindestens zwei Meer-/Strandideen, zwei Sehenswürdigkeiten-/Kulturideen, ein unverbindlicher Tagesablauf, Anreise-Prüfpunkte, offene Punkte und 3–5 örtlich passende Fotos. Die Tagesidee benötigt keine Uhrzeiten und keine unbelegten Leistungsversprechen. Reisezeit und Unterkunft bleiben offen, solange keine Angaben vorliegen.

### 6.2 Vollständige Kostenkategorien

Jede Kategorie wird für **beide Personen und die gesamte Hin- und Rückreise** erfasst. `null` bedeutet unbekannt; `0` ist nur mit Begründung zulässig. Keine stillen Nullwerte.

| Kategorie | Umfang |
|---|---|
| `transport` | Hin-/Rückflug oder andere Hauptanreise, verbindliche Buchungs-/Servicekosten |
| `baggage` | Tatsächlich benötigtes Gepäck und notwendige Zusatzleistungen; keine Pflicht-Sitzplatzwahl erfinden |
| `originAccess` | Wege von den vereinbarten Startorten zum Flughafen/Bahnhof und zurück; bei Berlin-Abflug auch Dresden–Berlin, wenn Dresden tatsächlicher Start ist; nötige Parkkosten/Übernachtung |
| `accommodation` | Gesamte Unterkunft für zwei Personen und alle Nächte, Reinigung und zwingende Nebenkosten |
| `localTaxes` | Nicht bereits enthaltene Ortstaxen und sonstige Pflichtabgaben |
| `destinationTransfers` | Flughafen-/Bahnhoftransfer zur Unterkunft und zurück |
| `localMobility` | ÖPNV, nötige Mietwagen-/Kraftstoff-/Parkkosten, Fähren oder andere geplante Wege |
| `food` | Mahlzeiten, Getränke und Versorgung an An-/Abreisetagen; bereits enthaltene Verpflegung nicht doppelt zählen |
| `activities` | Geplante Eintritte, Ausflüge und Reservierungsgebühren |
| `insuranceAndDocuments` | Vereinbarte Versicherungen und etwaige notwendige Dokumentkosten; bestehende Deckung nur nach Prüfung als enthalten vermerken |
| `otherRequired` | Weitere konkret benötigte Kosten mit Einzelbeschreibung |

Persönliche freiwillige Einkäufe sind keine zugesagte Reiseleistung und werden als solche erklärt. Alle zur beschriebenen Reise nötigen Kosten gehören in die Rechnung. Hosting-/Domain-/Druckkosten separat ausweisen; falls sie aus demselben Geschenkbudget bezahlt werden, als `giftOverheadCents` vom verfügbaren Reisebudget abziehen. Standard für nicht bekannte Geschenknebenkosten ist `null`, nicht 0.

### 6.3 Berechnung und Status

Geld ausschließlich als ganzzahlige Euro-Cent-Werte speichern und berechnen. Keine Gleitkomma-Euro-Summen. Jede Kostenzeile enthält `minCents` und `maxCents`, Herkunft, Status, Stand und Annahmen. Bei Einzelpreisen sind beide Werte gleich; ein dokumentierter Preis ist weiterhin keine Verfügbarkeitsgarantie.

Mögliche Zeilenstatus: `unknown`, `estimate`, `observed`, `included`, `notApplicable`. `included` referenziert eine andere kostenführende Zeile desselben Szenarios; `notApplicable` braucht eine Begründung. Beide haben 0/0 und werden nicht doppelt gezählt. Zyklen oder ungültige Verweise verhindern den Build.

**Projektvorgabe Reserve:** `reserve = max(20000, ceil(0.10 * subtotalMax))` Cent. Bei vollständig bekannten Basiswerten ist die Reserve also mindestens 200 €. Diese Zahlen sind eine Planungsregel, keine Marktpreisaussage. `subtotalMin/Max` summieren alle kostenführenden Zeilen. Für die dargestellte Spanne dieselbe, konservativ aus `subtotalMax` ermittelte Reserve auf beide Grenzen addieren.

`totalMin/Max = subtotalMin/Max + reserve + giftOverheadCents`. Der Vergleich erfolgt immer mit `200000` Cent. Fehlt irgendein erforderlicher Betrag oder eine notwendige Annahme, ist die Gesamtsumme unbekannt; bekannte Teilsummen dürfen mit dem Label „Unvollständige Teilsumme“ erscheinen.

Status in dieser Reihenfolge ableiten:

1. **`over_budget`:** Vollständige `totalMin > 200000`, oder bereits bekannte Teilkosten plus Mindestreserve und bekannte Geschenknebenkosten überschreiten 200000. Bestätigung gesperrt; Favorisieren bleibt erlaubt.
2. **`unknown`:** Erforderliche Zeilen, Geschenknebenkosten oder Planungsannahmen fehlen. Keine grüne Budgetaussage.
3. **`stale`:** Vollständige Zahlen, aber mindestens eine kostenführende Schätzung/Beobachtung älter als konfigurierbar 14 Tage oder explizit abgelaufen. Der Status muss zusätzlich eine rechnerische Überschreitung der Obergrenze sichtbar nennen.
4. **`uncertain`:** Vollständig und aktuell, `totalMin <= 200000 < totalMax`. „Budget noch nicht gesichert“.
5. **`within_estimate`:** Vollständig und aktuell, `totalMax <= 200000`. „Nach dieser Schätzung im Budget – noch kein gebuchtes Angebot“.

`estimate` und `observed` brauchen `checkedAt` sowie erläuterte Grundlagen; `observed` zusätzlich mindestens einen nachvollziehbaren Angebots-/Quellenlink. Das Prüfdatum wird nur bei tatsächlicher Überprüfung geändert. Ein abgelaufenes Angebot wird nie automatisch aktuell. Alter anhand des aktuellen Datums bestimmen; Uhrzeitunterschiede dürfen keine zukünftige Prüfung vortäuschen.

**Initiale Produktionsdaten:** Alle Reisebeträge `null`, Status `unknown`, bis sie nachvollziehbar recherchiert sind. Ein funktionsfähiger MVP darf offen ausgewiesene Kosten haben. Er darf dann keinen der sechs Vorschläge als für 2.000 € garantiert darstellen. Falls der Betreiber ausschließlich budgetgeprüfte Ziele veröffentlichen möchte, muss er vor Veröffentlichung mindestens ein vollständiges, aktuelles Szenario pflegen; diese strengere Redaktion ist kein Vorwand für erfundene Werte.

Vergleiche Dresden/Berlin anhand getrennter Szenarien. Jedes Szenario enthält die tatsächliche Ausgangsstadt, den Abflugort, Transferkosten, Reisedaten bzw. flexible Periode, Nächte, Basisvariante und Gepäckannahmen. Keine vermeintlich günstigste Startoption automatisch auswählen, wenn nicht beide vollständig und vergleichbar sind.

## 7. Konfiguration und Datenmodell

### 7.1 Dateien und Validierung

- `content/app.config.json`: Geschenktext, Projekt-ID, Locale, Budget, Reihenfolge, öffentliche URL, Aufbewahrungsfrist.
- `content/destinations.json`: Ziele, Varianten, Inhalte, Bildreferenzen, Planungsszenarien.
- `content/images.json`: Bilddateien, Urheber-/Lizenznachweise, Alt-Texte, Zuschnitt.
- `content/sources.json`: Inhalts-/Angebotsquellen mit Prüfstand.
- `public/images/`: optimierte, selbst gehostete Bildvarianten.

Alle Dateien beim Build mit einem Laufzeitschema validieren. IDs sind stabil und unabhängig von Anzeigenamen. Unbekannte Felder erkennen, Referenzen auflösen, doppelte IDs und verwaiste Bild-/Quellenreferenzen abweisen. Entwicklung erlaubt markierte Platzhalter; Produktionsprüfung blockiert fehlende Bildrechte, falsche Zielanzahl im initialen Release, ungültige URL oder unbelegte Preisbehauptungen. Unbekannte Kosten sind ausdrücklich erlaubt.

### 7.2 Typvertrag

Die folgende TypeScript-Notation ist der verbindliche Fachvertrag; daraus konkrete Schemas und Typen ableiten. `ISODate` ist `YYYY-MM-DD`, `ISODateTime` ein UTC-Zeitstempel. Freitext wird als Text gerendert, niemals ungeprüft als HTML.

```ts
type ISODate = string;
type ISODateTime = string;
type Id = string;
type Cents = number; // Integer >= 0
type Decision = 'unseen' | 'liked' | 'passed';
type CostStatus = 'unknown' | 'estimate' | 'observed'
  | 'included' | 'notApplicable';
type BudgetStatus = 'unknown' | 'stale' | 'over_budget'
  | 'uncertain' | 'within_estimate';
type CostCategory = 'transport' | 'baggage' | 'originAccess'
  | 'accommodation' | 'localTaxes' | 'destinationTransfers'
  | 'localMobility' | 'food' | 'activities'
  | 'insuranceAndDocuments' | 'otherRequired';

interface AppConfig {
  schemaVersion: 1;
  contentVersion: string;
  giftId: Id; // nicht personenbezogen, kein Passwort
  locale: 'de-DE';
  currency: 'EUR';
  recipientFirstName: string | null;
  senderDisplayName: string | null;
  greeting: string;
  travelers: 2;
  allowedOrigins: ['Dresden', 'Berlin'];
  budgetCapCents: 200000;
  giftOverheadCents: Cents | null;
  defaultNights: number; // 7 als erkennbare Planungsannahme
  dates: { mode: 'flexible'; earliest: ISODate | null;
    latest: ISODate | null };
  reserve: { minCents: 20000; percent: 10 };
  staleAfterDays: number; // 14
  retentionDays: number; // 180 seit letzter aktiver Änderung
  publicBaseUrl: string; // absolute HTTPS-URL mit /reise/
  destinationOrder: Id[];
  theme: { background: string; text: string; accent: string };
}

interface Source {
  id: Id;
  kind: 'tourism' | 'provider' | 'editorial' | 'license';
  title: string;
  url: string;
  checkedAt: ISODate;
  supports: string; // konkret belegte Aussage, kein pauschaler Nachweis
}

interface ImageAsset {
  id: Id;
  destinationId: Id;
  files: { avif: string; webp: string; fallback: string };
  width: number;
  height: number;
  alt: string;
  caption: string;
  focalPoint: { x: number; y: number }; // jeweils 0..1
  creator: string;
  sourcePageUrl: string;
  licenseName: string;
  licenseUrl: string;
  attributionText: string;
  licenseEvidencePath: string; // interner Nachweis, nicht öffentlich nötig
  acquiredAt: ISODate;
  edits: string[]; // z. B. Zuschnitt, Kompression
}

interface CostLine {
  id: Id;
  category: CostCategory;
  label: string;
  status: CostStatus;
  minCents: Cents | null;
  maxCents: Cents | null;
  checkedAt: ISODate | null;
  validUntil: ISODateTime | null;
  sourceIds: Id[];
  includedInLineId: Id | null;
  rationale: string;
}

interface TravelScenario {
  id: Id;
  label: string;
  variantId: Id | null;
  travelers: 2;
  originCity: 'Dresden' | 'Berlin';
  departureAirport: 'DRS' | 'BER' | null;
  mode: 'flight' | 'rail' | 'car' | 'open';
  routeStatus: 'unverified' | 'researched';
  dateBasis: { type: 'open' | 'period' | 'exact';
    from: ISODate | null; to: ISODate | null };
  nights: number;
  baggageAssumption: string | null;
  accommodationAssumption: string | null;
  mealAssumption: string | null;
  assumptions: string[];
  sourceIds: Id[];
  costs: CostLine[];
}

interface Destination {
  id: Id;
  active: boolean;
  title: string;
  country: string;
  teaser: string;
  tags: string[];
  imageIds: Id[]; // 3 bis 5, erstes Bild = Kartenmotiv
  seaIdeas: { title: string; text: string; sourceIds: Id[] }[];
  cultureIdeas: { title: string; text: string; sourceIds: Id[] }[];
  sampleDay: string;
  variants: { id: Id; label: string; notes: string }[];
  travelNotes: string[];
  openQuestions: string[];
  scenarios: TravelScenario[];
  defaultScenarioId: Id | null;
  sourceIds: Id[];
  editorialCheckedAt: ISODate | null;
}

interface ConfirmedWish {
  id: Id;
  destinationId: Id;
  variantId: Id | null;
  scenarioId: Id | null;
  confirmedAt: ISODateTime;
  contentVersion: string;
  acknowledgedConditionalPlanning: true;
  snapshot: {
    title: string;
    travelers: 2;
    origins: string[];
    nights: number;
    dateLabel: string;
    budgetCapCents: 200000;
    totalMinCents: Cents | null;
    totalMaxCents: Cents | null;
    budgetStatus: BudgetStatus;
    assumptions: string[];
    notBooked: true;
  };
}

interface SelectionState {
  schemaVersion: 1;
  giftId: Id;
  contentVersion: string;
  revision: number;
  updatedAt: ISODateTime;
  expiresAt: ISODateTime;
  onboardingSeen: boolean;
  decisions: Record<Id, Decision>;
  compareIds: Id[]; // eindeutig, maximal 3, alle liked und aktiv
  selectedVariantByDestination: Record<Id, Id | null>;
  selectedScenarioByDestination: Record<Id, Id | null>;
  confirmedWish: ConfirmedWish | null;
}
```

`TravelScenario.costs` muss jede Kategorie mindestens einmal abdecken; mehrere Zeilen pro Kategorie sind erlaubt. Ein offenes Datum reicht für einen Wunsch, aber nicht für die Aussage einer konkreten preisgeprüften Reise. `dateBasis.type = open` erzwingt deshalb `unknown`. Bei `period` die Periode und Schätzannahmen sichtbar ausgeben; daraus niemals ein konkret buchbares Angebot ableiten. `minCents <= maxCents` gilt für bekannte Werte. Teilweise gefüllte Werte sind ungültig; beide `null` oder beide Zahlen.

Summen und Budgetstatus werden berechnet, nicht parallel als editierbare Stammdaten gespeichert. Nur der Bestätigungssnapshot friert sie zur Nachvollziehbarkeit ein. Fehlt ein gewähltes Szenario, bleibt der Kostenstand offen. „Noch offen“ bei Varianten ist `null` und keine fingierte Ortsentscheidung.

Varianten- und Szenariowahl erfolgen in Details oder auf der Wunschprüfseite über beschriftete Auswahlfelder. Ein Variantenwechsel löscht ein nicht mehr passendes ausgewähltes Szenario und berechnet den Kostenstand neu. Die Szenarioliste zeigt nur passende Varianten; ohne Szenario bleiben flexible Wunschdaten zulässig. Ein vorhandenes `defaultScenarioId` wird nur übernommen, wenn es zur gewählten Variante passt. Auswahlfelder ändern einen bereits bestätigten Snapshot nicht; dafür ist erneute Bestätigung nötig. Die Checkbox der Wunschprüfseite wird beim Wechsel von Ziel, Variante oder Szenario zurückgesetzt und selbst nicht dauerhaft gespeichert.

### 7.3 Beispiel für ehrliche Initialdaten

```json
{
  "id": "kos-transport-open",
  "category": "transport",
  "label": "Hin- und Rückreise für zwei Personen",
  "status": "unknown",
  "minCents": null,
  "maxCents": null,
  "checkedAt": null,
  "validUntil": null,
  "sourceIds": [],
  "includedInLineId": null,
  "rationale": "Zeitraum, Verbindung und Gepäck noch gemeinsam festzulegen."
}
```

Dieses Muster verwenden, bis echte Grundlagen vorliegen. Synthetische Zahlen gehören ausschließlich in Test-Fixtures und dürfen nicht in Produktionsinhalte importiert werden.

## 8. Persistenz und Fehlerbehandlung

### 8.1 Lokaler Speicher

`localStorage` unter genau einem projektspezifischen Schlüssel `reise-swipe:<giftId>:state` verwenden. Nach jeder abgeschlossenen fachlichen Änderung den gesamten validierten `SelectionState` schreiben; niemals pro Pointer-Bewegung. Speicherzugriffe inklusive Lesen abfangen. Im Zustand sind keine Bilder, ausführbaren Inhalte, API-Schlüssel oder unnötigen persönlichen Angaben enthalten.

Die Undo-Historie liegt nur im Arbeitsspeicher und hält maximal 50 Zustands-Snapshots ohne personenbezogene Freitexte. Neuladen leert Undo, aber nicht die aktuelle Auswahl; die UI erklärt dies bei Bedarf. Route und Scrollposition sind Navigationszustand, keine verbindlichen Reisedaten.

Lokale Speicherung ist browser-/ursprungsgebunden. Ein anderer Browser, ein anderes Gerät oder gelöschte Browserdaten liefern keinen synchronisierten Stand. Privatmodus kann Daten beim Schließen verwerfen. Das erklärt die App in „Info“ und knapp beim Ergebnis. Grundlage: [MDN – localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

### 8.2 Laden, Migration und mehrere Tabs

1. Konfiguration und Inhalte validieren.
2. Speicher laden und JSON sicher parsen; Schema und `giftId` prüfen.
3. Bekannte ältere Versionen kontrolliert migrieren und Migration testen.
4. Bei unbekannter neuerer Version nichts überschreiben; nur temporär arbeiten und einen expliziten Reset anbieten.
5. Bei defektem JSON verständliche Meldung und „Gespeicherten Stand zurücksetzen“ anbieten. Kein stilles Überschreiben des beschädigten Datensatzes vor dieser Entscheidung.
6. Nicht mehr aktive Ziele aus Bewertungen und Vergleich entfernen; bestätigten Snapshot behalten und als zu prüfen markieren. Neue Ziele mit `unseen` ergänzen. Änderungen an Inhaltsversionen dürfen Likes nicht pauschal löschen.
7. Nach 180 Tagen seit letzter aktiver Änderung lokale Daten beim nächsten Aufruf löschen; die App kann Daten eines geschlossenen Browsers nicht zeitgesteuert löschen. Aufbewahrung offen erklären.

Bei `storage`-Ereignissen aus einem anderen Tab wird ein aktueller gültiger Zustand übernommen, wenn keine Geste/Bestätigung läuft; Undo wird dabei geleert. Bei laufender Interaktion diese abbrechen und „Auswahl in anderem Tab geändert“ anzeigen, dann neu laden. Vor jedem Schreiben Revision prüfen. Da `localStorage` keine Transaktionen über mehrere Tabs bietet, gilt bei exakt gleichzeitigen Schreibvorgängen „letzter Schreibvorgang gewinnt“; keine verlustfreie Mehrbenutzer-Synchronisation versprechen.

### 8.3 Fehlerzustände

| Fehler | Erwartetes Verhalten |
|---|---|
| Speicher gesperrt/voll | Weiterbedienung im Arbeitsspeicher; dauerhafter Hinweis „Nur für diesen geöffneten Tab gespeichert“; Export empfehlen |
| Wunsch nicht dauerhaft gespeichert | Ergebnis: „Wunsch vorgemerkt – bitte kopieren oder herunterladen“; niemals „Dauerhaft gespeichert“ |
| Bild fehlt | Feste Bildfläche mit neutralem Hintergrund, Zielname und verständlichem Fallback; kein fremdes Ersatz-Reisefoto |
| Inhalte nicht ladbar | Wiederholen-Button, Rückweg; keine unendliche Ladeanimation |
| Verbindung fällt nach Laden aus | Bereits geladene Inhalte und lokale Auswahl bleiben bedienbar; ungeladene Bilder/Quellen mit Hinweis; Erstaufruf offline nicht zugesichert |
| Kopieren scheitert | Text in auswählbarem Feld anzeigen und TXT-Download anbieten |
| Download wird blockiert | Wunschtext bleibt vollständig sichtbar und manuell kopierbar |
| Keine aktiven Ziele | Klarer Wartungshinweis statt leerer Kartenstapel; Produktionsprüfung soll dies verhindern |
| JavaScript deaktiviert | `noscript`-Hinweis mit verständlicher Erklärung und ausgeschriebener Kontakt-/Abstimmungsalternative, falls konfiguriert |

## 9. Bildrechte und Inhalte

- Für den öffentlichen MVP echte, dem jeweiligen Ort zuordenbare Fotos verwenden. Keine KI-Bilder, die als echte Zielaufnahme erscheinen, und keine Platzhalterbilder fremder Orte.
- Eigene Fotos mit geklärten Rechten oder Bilder mit nachweislich passender Nutzungslizenz verwenden. Suchmaschinen-Vorschaubilder sind keine Lizenzquelle.
- Vor Download und Veröffentlichung prüfen, ob Speicherung, Bearbeitung, öffentliche Darstellung und nötige Namensnennung erlaubt sind. Lizenzbedingungen des konkreten Bildes dokumentieren; keine pauschale Plattformannahme.
- Zu jedem Bild Urheber, Ursprungsseite, Lizenzname/-link, Abrufdatum, Attributionswortlaut und Änderungen speichern. Bei eigenen Bildern Eigentum/Nutzungsfreigabe entsprechend dokumentieren; sensible Belege nicht öffentlich ausliefern.
- Lizenzbelege im Repository oder separatem Betreiberarchiv sichern. Production-Check prüft, dass jeder öffentliche Asset-Datensatz einen Nachweis hat.
- Bildnachweise in „Info“ nach Ziel gruppiert anzeigen; falls Lizenz nähere Platzierung verlangt, zusätzlich direkt am Bild verlinken.
- Bilder lokal ausliefern, sofern die Lizenz das erlaubt; kein ungeprüftes Hotlinking und keine externen Fototracker.
- Standort-/Kamerametadaten vor Veröffentlichung entfernen. Erkennbare Privatpersonen und persönliche Fotos nur mit geklärter Veröffentlichungserlaubnis verwenden.
- Responsive Bildvarianten, feste Dimensionen, sinnvoller Fokuspunkt und beschreibender Alt-Text. Wiederholte rein dekorative Bildkopien erhalten leeren Alt-Text.

## 10. Technische Architektur und Stackempfehlung

### 10.1 Verbindliche Standardumsetzung

Empfohlen: **React + TypeScript + Vite**, statischer Build, CSS Modules oder einfaches komponentenbezogenes CSS. Kleiner Hash-Router, React Context/useReducer für den fachlichen Zustand, Schema-Validierung beispielsweise mit Zod. Kein Backend und kein globales State-Framework nötig. Die Wahl ist eine Projektentscheidung für den kleinen, interaktiven Umfang; Vite unterstützt Entwicklung und Produktion statischer Assets. Siehe [Vite – Getting Started](https://vite.dev/guide/).

Swipe mit Pointer Events und zentraler Gestenlogik implementieren. Keine veraltete Swipe-Bibliothek ungeprüft übernehmen. QR-Code beim Build/lokal mit einer gepflegten Bibliothek als SVG/PNG erzeugen, ohne externen QR-Dienst. Für Tests Vitest und Testing Library sowie Playwright und axe-core vorsehen. Der Agent prüft bei Projektanlage aktuelle unterstützte, miteinander kompatible stabile Versionen und fixiert sie im Lockfile; diese Spezifikation behauptet keine „neueste“ Versionsnummer.

```text
src/
  app/                 Router, Layout, Fehlergrenze
  components/          Karte, Aktionsbuttons, Galerie, Vergleich, Dialog
  features/discovery/  Swipe und Stapel
  features/favorites/  Favoriten und Vergleichsauswahl
  features/wish/       Prüfung, Bestätigung, Export
  domain/              Typen, Schemas, Reducer, Budgetberechnung
  persistence/         Storage-Adapter, Migrationen
  content/             Laden und Auflösen validierter Inhaltsdaten
  styles/              Tokens und responsive Grundlagen
content/               JSON-Dateien gemäß Abschnitt 7
public/images/         Optimierte Reisefotos
scripts/               Daten-/Lizenzprüfung, QR-/Druckerzeugung
tests/                 Unit-, Integrations- und Ende-zu-Ende-Tests
docs/                  Betrieb, Redaktionshilfe, Abnahmeprotokoll
```

Fachlogik als reine Funktionen von UI und Browser-APIs trennen: `applyDecision`, `undoDecision`, `deriveDeck`, `calculateBudget`, `validateWish`, `reconcileState`. Uhrzeit und Storage für Tests injizierbar machen. Keine Preisberechnung im Präsentationsmarkup. Bestätigungslogik muss dieselbe Budgetfunktion wie Karte, Details und Vergleich verwenden.

### 10.2 Hosting und Veröffentlichung

- Beliebiges stabiles statisches Hosting mit HTTPS und eigener langlebiger URL; Anbieter anhand vorhandener Infrastruktur auswählen. Keine kostenpflichtige Buchung ohne separate Beauftragung.
- MVP produziert einen lokalen Build und eine prüfbare Vorschau. Öffentliche Veröffentlichung ist ein gesonderter Ausführungsschritt mit finalem Inhalt/URL, kein automatischer Nebeneffekt der Entwicklung.
- Host muss `/reise/` zuverlässig bedienen; Assets mit korrekt gesetztem Base-Pfad bauen. Hash-Unterseiten erfordern keine serverseitigen Einzelrouten.
- HTML mit kurzer Cachezeit/Revalidierung, versionierte Assets langfristig cachen. Nach Deployment darf kein alter HTML-Einstieg auf gelöschte Assets zeigen; atomare Releases bevorzugen.
- Sicherheitsheader am Host konfigurieren: restriktive Content Security Policy passend zum Build, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, Schutz gegen fremdes Einbetten. Keine unnötigen Drittanbieter-Verbindungen erlauben.
- Öffentliche URL, Datenschutzhinweis und Quellenlinks prüfen. Keine Geheimnisse im Frontend; Umgebungsvariablen eines statischen Builds sind kein Geheimnisspeicher.
- Rollback auf vorherigen Build dokumentieren; bestehende Speicherformate dabei berücksichtigen.

### 10.3 Spätere Cloud-Erweiterung (P2)

Nur bei explizitem Bedarf: API, zufällige serverseitig geprüfte Zugangstokens, minimaler Wunschdatensatz, Ratenbegrenzung, serverseitige Validierung, Lösch-/Aufbewahrungsregel und zuverlässige Übertragungsbestätigung ergänzen. Benachrichtigungen benötigen einen separat konfigurierten Empfänger und Fehlerbehandlung. Ein statischer JavaScript-PIN ist kein Zugriffsschutz. Die lokale Architektur muss über einen Storage-Adapter erweiterbar sein; keine ungenutzte Cloud-Infrastruktur im MVP bauen.

## 11. Nichtfunktionale Anforderungen

### 11.1 Leistung und Stabilität

- Initialer Bildschirm lädt nur das erste benötigte Bild; nächstes Kartenmotiv vorsichtig vorladen, weitere Galerieaufnahmen lazy laden.
- Projektbudgets: initiales JavaScript höchstens 250 KB gzip, mobile Kartenbilder möglichst höchstens 250 KB pro tatsächlich geladener Variante; keine Komplettgalerie im Erstaufruf.
- Zielwerte im reproduzierbaren mobilen Labortest: LCP <= 2,5 s, CLS <= 0,1; Interaktionen bei manueller Messung typischerweise <= 200 ms bis sichtbares Feedback. Keine Feldmesswerte behaupten, wenn nur Labortests vorliegen.
- Performanceprofil dokumentieren: Gerät/Emulation, Viewport, Netzwerk-/CPU-Drosselung, Browser und Build. Drei kalte Läufe, Median ausweisen. Abweichungen begründen und vor Freigabe beheben oder ausdrücklich dokumentieren.
- Keine unbehandelten Laufzeitfehler oder fehlenden Assets im vollständigen Hauptablauf.
- Zielbrowser: bei Abnahme aktuelle und vorherige Hauptversion von Safari auf iOS sowie Chrome auf Android; Desktop Chrome, Firefox, Edge und Safari als unterstützte aktuelle Browser. Konkrete getestete Versionen protokollieren.
- Automatisches WebKit-Testing ersetzt keinen echten iPhone-Test. Fehlt Hardware, diese Lücke transparent im Abnahmeprotokoll lassen.

### 11.2 Barrierefreiheit

Qualitätsziel ist **WCAG 2.2 AA für den vollständigen Kernablauf**. Eine bestandene automatische Prüfung allein rechtfertigt keine Konformitätsbehauptung. Maßgebliche Grundlage: [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

- Alle Wischaktionen über einzelne, beschriftete Klick-/Touchaktionen anbieten; dies berücksichtigt die Alternative zu Ziehbewegungen aus [W3C – Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html).
- Semantische Überschriften, echte Links/Buttons, `lang="de"`, verständliche zugängliche Namen.
- Textkontrast mindestens 4,5:1, großer Text mindestens 3:1; relevante Bedienelementgrenzen und Fokusindikatoren mindestens 3:1 gegen angrenzende Farben.
- Projektvorgabe: Touchziele mindestens 44 × 44 CSS-Pixel, mit ausreichendem Abstand.
- Sichtbarer Fokus, sinnvolle Reihenfolge, kein Tastaturfang. Dialogfokus setzen/einschließen und beim Schließen zum Auslöser zurückgeben.
- Statusänderungen über `aria-live="polite"`, ohne jede Drag-Bewegung anzusagen. Neue Karte mit Zielnamen erfassbar machen; Focus nach Buttonentscheidung sinnvoll auf entsprechendem Aktionsbutton halten.
- Bei Seitenwechsel Fokus zur Hauptüberschrift; Skip-Link zum Hauptinhalt.
- 200 % Textvergrößerung und Reflow bei 320 CSS-Pixel ohne Inhaltsverlust prüfen. Pinch-Zoom nicht sperren.
- Vergleichswerte mit Ziel und Kriterium verknüpfen. Auswahlstatus nicht allein durch Farbe oder Herzsymbol erklären.
- Reduzierte Bewegung respektieren; keine automatisch laufenden Bildergalerien.
- Manuell mit VoiceOver auf iOS und mindestens einer Desktop-Screenreader-/Browserkombination prüfen.

### 11.3 Datenschutz und Privatsphäre

Dies sind Produkt- und Betriebsanforderungen, keine pauschale rechtliche Freistellung:

- Keine Registrierung, Passdaten, Geburtstagsdaten, Anschrift, Standortfreigabe oder Kontaktdaten der Empfängerin erheben. Ein optionaler Vorname genügt für Personalisierung.
- Keine Analyse-, Marketing- oder Social-Media-Skripte. Fonts und Bilder selbst hosten. Externe Reisequellen erst nach bewusstem Linkklick öffnen.
- Info-Seite erklärt lokale Speicherung, Zweck, Datenumfang, Frist, manuelles Löschen, Gerätebindung und Export. Keine automatische Übertragung der Bewertungen an den Betreiber behaupten.
- Hosting kann IP-Adressen und technische Zugriffsdaten verarbeiten. Betreiber ergänzt tatsächlichen Anbieter, Zweck, Aufbewahrung und Kontakt; keine Aussage „Es werden überhaupt keine Daten verarbeitet“.
- Erforderliche Datenschutz-/Anbieterinformationen vor Veröffentlichung anhand der tatsächlichen Betriebsform klären. Ein Banner wird nicht vorsorglich eingebaut und auch nicht pauschal ausgeschlossen; die Entscheidung muss zur realen eingesetzten Technik passen.
- QR-Code und öffentliche Website enthalten keine vertraulichen Daten. Die statische Seite ist über ihren Link zugänglich; `noindex` ist kein Zugriffsschutz.
- `noindex, nofollow` und passende Hosting-Einstellungen als Schutz vor unbeabsichtigter Auffindbarkeit nutzen, ohne Vertraulichkeit zu versprechen. Linkvorschau neutral halten und keine privaten Bilder/Namen unnötig in Metadaten setzen.
- „Alle meine Auswahldaten löschen“ entfernt ausschließlich projektspezifische Browserdaten und den aktuellen Arbeitsspeicher. Hostlogs oder heruntergeladene Dateien werden dadurch nicht gelöscht; Hinweis entsprechend formulieren.

## 12. QR-Code, Boarding-Pass und Druck-Workflow

### 12.1 Dauerhafter Link

QR-Inhalt ist ausschließlich die finale HTTPS-Einstiegsadresse `https://<eigene-domain>/reise/`. Keine localhost-Adresse, Vorschau-URL, ablaufender Link, Anbietersession, Empfängername oder Auswahl im QR-Code. Ein QR-Code speichert keine Website; die Adresse muss erreichbar bleiben.

Falls ein eigener kurzer Pfad wie `/go` genutzt wird, leitet er unter eigener Kontrolle auf die aktuelle App weiter. Maximal eine Weiterleitung, keine Tracking-Parameter, kein fremder kostenpflichtiger „dynamischer QR“-Dienst. Der gedruckte Pfad muss bei Hostingwechsel erhalten bleiben. Mindestens zwölf Monate nach Übergabe und bis zum Abschluss der Reiseplanung verfügbar halten; Domainverlängerung beim Betreiber dokumentieren.

### 12.2 Druckartefakte

Der spätere Coding-Agent liefert aus derselben geprüften URL:

- `reise-qr.svg` als Vektordatei und `reise-qr.png` mit ausreichender Auflösung.
- `boarding-pass.pdf` als finale Druckdatei; zusätzlich editierbare HTML/CSS- oder SVG-Vorlage.
- `druckanleitung.md` mit URL, Erzeugungsdatum, Druckgröße und Prüfschritten.

**Gestaltungsvorgabe:** Gutscheinfläche 200 × 90 mm auf A4, mit klarer Schnittmarkierung außerhalb der Inhalte und mindestens 5 mm Sicherheitsabstand. Der QR-Code erhält ungefähr 35 × 35 mm inklusive Freiraum, mindestens vier freie Module ringsum, schwarze Module auf Weiß, keine Verzerrung, kein Logo und kein dekorativer Eingriff. Fehlerkorrekturstufe Q als Projektvorgabe. Bei hoher Dichte Größe erhöhen und real testen. Klartext-URL unmittelbar darunter lesbar setzen.

Passinhalt: „Boarding-Pass für unser nächstes Abenteuer“, Anlass „Zum 18. Geburtstag“, Reisende „Wir zwei“, Start „Dresden oder Berlin“, Ziel „Du entscheidest“, Reisezeit „Nach Absprache“, Handlungsaufforderung „Scannen, swipen, Lieblingsziel wählen“. Deutlich „Reise-Gutschein – kein Flugticket“. Keine echte Flugnummer, erfundene Buchungsnummer oder zugesagte Leistung suggerieren. Namen nur einsetzen, wenn tatsächlich geliefert; sonst neutrale Formulierungen.

### 12.3 Verbindliche Reihenfolge

1. Inhalt fertigstellen, Rechte prüfen, Build testen.
2. Finale Domain/Pfad konfigurieren und freigegebene Version veröffentlichen.
3. HTTPS und Einstieg ohne bestehende Sitzung auf einem fremden Smartphone prüfen.
4. QR lokal aus exakt dieser URL erzeugen; decodierten Inhalt automatisiert mit Konfiguration vergleichen.
5. QR in Druckvorlage einbetten; PDF exportieren. Eingebetteten QR aus der gerenderten PDF nochmals decodieren.
6. Bei 100 %/„Tatsächliche Größe“ probeweise auf mattem Papier drucken. Keine unbemerkte „An Seite anpassen“-Skalierung.
7. Ausdruck mit iPhone und Android-Kamera bei normalem Innenlicht aus etwa 20–40 cm mehrfach scannen; App ohne Anmeldung erreichen.
8. Klartext-URL manuell eintippen; vollständigen Ablauf bis zur Testbestätigung durchlaufen. Danach nur die Testauswahl im Testbrowser löschen.
9. Finale Version drucken und verschenken; Dateiversion, finale URL und Scan-Abnahme dokumentieren.

Vor einer finalen URL ist nur ein deutlich als ENTWURF markierter Gutschein zulässig. Der Produktionsdruck darf keine Platzhalter-Domain enthalten. Der physische Scan-Test lässt sich durch einen reinen QR-Decoder-Test nicht ersetzen.

## 13. Testplan und prüfbare Akzeptanzkriterien

### 13.1 Automatisierte Tests

**Unit-Tests:** Budgetberechnung mit Nullwerten, enthaltenen Kosten, Reserve und Cent-Grenzen; Statuspriorität; Szenariovergleichbarkeit; Schemafehler; Reducer, Fortschritt und Undo; Datenmigration; Ablauf der Aufbewahrung; Wunschvalidierung und Snapshot-Abgleich.

**Integration:** Swipe-Schwelle, Abbruch/Scrollen, Buttons und Tastatur führen zu identischen Zuständen; Details verändern keine Bewertung; Vergleichslimit; Speicherfehler; Bestätigungscheckbox; Änderung eines bestehenden Wunsches; Entfernung des bestätigten Favoriten.

**Ende-zu-Ende:** Neue Sitzung vom Einstieg bis TXT-Export; Wiederaufnahme nach Reload; alles verworfen; genau ein Favorit; drei verglichen; Wunsch geändert; unbekannte Route; Basis-Pfad und QR-Einstieg. axe-Prüfung der wesentlichen Screens, plus manuelle Prüfungen.

Testdaten mit festen Zeitpunkten und synthetischen Preisen in getrenntem Fixture-Verzeichnis führen. Keine Netzwerkanfragen zu Buchungsportalen in automatisierten Tests. Echte Verfügbarkeit ist kein testbarer Zustand dieser App.

### 13.2 Abnahmematrix

| ID | Gegeben / Aktion | Erwartetes Ergebnis |
|---|---|---|
| A-01 | Neuer Browser öffnet finalen QR-Link | Begrüßung ohne Anmeldung; zwei Personen, Geschenkcharakter und sechs Ziele erreichbar |
| A-02 | Karte 320 px breit, horizontal 79 px ziehen und loslassen | Keine Bewertung; Karte kehrt zurück |
| A-03 | Gleiche Karte 80 px rechts ziehen und loslassen | Genau ein Like, nächstes Ziel, Fortschritt +1, Favoriten +1 |
| A-04 | Karte vertikal scrollen oder Pointer abbrechen | Keine Bewertung; Seite bleibt scrollbar |
| A-05 | Links swipen und Rückgängig wählen | Vorheriger Status, Fortschritt und Karte wiederhergestellt |
| A-06 | Details und Galerie öffnen, dann zurück | Gleiche Karte, unveränderte Bewertung und korrekte Navigation |
| A-07 | Alle Ziele nach links bewerten | Ende mit 0 Favoriten; alle sechs Ziele erneut erreichbar |
| A-08 | Vier Favoriten zum Vergleich anklicken | Maximal drei ausgewählt; vierter Versuch erklärt Begrenzung |
| A-09 | Genau ein Favorit vorhanden | Direkt als Wunsch prüfbar; Vergleich nicht fälschlich verfügbar |
| A-10 | Alle Kosten unbekannt | „Noch offen“, keine 0-€-Gesamtreise und keine Budgetzusage; bedingte Wunschbestätigung möglich |
| A-11 | Synthetischer vollständiger Subtotal 180.000 Cent, Geschenknebenkosten 0 | Reserve 20.000, Gesamt 200.000: `within_estimate`, sofern aktuell und Grundlagen vollständig |
| A-12 | Gleiche Testbasis, Subtotal 180.001 Cent | Gesamt 200.001: `over_budget`, Bestätigung gesperrt |
| A-13 | Aktuelle vollständige Testspanne 160.000–190.000 Cent, Nebenkosten 0 | Reserve 20.000, Gesamt 180.000–210.000: `uncertain`; keine grüne Zusage |
| A-14 | Preisdatum 15 Tage alt bei 14 Tagen Grenze | `stale`; Prüfhinweis statt aktueller Budgetaussage |
| A-15 | `included` verweist auf Unterkunft | Keine Doppelzählung; ungültiger Verweis blockiert Inhaltsprüfung |
| A-16 | Bestätigung ohne gesetzte Checkbox | Kein bestätigter Wunsch; verständlicher Hinweis |
| A-17 | Bestätigung doppelt schnell auslösen | Genau ein Wunsch; keine Buchungs-/Versandmeldung |
| A-18 | Nach Like und Wunsch Browser neu laden | Auswahl bleibt im selben regulären Browser erhalten; Undo beginnt leer |
| A-19 | Storage-Zugriff wirft Fehler | Kernablauf weiter möglich; temporärer Zustand erklärt; Export verfügbar |
| A-20 | Beschädigte/zu neue Speicherversion | Kein Absturz und kein stilles Überschreiben; Reset bewusst möglich |
| A-21 | Aktuellen Wunsch wechseln, dann abbrechen | Alter Wunsch bleibt; erst Bestätigen ersetzt ihn |
| A-22 | Bestätigten Favoriten entfernen | Dialog; Abbrechen erhält ihn, Bestätigen löscht Wunsch und Bewertung gemäß Aktion |
| A-23 | Browser-Zurück, Direktlink, ungültige Ziel-ID | Keine verlorenen Bewertungen, sinnvoller Rückweg, kein leerer Screen |
| A-24 | „Alle meine Auswahldaten löschen“ bestätigen | Nur App-Auswahl gelöscht; neue Begrüßung und leere Favoriten |
| A-25 | Kernablauf nur per Tastatur/Screenreader/Buttons | Alle Funktionen ohne Swipe erreichbar; Status und Fokus verständlich |
| A-26 | 320 px Breite, 200 % Text, reduzierte Bewegung | Kein Inhaltsverlust, keine verdeckten Buttons; reduzierte Animation |
| A-27 | Jedes öffentliche Reisefoto prüfen | Passender Ort, gültiger Nachweis, Attribution, Alt-Text und keine offenen Platzhalter |
| A-28 | Wunsch exportieren/kopieren | Ziel und Rahmen vollständig, „Noch nicht gebucht“, keine behauptete automatische Zustellung |
| A-29 | Ausdruck auf beiden Mobilplattformen scannen | Exakt finale HTTPS-Seite; keine Vorschau-/Platzhalteradresse |
| A-30 | Neues Inhaltsrelease mit deaktiviertem gewähltem Ziel | Snapshot bleibt lesbar, Aktualisierungshinweis, keine falsche fortbestehende Budgetzusage |

Zusätzlich die Pflichtprüfungen aus Leistung, Datenschutz, Lizenzierung und Druck in einem Abnahmeprotokoll abhaken. Nicht ausgeführte Hardware-/Drucktests ausdrücklich als offen kennzeichnen; keine automatisierte Vollabnahme vortäuschen.

## 14. Umsetzungsschritte und Lieferumfang

### Phase 1 – Fundament und Inhalte

1. Projekt mit empfohlenem Stack aufsetzen, README und Lockfile anlegen.
2. Datenmodelle, Schema-Prüfungen, Budgetfunktion und synthetische Test-Fixtures erstellen.
3. Sechs Ziel-Datensätze anlegen; fehlende Fakten/Preise ausdrücklich offen lassen.
4. Echte Bilder und verifizierte redaktionelle Quellen beschaffen, Rechte dokumentieren, Varianten optimieren.

**Ergebnis:** Validierte Inhaltsbasis; unbekannte Reisekosten klar getrennt von Testdaten.

### Phase 2 – Hauptablauf

5. Begrüßung, Navigation, Kartenstapel und Details umsetzen.
6. Gesten, Buttons, Tastatur, Rückgängig und Fortschritt an dieselbe Fachlogik anbinden.
7. Alle-Ziele-Ansicht, Favoriten und Vergleich fertigstellen.
8. Wunschprüfung, Bestätigung, Änderung, Kopieren und TXT-Export implementieren.

**Ergebnis:** Vollständiger Ablauf mit sechs Zielen in einer lokalen Vorschau.

### Phase 3 – Zuverlässigkeit und Qualität

9. Persistenz, Migration, Speicherfehler, mehrere Tabs und Reset ergänzen.
10. Responsive Layout, Bildfehler, Fokusführung, Screenreader und reduzierte Bewegung prüfen.
11. Unit-/Integrations-/E2E-Tests ausführen; Performance- und Browserprüfungen protokollieren.
12. Datenschutz-/Bildnachweis-Seite und Betreiberhinweise anhand tatsächlicher Hostingkonfiguration vervollständigen.

**Ergebnis:** Technisch abnahmefähiger MVP; offene inhaltliche/physische Prüfungen separat gelistet.

### Phase 4 – Übergabe und Geschenk

13. Finale Inhalte und URL konfigurieren; Produktionsbuild erstellen.
14. Nach Freigabe veröffentlichen, Live-Einstieg prüfen, QR und Boarding-Pass erzeugen.
15. Probeausdruck und reale Scans durchführen; finalen Gutschein bereitstellen.
16. Quellcode, Build, Druckdateien und Pflegeanleitung übergeben; Speicher-/Hostinggrenzen erklären.

### Definition of Done

- Alle P0-Funktionen vorhanden und alle zutreffenden A-01 bis A-30 bestanden.
- Sauberer Checkout lässt sich gemäß README installieren, prüfen, testen und bauen.
- README dokumentiert `dev`, `build`, `preview`, `typecheck`, `lint`, `test`, `test:e2e`, `validate:content` und `generate:print` bzw. gleichwertige Skripte.
- Alle sechs Zielkarten enthalten vollständige redaktionelle Inhalte und freigegebene echte Bilder. Kosten dürfen offen bleiben; dadurch entstehende Grenzen sind korrekt dargestellt.
- Kein echter Preis-/Verfügbarkeitsanspruch ohne Beleg, keine Buchungs- oder Versandbehauptung.
- Keine Geheimnisse, erfundenen Personendaten, unmarkierten Platzhalter oder synthetischen Testpreise im Produktionsbuild.
- `docs/abnahme.md` nennt Testumgebung, Ergebnisse und verbleibende Einschränkungen.
- `docs/betrieb.md` erklärt Ziel-/Bild-/Preisänderungen, Deployment, QR-Stabilität, Datenlöschung, Rollback und spätere Abschaltung.
- Für technische Übergabe: Quellcode, Build, Konfiguration, Tests und Druckvorlage liegen vor. Für tatsächliche Geschenkbereitschaft zusätzlich: reale URL, freigegebene Veröffentlichung, finale PDF, QR-Dateien und bestandenes physisches Scan-Protokoll.

## 15. Offene Angaben und sichere Standardwerte

Die folgenden Angaben verhindern die Implementierung nicht. Bis sie bekannt sind, gelten die angegebenen Standardwerte; der Agent darf keine persönlichen Fakten erfinden.

| Offene Angabe | Standard / Umgang |
|---|---|
| Vorname und Signatur | Neutrale Ansprache „Alles Gute zum 18.!“ und „Wir zwei“ |
| Tatsächliches Geburtstagsdatum | Kein Datum anzeigen und keine automatische Freischaltung bauen |
| Reisezeitraum | Flexibel, kein Datum vorauswählen |
| Reisedauer | 7 Nächte als sichtbare, änderbare Planungsannahme |
| Start zu Hause | Dresden oder Berlin offen; je konkretem Szenario ausdrücklich festlegen |
| Unterkunft und Gepäck | Offen; keine irreführende Gesamtkostenschätzung |
| Basis Split/Makarska | „Noch offen“; getrennte Szenarien bei konkreter Planung |
| Geschenknebenkosten | Unbekannt, bis Betreiber Höhe bzw. getrennte Finanzierung bestätigt |
| Domain/Hosting | Lokale Vorschau; Produktionsdruck erst mit finaler URL |
| Zugangsschutz | Öffentlicher Link ohne sensible Inhalte; echter Schutz nur als gesonderte Erweiterung |
| Tatsächliche Preise | `null`/`unknown`; spätere manuelle Recherche mit Quelle und Stand |

**Arbeitsauftrag an den Coding-Agenten:** Setze zuerst den vollständigen P0-Ablauf um. Triff technische Detailentscheidungen innerhalb dieses Rahmens selbstständig und dokumentiere wesentliche Abweichungen. Nutze keine fehlenden Preise als Anlass, Angebote zu erfinden. Trenne technische Funktionsfähigkeit, redaktionelle Angebotsprüfung und physische Geschenkabnahme sauber im Übergabeprotokoll.
