# Design-Spezifikation – Mietverwaltung

Quelle: `config/config.toml` (Navigation/Routes), `wireframe.md`, README/AGENTS/BLUEPRINT_PROMPT_DE. PC-First mit CRUD, Mobile Read-Only. Keine visuellen Details/Branding, alles config-driven.

## Layout & Navigation
- Grundlayout: persistente Sidebar (collapsible, default expanded), Header mit StatusBar (Owner/Version) und evtl. Systemindikatoren; Content-Area mit Breadcrumb/Title, Aktionen, Hauptinhalt, Footer/Pagination.
- Navigation laut `config.config.toml[navigation.items]`: Dashboard, Objekte (+ Einheiten-Link), Mieter, Verträge, Finanzen (Zahlungen, Kautionen, Sollstellung), Nebenkosten (Rechnungen, Abrechnungen, Zähler), Dokumente, Einstellungen (Position bottom), optional Mobile-Link/Info.
- Routing: default `/dashboard`, Muster für Listen/Details laut `routes.patterns`; Tabs/Subroutes gem. children der Navigation.
- Mobile: bottom-nav aktiviert (`mobile_bottom_nav = true`), Mobile-Views Read-Only.

## Hauptscreens & Inhalte
- Dashboard: Widget-Grid mit Kennzahlen (Objekte, Mieter, Verträge, Offene Posten, Dokumente), zweite Reihe Einnahmen/Soll-Ist, Leerstand, Erinnerungen; Quick Actions (Zahlung, Rechnung, Ablesung). Empty-State zeigt 0/Karte mit Hinweis, keine Actions verstecken.
- Objekte: List-Detail; linke Liste filterbar/suchbar, rechte Detail-Ansicht mit Tabs Stammdaten, Einheiten, Zähler, Dokumente. Aktionen: Neu, Bearbeiten/Löschen über Row-Actions, Upload in Dokumente-Tab. Detail zeigt config-basierte Felder/Formen.
- Mieter: List-Detail analog Objekte; Tabs für Stammdaten, Verträge, Dokumente. Aktionen: Neu, Bearbeiten, Zuordnungen über Formconfig.
- Verträge: List-Detail; Tabs Stammdaten, Zahlungen, Sollstellungen, Anhänge. Aktionen: Neu, Bearbeiten, Beenden (falls definiert), Row-Actions config-driven.
- Finanzen (Tabbed): Tabs Zahlungen, Sollstellung, Kautionen. Tabelle mit Datum/Mieter/Betrag/Typ/Tag; Actions: Neu, Export, Filter (alle config-basiert).
- Nebenkosten (Tabbed): Tabs Rechnungen (Tabelle + Upload/Neu), Abrechnungen (Wizard: Zeitraum → Umlageschlüssel → Vorschau → Export PDF), Zähler (Tabelle + Ablesungs-Form). Wizard-Schritte sequenziell, Fortschritt sichtbar, Abschließen erzeugt Export.
- Dokumente: Single-View mit Toolbar (Upload, Filter nach Typ/Objekt), Tabelle (Dateiname, Typ, Zugehörigkeit, Hochgeladen am), rechts/Modal Preview + readonly Metadaten.
- Einstellungen: Sektionen für Stammdaten Owner, Defaults/Fristen, Backups/Pfade, Design/Labels (Verweise auf TOML). Formulare config-driven, speichern über generische Aktionen.
- Mobile Dashboard (/mobile/dashboard): Karten (Objekte, Mieter, Offene Posten, Erinnerungen), Listen (Letzte Zahlungen, fällige Ablesungen), keine Schreibaktionen; Links führen zu Detail-Read-Only, POST/PUT/DELETE blockiert serverseitig.

## Interaktionsmuster & States
- Tabellen: Sortierbar/seitbar, Row-Actions gemäß Table-Config; Empty-State mit Hinweis + CTA „Neu“ (falls erlaubt). Loading: Skeleton/Spinner auf Tabelle + Toolbar disabled. Error: Inline-Alert (aus API error.message).
- Formulare: Felder, Validierung, Defaults aus `config/forms/*.toml`; Inline-Fehler pro Feld, Submit-Button disabled bei Invalid/Loading. Erfolgreich → Schließen/Dialog reset + Reload der Tabelle. Required-Felder als Pflicht markieren.
- Wizard (Abrechnungen): Schrittweise Navigation, Next nur bei validen Feldern, Back möglich, finaler Schritt löst Export/Erstellung aus; Fehler pro Schritt anzeigen.
- Quick Actions (Dashboard): Öffnen jeweiliger Form (Zahlung, Rechnung, Ablesung). Disabled bei fehlenden Rechten/Config-Fehlern.
- Dateien/Uploads: Beschränkungen laut `app.storage` (max_upload_size_mb, allowed_file_types); Upload-Button disabled bei Überschreitung, Fehlerhinweis anzeigen.
- Mobile: Keine Schreib-Buttons; Karten/Liste tappable nur zum Lesen; Fehler/Loading als kurze Hinweise, keine modalen Eingriffe.

## Responsive-Notizen
- Sidebar collapsible: auf kleineren Viewports auto-collapsed; Navigation über Icon-Leiste/Drawer; Mobile nutzt Bottom-Nav (laut Config).
- Tabellen auf Mobile: horizontales Scrollen zulassen; wichtigste Spalten priorisieren (Name/Datum/Betrag/Status). Aktionen als Kontextmenü/Slide-Over, auf Mobile nur Lesemodi.
- Grids (Dashboard): Karten stapeln sich untereinander auf Mobile; Quick Actions als einzeilige Buttons.
- Dialoge/Wizard: Vollbreite auf Mobile, mehrspaltig auf Desktop.

## States (Default/Empty/Loading/Error/Disabled)
- Default: Daten geladen, Aktionen aktiv laut Config.
- Empty: Tabellen/Widgets zeigen „Keine Daten“ mit optionalem CTA (nur wenn Schreiben erlaubt).
- Loading: Spinner/Skeleton, Aktionen disabled.
- Error: Klarer Text aus API, Retry-Button wenn sinnvoll.
- Disabled: Buttons/Inputs deaktiviert, Tooltip/Hinweis, warum (z. B. fehlende Auswahl/Validierung).

## Konsistenz & Quellen
- Labels/Texte ausschließlich aus `config/labels/de.labels.toml`.
- Navigation/Tabs exakt wie `config/config.toml[navigation.items]` und Imports.
- Entitäten/Forms/Tables werden nicht dupliziert; UI rendert generisch basierend auf TOML.
- Wireframe (`/wireframe.md`) bleibt Referenz für Struktur; keine Abweichung erforderlich.
