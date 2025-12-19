# Changelog - Mietverwaltung

Alle wichtigen Änderungen werden hier dokumentiert.

Format: `[YYYY-MM-DD HH:MM] - Kategorie - Beschreibung`

---

## 2025-12-19

### [2025-12-19 22:12] - Fix/Frontend - Mieter Aktionen: nur Icons ohne Text
- **Problem:** Row-Actions zeigten immer Text (Label) auch wenn `label = ""` in Config definiert war
- **Root Cause:** `const label = actionConfig.label || actionId` - leerer String wurde ignoriert, Fallback zu actionId
- **Lösung:** `label !== undefined ? actionConfig.label : actionId` - respektiert explizit definierten leeren String
- **Resultat:** Mieter-Tabelle zeigt jetzt nur Icon-Buttons ohne Text
- **Status:** ✅ TypeScript, 1 neuer Commit

### [2025-12-19 21:50] - Fix/Frontend + Backend - IBAN-Validierung komplette Behebung
- **Problem 1 (Frontend):** `formData` wurde direkt mutiert statt kopiert, Validierungsschleife sah angepasste Werte nicht
  - **Lösung:** `processedFormData` Kopie erstellen, IBAN auf "" setzen wenn "DE" oder leer, gegen Kopie validieren
- **Problem 2 (Backend):** Leere Strings (value === '') wurden nicht skipped, Backend validierte IBAN-Pattern trotzdem
  - **Lösung:** Expliziter Check für leere Werte (undefined, null, '') mit `continue` - Pattern-Validierung nur für non-empty Werte
- **Resultat:** Mieter kann jetzt vollständig ohne IBAN erstellt werden (Frontend + Backend stimmen überein)
- **Status:** ✅ TypeScript, ✅ Frontend + Backend, 2 neue Commits

### [2025-12-18 XX:XX] - Refactor/Config - Width-Referenzsystem, Label-Cleanup & Version-Update
- **Width-Referenzsystem:** 79 hardcodierte px-Breiten durch Referenzen ersetzt (w40-w300 in 20px-Schritten + actions=120px).
  - Mapping intelligente durchgeführt: w50→w60, w150→w160, w250→w260, w400→w300
  - `useWidthsConfig()` Hook + `/api/config/widths` Endpunkt hinzugefügt
  - DataTable nutzt `resolveWidth()` für zentrale Breiten-Verwaltung
- **Standalone Labels/Actions entfernt:** `getLabels()`, `/api/config/labels` Endpunkt, `useLabelsConfig` Hook gelöscht.
  - Labels/Actions existieren nur noch als Teil von Table-Definitionen (`[tables.xxx.table.actions]`)
  - Vereinfacht Architektur und erzwingt Kontext-Konsistenz
- **Version korrigiert:** 1.0.0 → 0.2.0 (reflektiert Phase 2, nicht Produktionsreife)
- **Duplicate config-Entry:** `version` aus `[app]` entfernt (gehört nur in `[meta]`)
- **Konsistente Block-Header:** Entities, Forms, Tables, Views haben jetzt explizite Block-Header für bessere Lesbarkeit
- **Status:** ✅ TypeScript, ✅ Build, ✅ 3 neue Commits

## 2025-12-18

### [2025-12-18 XX:XX] - Fix/Config + Frontend - MieterPage Rendering & TOML Table Columns
- **KRITISCHER CONFIG-FIX:** 70 falsch verschachtelte TOML Array-Tabellen korrigiert.
  - War: `[[table.columns]]` (top-level, unbezogene Struktur)
  - Ist: `[[tables.{name}.table.columns]]` (korrekt verschachtelt)
  - Betroffen: Alle 11 Table-Konfigurationen (mieter, einheiten, objekte, etc.)
- **MieterPage Loading-Condition:** Nicht mehr auf entityConfig/formConfig warten → Seite rendert auch wenn Formulare fehlschlagen.
- **Resultat:** DataTable zeigt jetzt "Keine Einträge" statt blauem Bildschirm, wenn DB leer ist.

### [2025-12-18 XX:XX] - Fix/Frontend - TypeScript & ESLint Fehler behoben
- **React Hook Error:** useEntityList in DetailTableTab vor conditional check verschoben (Zeile 251).
- **Type Errors:** mieter/contractIds/primaryUnitId korrekt als Record<string, unknown> getypet.
- **useMemo:** tabs Dependency für useEffect in MieterDetailPage optimiert.
- **ConfigLoader:** Console.log-Statements unter DEBUG_CONFIG Flag mit eslint-disable-next-line.
- **Sidebar:** Sichere Navigation für item.children mit Type Guard und Conditional Render.
- **Status:** npm run typecheck ✅ (0 Fehler), npm run lint ⚠️ (3 Minor Warnings in NebenkostenPage).

### [2025-12-18 XX:XX] - Test/Backend - ConfigLoaderService Tests erweitert für konsolidierte Struktur
- Tests aktualisiert: 5 neue Test-Cases prüfen die Laden von [entities.*], [forms.*], [tables.*], [views.*] aus konsolidierter `config.toml`.
- Integrations-Test durchgeführt: ConfigLoader lädt perfekt (14 Entities, 12 Forms, 11 Tables, 8 Views in 26ms).
- API-Endpunkte validiert: `/api/config/entity/*`, `/api/config/form/*`, `/api/config/table/*`, `/api/entities` antworten korrekt.
- Blockers: Keine. ConfigLoader-Service funktioniert bereits mit neuer Struktur.

### [2025-12-18 XX:XX] - Docs/Tooling - Read/Commit-Gates erweitert
- Read-Gate und Session-Start verweisen jetzt auf Pflichtdokumente (.claude/.codex/.ai, Root-Docs, `config/config.toml`, wireframe, todo.md) sowie die detaillierten Agentenprompts unter `.github/agents/*.agent.md`.
- Commit-Gate blockt, wenn kein neuer JSON-Statusblock in `PM_STATUS.md` vorhanden ist; Pflichtlektüre und READY_FOR_CHANGES werden explizit vor Tool-Nutzung eingefordert.
- AGENTS/CLAUDE/CODEX dokumentieren den zentralen PM_STATUS-Log, config-first-Fluss und die Nutzung der .github/agents-Prompts; neues `todo.md` stellt die Aufgabenliste als Pflichtdoku bereit.

### [2025-12-18 XX:XX] - Docs - Agenten-Beschreibungen ungekürzt zusammengeführt
- Agentenabschnitte wurden ungekürzt aus den Einzeldateien übernommen; `AGENTS.md` startet mit vollständigen Rollenbeschreibungen und enthält im Anschluss die bestehenden Repository-Guidelines.
- Bauplan-Hinweis präzisiert die zentrale, vollständige `AGENTS.md`-Quelle.

### [2025-12-18 XX:XX] - Docs - Agenten-Katalog konsolidiert
- `AGENTS.md` enthält jetzt den vollständigen, zentralen Agenten-Katalog (alle Rollen inkl. Projektmanager/Workflow/Release/Tester), vereinheitlichte Guardrails und Rückmeldelogik über `PM_STATUS.md`.
- Bauplan ergänzt einen Hinweis auf die zentrale `AGENTS.md`, damit alle Agenten dieselbe Quelle nutzen.
## 2025-12-17

### [2025-12-17 XX:XX] - Feature - IBAN-Autofill Bankname
- Neuer Katalog `config/catalogs/bankleitzahlen.catalog.toml` (inkl. Import in `config/config.toml`) hält die BLZ→Bankname/BIC-Zuordnung für das Mieter-Banking; Erweiterungen passieren config-driven ohne Codeänderung.
- `DynamicForm` formatiert IBAN-Eingaben automatisch mit DE-Prefix und 4er-Gruppierung (`DEkk xxxx xxxx ...`), validiert ohne Leerzeichen und füllt `bankname`/`bic`, sobald eine bekannte BLZ erkannt wird; manuelle Eingaben bleiben unangetastet.
- Dokumentation: AGENTS und BAUPLAN führen den neuen Workflow als laufende Änderung; PM-Status wurde aktualisiert.

### [2025-12-17 XX:XX] - UX/Config - Placeholder & IBAN-Default
- Placeholder wurden in den Entity-Configs für `mieter` und `einheit` wieder ergänzt, damit DynamicForm keine Fallbacks benötigt (realistische Beispiele für Banking-, Kontakt- und Flächenfelder).
- Mieter-IBAN erhält jetzt einen Default `DE`, damit der Prefix sofort sichtbar ist; Formatierung/Validierung bleibt gruppiert und whitespace-frei für die Prüfung.

### [2025-12-17 XX:XX] - Data - CSV-Kataloge (Banken & PLZ)
- CSV-Quellen `german_banks_blz_bic.csv` (Bankleitzahlen mit Bankname/BIC/Ort) und `german_postcodes_cities.csv` (PLZ→Ort) wurden nach `config/catalogs/` konvertiert und in `config/config.toml` importiert.
- Bankkatalog enthält ~14k Einträge für IBAN-Autofill; PLZ-Katalog ~8k Einträge für Adress-Autocomplete. Alle zukünftigen Autofill-/Autocomplete-Funktionen sollen diese Kataloge nutzen.

### [2025-12-17 XX:XX] - Rule - Zustelladresse aus Einheit
- Mieter halten nur noch `adresse_vorher`; die Zustelladresse wird aus der zugeordneten Einheit/Objektadresse abgeleitet (keine doppelte Pflege). Die Mieter-Form enthält entsprechend nur `adresse_vorher`.
- Gültig ab Einzug/Vertragsbeginn (bei Wohnraum ggf. +1 Monat), gesteuert über Vertrag/Einheit, nicht über eigene Mieterfelder.

### [2025-12-17 XX:XX] - Fix - E-Mail-Feld im Mieter-Dialog
- `DynamicForm` rendert jetzt auch `field.type = "email"` als Eingabe (vorher fehlte die Eingabemöglichkeit im Mieter-Dialog). Keine weiteren Logikänderungen.

### [2025-12-17 XX:XX] - UX - Enter = Tab in Dialogen
- Alle Eingabefelder in `DynamicForm` behandeln die Enter-Taste wie Tab (fokusiert das nächste Feld und verhindert Submit), damit Dialoge konsistent per Tastatur bedienbar sind.

### [2025-12-17 XX:XX] - UX - Zentrales Alignment Mieter-Tabelle
- DataTable zentriert Header- und Zellinhalte standardmäßig, sodass Spalteninhalt und Header auf der Mieter-Seite konsistent ausgerichtet sind.

### [2025-12-17 XX:XX] - UX - Feste Spaltenbreite (Header/Cells)
- Tabellenzellen übernehmen nun die in der Config definierte Spaltenbreite genauso wie die Header (`th`/`td`), sodass Inhalte und Überschriften deckungsgleich sind.

### [2025-12-17 XX:XX] - Fix - Mieter-Tabelle Name/Labels
- Mieter-Tabelle nutzt jetzt ein Template `{vorname} {nachname}` für die Namensspalte, damit Inhalte zum Header passen; Header-Labels werden via Formatierung aus `labels.*` menschenlesbar gemacht.

### [2025-12-17 XX:XX] - UX - Header zentriert
- Tabellen-Header-Content wird jetzt mit `justify-center` ausgerichtet, damit Label und Sort-Icon exakt mittig stehen.

### [2025-12-17 XX:XX] - UX - Mieter-Aktionsspalte
- Mieter-Tabelle besitzt eine dedizierte Aktionsspalte mit Icons (Edit, Vertrag-Link, Einheit-Link); Buttons sind icon-only und nutzen per Row-Action Navigation zu `/vertraege?mieter_id=:id` bzw. `/einheiten?mieter_id=:id`.

### [2025-12-17 XX:XX] - UX - Aktions-Header
- Aktionsspalte trägt nun die Überschrift „Aktionen“ (konfigurierbar via Table-Config), Header zentral ausgerichtet.

### [2025-12-17 XX:XX] - UX - Spaltenbreite konsistent (Aktionen)
- Aktionsspalte nutzt konfigurierbare Breite (`table.actions.width`) und zentrierte Layout-Wrapper, sodass Header und Content gleich breit und mittig sind.

### [2025-12-17 XX:XX] - UX - Guarded Navigation für Vertrags-/Einheitsaktionen
- Row-Actions „Vertrag“/„Einheit“ prüfen verknüpfte IDs; ohne Link wird ein Blocker (Alert) gezeigt, um Fehlnavigation zu vermeiden. Bei vorhandenen IDs erfolgt direkte Navigation zu `/vertraege/:id` bzw. `/einheiten/:id`.

### [2025-12-17 XX:XX] - UX - Telefon-Fallback mobil → festnetz
- Mieter-Tabelle zeigt in der Telefonspalte bevorzugt die Mobilnummer; falls leer, wird die Festnetznummer angezeigt (generischer Fallback über `fallback_fields` in DataTable).

### [2025-12-17 XX:XX] - UX - Detail: Backdrop nur außerhalb
- Mieter-Detailseite schließt (Zurück-Navigation) nur bei Klick auf den umgebenden Bereich; Klicks innerhalb des Inhaltsrahmens lassen die Ansicht offen.

### [2025-12-17 XX:XX] - Feature - Mieter-Detailkarten (Mieter/Vertrag/Objekt)
- Detailseite zeigt drei Info-Karten: Mieter-Stammdaten, primärer Vertrag (Beginn, Ende, Mieten/Vorauszahlungen) und Objekt/Einheit (Bezeichnung, Typ, Status, Adresse). Daten werden aus verknüpftem Vertrag/Einheit/Objekt geladen.

### [2025-12-17 XX:XX] - UX - Detailkarten Vollbreite & kompakt
- Die drei Info-Karten (Mieter/Vertrag/Objekt) nutzen jetzt Vollbreite mit kompakter Typo; Mieter-Karte enthält den Bearbeiten-Button in gleicher Optik.

### [2025-12-17 XX:XX] - UX - Detail-Karten als grid mit Click-Guard
- Drei Infoboxen sind nun in einem 3-Zeilen-Grid angeordnet (gleichmäßige Höhe optisch); Klicks in die Karten stoppen die Backdrop-Navigation, nur Klicks im Zwischenraum wählen den Eintrag ab.

### [2025-12-17 XX:XX] - Fix - Genau drei Detailkarten
- Überschüssige vierte Karte entfernt; Grid enthält wieder exakt drei Infoboxen (Mieter, Vertrag, Objekt/Einheit) mit Bearbeiten-Action auf der Mieter-Karte.

### [2025-12-17 XX:XX] - UX - Infobox-Typo vergrößert
- Detailkarten: Header um zwei Typo-Stufen größer, Inhalte um eine Stufe größer, Spacing erhöht (Padding, Grid-Abstand) für bessere Lesbarkeit.

### [2025-12-17 XX:XX] - UX - Detailkarten gleich breit, Randabstand
- Drei Detailkarten erhalten einheitliche Breite, werden horizontal zentriert und mit 50px Innenabstand links/rechts dargestellt.

### [2025-12-17 XX:XX] - UX - Detailkarten im 2-Spalten-Grid
### [2025-12-17 XX:XX] - UX - Detailkarten im 1-Spalten-Stack
- Detailkarten stapeln jetzt in einer Spalte, jede Karte behält ihr internes 2-Spalten-Layout; Außen-Padding bleibt entfernt.

### [2025-12-17 XX:XX] - UX - Label/Value gestapelt
- In den Detailkarten stehen Label und Wert nun untereinander je Feld, um Lesbarkeit und Ausrichtung zu verbessern.

### [2025-12-17 XX:XX] - UX - Detailkarten zentriert
- Karten-Stack liegt jetzt mittig mit `max-w-5xl` und `mx-auto`, sodass links/rechts gleiche Abstände bestehen.

### [2025-12-17 XX:XX] - UX - Detailkarten mit zweispaltigen Bereichen
- Jede Infobox nutzt jetzt ein zweispaltiges Grid (auto fill) und stellt Label + Wert pro Feld vertikal gestapelt dar – identisch zur Screenshot-Referenz.

### [2025-12-17 XX:XX] - UX - InfoCards entfernt
- Die zusätzliche InfoCard-Sektion wurde entfernt; die Detailansicht zeigt nur noch die formbasierten Stammdaten (weißes Layout wie im Screenshot).

### [2025-12-17 XX:XX] - UX - Detailformular Dark Theme
- Die Stammdaten-Form (Weiß-Layout) nutzt nun dieselben Farben wie die Sidebar (dunkler Hintergrund, helle Schrift), inklusive angepasster Labels und Rahmen.

### [2025-12-17 XX:XX] - UX - IBAN-Formatierung in Detailansicht
- IBANs werden in der Detailansicht automatisch in 4er-Blöcke gruppiert (analog zur Eingabeansicht).

### [2025-12-17 XX:XX] - Navigation - Objekte/Einheiten
- Navigationseintrag heißt jetzt „Objekte/Einheiten“; der Einheiten-Child-Eintrag wurde entfernt, Sidebar-Label aktualisiert.

### [2025-12-17 XX:XX] - UX - Nav-Label als Klartext
- Navigation verwendet nun direkt den Klartext „Objekte/Einheiten“ (kein `labels.*` Key mehr), damit exakt der gewünschte Text erscheint.

### [2025-12-17 XX:XX] - UX - Icon-Only Aktionen
- Action-Buttons zeigen keine Texte mehr (Label-Rendering nur, wenn explizit gesetzt); Hover-Title bleibt optional.

### [2025-12-17 XX:XX] - Docs - Backend-Konfiguration
- `AGENTS.md` dokumentiert jetzt den vollständigen Backend-Ladepfad (Root-Stub, ConfigLoaderService, Config-/Schema-/DB-Services) samt Prozess für künftige Änderungen.
- `README.md` erklärt den Root-Stub `config.toml`, verweist auf den tatsächlichen Loader und hebt die config-driven Server/DB-Parameter hervor.
- `planning/BAUPLAN_MIETVERWALTUNG.md` markiert den Blueprint-Status als Backend-konfiguriert, verankert `ConfigLoaderService` im Technologie-Stack und erläutert unter Abschnitt 4, dass sämtliche Dienste ausschließlich die Master-Konfiguration konsumieren.

### [2025-12-17 XX:XX] - Feature - Stammdaten-Views
- Neue Formular-Configs für `einheit` und `mieter` ergänzen die Imports (`config/forms/einheit.form.toml`, `config/forms/mieter.form.toml`, `config/config.toml`).
- Navigation und Sidebar zeigen `/einheiten` und `/mieter` als erste Tabellen, ergänzt durch das neue `DoorOpen`-Icon (vgl. `config/navigation.config.toml`, `src/client/components/layout/Sidebar.tsx`).
- Frontend liefert jetzt config-gesteuerte Seiten `src/client/pages/EinheitenPage.tsx` und `src/client/pages/MieterPage.tsx`, inklusive DataTable/DynamicForm-Workflows, Mutation-Handling und Header-Aktionen.
- `App.tsx` und `planning/BAUPLAN_MIETVERWALTUNG.md` wurden aktualisiert, damit die neuen Routen in der Struktur reflektiert werden.

### [2025-12-17 XX:XX] - Docs - Mieter-Blueprint
- `planning/BAUPLAN_MIETVERWALTUNG.md` bekommt eine Detailplanung für die `/mieter`-View (Liste + Detail), inklusive Hook-/Config-Verweise (`config/views/mieter.config.toml`, `config/forms/mieter.form.toml`, `config/tables/mieter.table.toml`), Filter-Roadmap, Row-Action-Handhabung und offenen Arbeitspaketen.

### [2025-12-17 XX:XX] - Feature - Mieter-Detailseite
- Neue Seite `src/client/pages/MieterDetailPage.tsx` implementiert Tabs, readonly-Form und Tabellen aus `config/views/mieter.config.toml`, inklusive Filterauflösung (`vertrag.mieter_id`) und Inline-Update über `forms/mieter.form.toml`.
- Backend liefert jetzt `/config/view/:name`, erlaubt Filterlisten (`filter[field]=id1,id2`) und `useViewConfig` greift auf die View-Definition zu, sodass Tabellen/Tabs ohne Hardcodes gesteuert werden.
- Dokumentation: `agents`, `planning` und PM-Status reflektieren den Blueprint-orientierten Workflow (Mieter → Vertrag → Einheit).

### [2025-12-17 XX:XX] - UX - Modaldialoge (dark → light)
- `DynamicForm` nahm kurz eine dunkle Oberfläche (`bg-slate-900`) an; der Flow wurde angepasst, um den späteren Kontrastwunsch zu evaluieren.

### [2025-12-17 XX:XX] - UX - Dialog-Kontrast
- Dialoge (`DynamicForm`, Mieter-Detailfelder) verwenden jetzt wieder helle Panels (`bg-white`, `text-slate-900`) und dunkle Texte für Entries, um den Lesefluss laut Design-Spezifikation zu sichern.

### [2025-12-17 XX:XX] - UX - Dropdown-Höhe
- Dropdown-Elemente (`select`) in `DynamicForm` erhalten nun dieselbe Höhe wie Textfelder (`h-10`) und greifen auf denselben Base-Style zurück, damit alle Controls optisch eine Linie bilden.

### [2025-12-17 XX:XX] - UX - Placeholder-Regel
- `DynamicForm` vertraut ausschließlich auf die in den TOML-Configs gepflegten Placeholder (keine auto-generierten `z.B.`-Fallbacks mehr); Beispieltexte werden zentral in `config/forms/*.toml` gepflegt.

### [2025-12-17 XX:XX] - Config - Mieter/Einheiten Placeholder
- Die Placeholder liegen jetzt in den Entity-Definitionen (`config/entities/mieter.config.toml`, `config/entities/einheit.config.toml`), sodass `DynamicForm` sie direkt aus der Config erhält; die Form-Dateien bleiben frei von Präsentationsdetails.
- Dialog-Footer nutzt nun auch das dunkle Theme (kein weißer Hintergrund mehr).

### [2025-12-17 XX:XX] - UX - Placeholder entfernt
- Sämtliche Placeholder-Angaben in den Entity-Definitionen wurden wieder entfernt; Dialogfelder erscheinen leer (keine Beispielfüllungen), wie gefordert.

### [2025-12-17 XX:XX] - Docs - Design-Spezifikation
- `design/design_spec.md` hinzugefügt: UI/UX-Spezifikation auf Basis von `config/config.toml` und `wireframe.md` (PC-First, Mobile Read-Only, Interaktionen/States, Responsive-Notizen).

### [2025-12-17 XX:XX] - Docs - Übergabe-Guides
- Handoff-Guides für Designer/Frontend/Backend/Tester in AGENTS.md ergänzt, mit Verweisen auf `config/config.toml`, Bauplan und Wireframe (config-driven, PC-First, Mobile Read-Only).

### [2025-12-17 XX:XX] - Config - Master-Loader & ENV-Validation
- Server und API ziehen Konfigurationswerte jetzt zentral aus `config/config.toml` via `ConfigLoaderService`, inklusive ENV-Overrides und Zod-Validierung (`src/server/index.ts`, `src/server/services/config-loader.service.ts`, `src/server/services/config.service.ts`, `config/config.toml`).
- Typen spiegeln die Zod-Schemas statt Legacy-Interfaces; Schema-Initialisierung nutzt die geladene Entity-Liste und Vitest kennt die Projekt-Aliasse (`src/shared/types/config.ts`, `src/server/services/schema.service.ts`, `vitest.config.ts`).
- SQLite-Setup ist config-driven (Pfad, WAL, busy_timeout, cache_size) und der Server startet konsistent auf Port 3002 aus der Master-Config (`src/server/services/database.service.ts`, `src/server/index.ts`).
- Neuer Vitest-Check stellt sicher, dass Master-Config/Imports geladen und ENV-Werte angewandt werden; Zod-Schema für Design-Shadows korrigiert (`tests/unit/config-loader.service.test.ts`, `src/shared/config/schemas.ts`).

### [2025-12-17 XX:XX] - Docs - Blueprint-Basis
- README.md, BLUEPRINT_PROMPT_DE.md und wireframe.md ergänzt, um die Pflichtdokumente für Blueprint, Handoffs und UI-Struktur bereitzustellen (PC-First, Mobile Read-Only, config-driven mit `config/config.toml` als Single Source of Truth). Verweise auf AGENTS/BAUPLAN/CHANGELOG aufgenommen.

## 2025-12-16

### [2025-12-16 XX:XX] - Bugfix - Typisierung & Query Handling
- `BaseEntity` erbt nun von `Record<string, unknown>`, Nebenkostenabrechnungen wurden typisiert, `Dokument` kennt `hochgeladen_am`/`dateiname`, und die `useEntityList`-Resultate in `FinanzenPage`, `NebenkostenPage`, `ZaehlerPage` und `DashboardPage` nutzen die tatsächliche `ApiResponse`-Payload (`src/shared/types/entities.ts`, `src/client/pages/{Finanzen,Nebenkosten,Zaehler,Dashboard}.tsx`).
- Holen von Table-/Form-Configs und Tabelleninhalte rechnet jetzt sauber mit `.data`, sodass `DataTable`/`DynamicForm` stets `Record<string, unknown>`-kompatible Daten sehen.

### [2025-12-16 XX:XX] - Config - Dokumenten-Formular
- `forms/dokument.form.toml` liefert einen Upload/Edit-Dialog für `dokument` inklusive Zuordnungen, Dateinamen, Format, Größe und readonly-Metadaten, so dass `/api/config/form/dokument` wieder vorhanden ist und die Tabellen/Views keine 500er mehr erzeugen (`config/forms/dokument.form.toml`).

### [2025-12-16 XX:XX] - UI - Statusbar
- Branding und Versionsnummer der Statusleiste stammen nun aus `config/app.config.toml` (`app.owner.name`, `app.version`), damit der mittige Hinweis komplett config-driven bleibt (`src/client/components/layout/StatusBar.tsx`).

### [2025-12-16 XX:XX] - Bugfix - API-Routing
- Konfigurations-, Dashboard- und Export-Endpunkte (`/api/config/*`, `/api/dashboard/summary`, `/api/export/steuerberater`) sowie die `/api/entities`-Liste werden jetzt vor den generischen Entity-Routen registriert, damit sie nicht mehr von `entityRoutes` mit `/:entity/:id` abgefangen werden.

### [2025-12-16 XX:XX] - Feature - Phase 6: Mobile & Polish
- `/mobile/dashboard` liefert eine Read-Only-Übersicht (Summary, Erinnerungen, offene Rechnungen) über `mobileRoutes`, den neuen `mobile.service` und das `MobileSnapshot`-Payload.
- `mobileReadOnlyMiddleware` blockiert alle Schreibzugriffe auf `/mobile`, während `MobileDashboardPage` mit `useMobileSnapshot` eine Touch-optimierte Seite liefert.
- Tests (`tests/unit/mobile.service.test.ts`) sowie AGENTS, BAUPLAN und `.claude/validation.md` dokumentieren den Status von Phase 6 und brandneue Mobile-Entscheidungen.

### [2025-12-16 XX:XX] - Feature - Phase 5: Dashboard, Dokumente & PDF
- Dashboard liefert jetzt echte Zähler (Objekte, Einheiten, Verträge, offene Rechnungen, Dokumente, Erinnerungen) aus `/dashboard/summary`.
- Dokumente-Ansicht ermöglicht Upload/Preview, nutzt die neue `documents.table`/`document.form` und greift auf `Steuerberater-Export` zurück.
- PDF-Service (`/api/export/steuerberater`) erstellt einen PDF-Report basierend auf der Dashboard-Zusammenfassung.

### [2025-12-16 XX:XX] - Feature - Phase 4: Nebenkosten & Ablesungen
- `ZaehlerPage` liefert jetzt Ablesungen mit Verbrauchsvergleich plus `zaehlerstand`-Formular für neue Messwerte.
- `NebenkostenPage` (Route `/nebenkosten`) bietet Rechnungs-Tab mit Konfigurations-Formen und Abrechnungs-Tab inklusive Share-Rechner basierend auf Umlageschlüsseln.
- Neue Forms/Tables für `rechnung`, `nebenkostenabrechnung`, `zaehlerstand` sowie API-Katalog für Umlageschlüssel und `config/forms/zaehler` ergänzen den Config-Stack.

### [2025-12-16 XX:XX] - Feature - Phase 4: Nebenkosten (Zähler)
- `ZaehlerPage` (Route `/nebenkosten/zaehler`) zeigt config-gesteuerte Tabelle mit Action-Buttons.
- Zähler-Formular (`config/forms/zaehler.form.toml`) ermöglicht Zuordnung, Typ, Messeinheit + Notizen.

### [2025-12-16 XX:XX] - Feature - Phase 3: Verträge + Finanzen
- Verträge- und Finanzen-Bereiche mit config-gesteuerter Liste/Form (Routes `/vertraege`, `/finanzen`) ergänzt.
- Neue Form-Configs (`kaution.form`, `zahlung.form`, `sollstellung.form`) sowie Tabellen-Configs für Kautionen erlauben standardisierte Dialoge und Übersichten.
- Dokumentation erweitert (`AGENTS.md`) und `vitest.config.ts` + Tests sichern die Config‑Ladepflicht.
- Shared Logger (`src/server/utils/logger.ts`) verhindert `no-console`-Warnungen bei Start/Schema-Init.

### [2025-12-16 XX:XX] - Feature - Phase 2: Frontend-Grundgerüst + generische Komponenten
- API-Service: Fetch-Wrapper für Backend-Kommunikation
- TanStack Query Hooks: useConfig, useEntity, useTableConfig, useFormConfig
- DataTable: Generische Tabelle mit Sortierung, Pagination, Row-Actions
- DynamicForm: Config-gesteuertes Formular mit Validierung
- ObjektePage: 100% Config-Driven (lädt Table/Form/Entity-Config aus API)
- Sidebar: Navigation dynamisch aus TOML-Config geladen
- Expandierbare Sub-Navigation für Finanzen/Nebenkosten
- API-Endpunkte: /api/config/table/:name, /api/config/form/:name

### [2025-12-16 XX:XX] - Feature - Phase 1: Entity-System + CRUD
- Schema-Generator: TOML → SQL CREATE TABLE (14 Tabellen)
- Generischer Entity-Service mit CRUD-Operationen
- REST API: /api/:entity Routen (GET, POST, PUT, DELETE)
- Validierung gegen Entity-Config (required, type, min/max, enum)
- DB-Schema automatische Initialisierung beim Server-Start

### [2025-12-16 XX:XX] - Setup - AI-Dokumentationsstruktur finalisiert
- CLAUDE.md (Root) + .claude/CLAUDE.md (User) erstellt
- CODEX.md (Root) + .codex/CODEX.md (User) erstellt
- Änderungs-Workflow dokumentiert (Ändern → Testen → Dokumentieren → Commit)
- User-spezifische Dateien zu .gitignore hinzugefügt

### [2025-12-16 XX:XX] - Setup - Phase 0 abgeschlossen
- Projektstruktur angelegt
- Build-Config (TypeScript, Vite, ESLint, Prettier, Tailwind)
- TOML-Konfigurationen (37 Dateien)
- Express-Server mit Config-API
- React-Grundgerüst (AppShell, Sidebar, StatusBar, Dashboard)
- AI-Dokumentationsstruktur (.ai/, .codex/, .claude/)

### [2025-12-16 XX:XX] - Planung - BAUPLAN erweitert
- Abschnitt 3 "AI-Dokumentationsstruktur" hinzugefügt
- Trennung: .ai/ (Shared Truth) → .codex/ (Implementierung) / .claude/ (Analyse)

---

## Nächste Schritte

- [x] Phase 1: Entity-System + CRUD
- [x] Phase 2: Frontend-Grundgerüst + generische Komponenten
- [ ] Phase 3: Erweiterte Views (Mieter, Verträge, Finanzen)
- [ ] Phase 4: Nebenkosten-Abrechnung
- [ ] Phase 5: Dokumente + PDF-Generation
