# Repository Guidelines

## Wichtige Referenzen
- **CODEX.md / .codex/**: Projektprinzipien, Ports und Config-first-Richtlinien.
- **planning/BAUPLAN_MIETVERWALTUNG.md**: Status, Phase und Aufgabenreihenfolge; aktualisiere ihn immer, wenn Features hinzukommen.
- **CHANGELOG.md**: Neuen Code dort dokumentieren vor Commit; beziehe AGENTS und BAUPLAN auf jede Ergänzung.

## Projektstruktur & Modulorganisation
- `src/client`, `src/server`, `src/shared` trennen UI, API und gemeinsame Typen/Utilities.
- `config/forms`, `config/tables`, `config/entities/*.config.toml` definieren UI/DB-Verhalten; `schema.service.ts` liest sie bei Start.
- `data/` enthält DB-Dateien und Backups, `public/` Assets, `dist/` Build-Output, `scripts/` bietet DB-Hilfen.
- Neue Features landen in passenden Services/Routes/Hooks und greifen ausschließlich auf Konfigurationen zu.
- `/mobile` ist read-only (`mobileRoutes`, `mobileReadOnlyMiddleware`) und liefert eine vereinfachte Übersicht (`MobileDashboardPage`); dokumentiere Mobile-Entscheidungen in AGENTS/BAUPLAN/CHANGELOG.

## Backend-Dienste & Config-Ladepfad
- Root-Stub `config.toml` im Projekt-Root dient nur als Verweis; produktiv werden ausschließlich die Dateien unter `config/` geladen (`config/config.toml` als Master + Imports).
- `src/server/services/config-loader.service.ts` ist die Single Source für das Backend: lädt Master-TOML, zieht Imports (Entities, Forms, Tables, Views, Labels, Catalogs, Design, Validation, Feature-Flags), validiert via Zod, appliziert ENV-Overrides (`ENV_MAPPINGS`) und cached im Speicher.
- `config.service.ts` kapselt alle Lesefunktionen (`getAppConfig`, `getEntityConfig`, `getFormConfig`, etc.) und dient sämtlichen Routen als API, damit kein anderer Teil direkt auf den Loader zugreift.
- `schema.service.ts` nutzt die geladenen Entity-Configs zum Generieren der SQLite-Tabellen, Indizes und Entity-Liste (`/api/entities`) und cached Tabellen-Namen für spätere Queries.
- `database.service.ts` initialisiert `better-sqlite3` strikt gemäß Master-Config (`database.path`, WAL, busy_timeout, cache_size). Alle CRUD-Operationen laufen über diesen Service; keine Direktverbindungen.
- Bei Änderungen an TOML-Imports oder ENV-Mappings: zuerst `config/config.toml` + relevante Imports anpassen, dann `AGENTS.md`, `planning/BAUPLAN_MIETVERWALTUNG.md` und `CHANGELOG.md` aktualisieren, bevor Backend-Code geändert wird.

## Build-, Test- und Entwicklungsbefehle
- `npm run dev` startet Client (Vite) plus Server (ts-node) für lokale Arbeit.
- `npm run build` führt `vite build` und `tsc -p tsconfig.server.json` aus.
- `npm run lint` (ESLint), `npm run lint:fix`, `npm run format`, `npm run typecheck` sichern Style/Typen.
- `npm test` (Vitest) kontrolliert Logik; `npm run test -- --watch` für schnelle Iterationen.
- Datenbankskripte nur über `npm run db:init`, `db:migrate`, `db:seed`, `db:backup`.

## Coding-Stil & Namenskonventionen
- Zwei Leerzeichen, keine Semikolons, Single Quotes, `arrowParens: "avoid"` (siehe `.prettierrc`).
- Komponenten/Services in PascalCase, Funktionen/Variablen in camelCase; Dateinamen beschreiben Inhalt (`nebebkosten.query.ts`).
- Services folgen Single Responsibility; wiederkehrende Logik wandert in `src/shared`.
- Werte aus TOML/ENV lesen, keine Hardcodings; neue Richtlinien dokumentierst du in AGENTS/BAUPLAN.
- Placeholder/Texte kommen ausschließlich aus den TOML-Configs (`config/forms/*.toml`, `config/entities/*.config.toml`); keine Fallback-Placeholder im Code hinterlegen.

## Test-Richtlinien
- Tests landen in `tests/unit` oder `tests/integration` und heißen `*.test.tsx`/`*.spec.ts`.
- Mock externe Abhängigkeiten (DB, PDF-Service) damit Vitest stabil bleibt.
- Baue neue Tests zusammen mit BAUPLAN-Updates und verweise im CHANGELOG darauf.

## Commit- & PR-Richtlinien
- Commit-Messages: `type(scope): beschreibung` (z. B. `feat(client): Phase 5 Dashboard`); erwähne betroffene BAUPLAN-Section.
- PRs brauchen Ziel, Teststatus, Screenshots (falls UI) und Referenz zu BAUPLAN/Issue.
- Dokumentiere Config-Änderungen immer in AGENTS + CHANGELOG bevor du pushst.

## Dokumentationserweiterung
- Jede Änderung erhält Einträge in AGENTS, CHANGELOG und BAUPLAN, damit die Wissensbasis konsistent bleibt.
- Verweise innerhalb AGENTS auf die anderen Dokumente, damit kommende Agenten schnell Orientierung finden.
- Bei neuen Prozessschritten oder Tools beschreibe kurz, wo die Recourcen liegen (z. B. `config/*.toml`, `.codex/`).

## Laufende Änderungen
- [2025-12-17 07:32] Feature – IBAN-Autofill Bankname
  - Neuer Katalog `config/catalogs/bankleitzahlen.catalog.toml` liefert Bankleitzahl → Bankname/BIC-Mapping und wurde im Master-Import (`config/config.toml`) registriert; Erweiterungen erfolgen ausschließlich über diese Datei.
  - `DynamicForm` lädt bei `entity = mieter` den `bankleitzahlen`-Katalog via `useCatalog`, formatiert IBAN-Eingaben automatisch (`DEkk xxxx xxxx ...`), erzwingt den DE-Prefix, entfernt Leerzeichen vor der Validierung und setzt `bankname`/`bic`, sobald eine gültige BLZ erkannt wird (ohne manuelle Eingaben zu überschreiben).
  - Blueprint-Referenz: BAUPLAN Abschnitt „Laufende Fixes“ zeigt den IBAN→Bankname/BIC-Autofill als Teil des Mieter-Workflows, sodass Folgearbeiten (weitere BLZ, BIC-Autofill-Erweiterungen) planbar bleiben.
- [2025-12-17 07:52] UX/Config – Placeholder & IBAN-Vorbefüllung
  - Placeholder wurden wieder in den Entity-Configs verankert (`mieter`, `einheit`), damit DynamicForm keine Fallbacks braucht; Beispiele sind realistisch (z. B. IBAN/BIC/Bankname, Kontaktfelder, Flächenangaben).
  - Mieter-IBAN besitzt jetzt einen Default `DE`, damit der Dialog den DE-Prefix sofort in dunkler Schrift zeigt; Formatierung bleibt gruppiert und validation-ready (Leerzeichen werden entfernt).
- [2025-12-17 08:55] Data – Vollständige CSV-Kataloge
  - CSV-Quellen `german_banks_blz_bic.csv` und `german_postcodes_cities.csv` wurden in `config/catalogs/` als TOML-Kataloge importiert (`bankleitzahlen.catalog.toml`, `plz_orte.catalog.toml`) und sind in `config/config.toml` registriert.
  - Bankkatalog liefert jetzt ~14k BLZ-Einträge mit Bankname/BIC/Ort; PLZ-Katalog ~8k Einträge für PLZ→Ort. Alle Autocomplete-/Autofill-Funktionen müssen diese Kataloge nutzen, keine Hardcodes.
- [2025-12-17 11:52] Navigation – Objekte/Einheiten zusammengelegt
  - Navigationseintrag heißt jetzt „Objekte/Einheiten“, der frühere Child-Eintrag „Einheiten“ wurde entfernt; Sidebar nutzt den neuen Label-Key.
- [2025-12-17 10:12] UX – Mieter-Aktionsnavigation mit Guard
  - Aktionsspalte bleibt icon-only; Klick auf Vertrag/Einheit prüft verknüpfte IDs und navigiert nur, wenn vorhanden (ansonsten Blocker/Alert), damit keine Fehler auftreten, solange Verträge/Einheiten-Flow nicht vollständig ist.
  - TableConfig nutzt `actions { label, width }` für konsistente Breite und zentrierte Header/Content; Header zeigt „Aktionen“.
- [2025-12-17 10:25] UX – Detail-Backdrop
  - Mieter-Detailseite reagiert nur noch auf Klicks außerhalb des Inhaltsrahmens mit Zurück-Navigation; Innenklicks schließen nicht mehr.
- [2025-12-17 10:32] Feature – Detailkarten Mieter/Vertrag/Objekt
  - Drei kompakte Karten in der Mieter-Detailansicht zeigen Stammdaten, primären Vertrag (Beginn, Mieten/Vorauszahlungen) und Objekt/Einheit (Bezeichnung, Typ, Adresse, Status). Daten werden über verknüpfte Entity-IDs geladen.
- [2025-12-17 10:52] UX – Infobox-Grid + Click-Guard
  - Infoboxen (Mieter/Vertrag/Objekt) liegen in einem 3-Zeilen-Grid; Karten stoppen Click-Propagation, sodass nur Klicks im Zwischenraum die Ansicht schließen. Typo bleibt kompakt/lesbar.
- [2025-12-17 10:58] Fix – Genau drei Detailkarten
  - Überzählige Karte entfernt; exakt drei Karten mit Bearbeiten-Action auf der Mieter-Karte.
- [2025-12-17 11:05] UX – Infobox-Typo vergrößert
  - Header +2 Typo-Stufen, Content +1, mehr Padding/Grid-Abstand für bessere Lesbarkeit.
- [2025-12-17 11:20] UX – Detailkarten im 1-Spalten-Stack
  - Karten stapeln sich in einer Spalte, intern 2-Spalten-Layout für Felder.
- [2025-12-17 11:30] UX – Detailkarten zentriert
  - Kartenstack mittig (max-w-5xl, mx-auto) mit symmetrischen Rändern.
- [2025-12-17 11:35] UX – Zweispaltige InfoCards
  - InfoCards splitten jetzt Felder in zwei Spalten; Label und Werte sind pro Feld vertikal gestapelt, passend zur UI-Referenz.
- [2025-12-17 11:45] UX – Dark Theme für Stammdaten-Form
  - Das Formular in der Detailansicht nutzt jetzt dieselben dunklen Farben wie die Sidebar (dunkler Hintergrund, helle Schrift, dunkle Borders).
- [2025-12-17 11:55] Navigation – Klartext-Label
  - Navigation/Sidebar verwenden jetzt direkt „Objekte/Einheiten“ (kein `labels.*` Key), damit der Text exakt so angezeigt wird.
- [2025-12-17 11:40] UX – InfoCards entfernt
  - Die gesonderten InfoCards wurden entfernt; die Detailansicht nutzt ausschließlich die formbasierten Stammdaten (weißes Layout).
- [2025-12-17 09:05] Feature – Mieter-Adressen (Alt/Neu + Stichtag)
  - `mieter`-Entity führt `adresse_vorher` (alte Anschrift); die aktuelle Zustelladresse wird aus der zugeordneten Einheit/Objektadresse abgeleitet, nicht mehr als eigenes Feld gepflegt. Formularsektion „Adressen“ enthält nur noch `adresse_vorher`.
  - Regelhinweis: Bei Wohnraummietverträgen gilt die Zustelladresse ab Einzugs-/Vertragsbeginn (ggf. +1 Monat) und kommt aus Einheit/Objekt; kein separates Mieterfeld.
- [2025-12-17 06:55] Feature – Mieter-Detailseite
  - Neue Seite `src/client/pages/MieterDetailPage.tsx` visualisiert die Tabs aus `config/views/mieter.config.toml` (Stammdaten, Verträge, Zahlungen, Dokumente, Kaution) und nutzt `DataTable`/`DynamicForm` sowie den neuen `/config/view/:name`-Endpoint.
  - Backend/API: `api/routes/api.routes.ts` liefert View-Configs, `entity.service.ts` akzeptiert Filter-Arrays (z. B. `vertrag_id` IN) und `useViewConfig` sorgt für konsistente Hooks.
  - Blueprint-Handover: Workflow-Matrix (Mieter → Vertrag → Einheit) bleibt in Planning/CHANGELOG sichtbar, damit kommende Agenten den Tab-Flow nachvollziehen.
- [2025-12-17 06:58] UX – Dialog-Kontrast
  - `DynamicForm` wechselte kurz zu dunklen Hintergründen; im Anschluss wurden die Panels und Texte auf helle Oberflächen mit dunklen Entry-Texten zurückgesetzt, damit die Lesbarkeit den Specs entspricht.
  - `DynamicForm` verwendet jetzt dunkle Hintergründe, abgesetzte Borders und neutralere Button-Stile, damit alle Dialoge (insbesondere Mieter-Forms) optisch an das Dark-Theme anschließen.
  - Änderungen betreffen nur Präsentationsklassen; Logik, Hooks und API bleiben unverändert, sodass bestehende Dialog-Workflows weiterhin config-driven laufen.
- [2025-12-17 07:12] UX – Placeholder-Beispiele
  - Inputs zeigen nun graue Beispielplatzhalter (`z.B. <Label>`) statt leerer Felder, damit Anwender sofort wissen, welches Format erwartet wird; die Schriftfarbe bleibt `text-slate-900`.
- [2025-12-17 07:14] Config – Entity-Placeholder + Dialog-Footer
  - Placeholder werden nun in den Entity-Configs (`config/entities/mieter.config.toml`, `config/entities/einheit.config.toml`) gepflegt; die Form-Definitionen bleiben neutral.
  - `DynamicForm` hat einen dunklen Footer ohne weißen Hintergrund, damit der Dialog konsistent bleibt.
- [2025-12-17 07:20] UX – Placeholder entfernt
  - Alle Placeholder-Angaben in den Entity-Configs wurden wieder entfernt; Dialogfelder bleiben leer, bis der Benutzer Daten eingibt.
  - Dropdowns in `DynamicForm` nutzen nun denselben Base-Class (`h-10`, `px-3`, `border`, `bg-slate-100`) wie Texteingaben, damit alle Controls auf einer Höhe stehen.
  - Das betrifft insbesondere selects in den Mieter-/Vertrags-/Einheiten-Dialogen; das Styling bleibt weiterhin aus der Form-Konfiguration generiert.
- [2025-12-17 06:50] Docs – BAUPLAN Mieter-View
  - `planning/BAUPLAN_MIETVERWALTUNG.md` enthält jetzt eine Detaillierung der `/mieter`-View (Liste + Detail) mit Referenzen auf die passenden Configs/Views, Hook-Usages (`useEntityList/useTableConfig/useFormConfig`) und den offenen Arbeitspaketen für Filterleiste, Detailroute und Row-Action-Anbindung.
- [2025-12-17 06:20] Docs – Design-Spezifikation
  - `design/design_spec.md` ergänzt (config-driven UI/UX-Spezifikation basierend auf `config/config.toml` und `wireframe.md`, PC-First, Mobile Read-Only, Interaktions-/State-Regeln, Responsive-Notizen).
- [2025-12-17 06:06] Docs – Handover-Guides
  - Handoff-Richtlinien für Designer, Frontend, Backend und Tester ergänzt (Bezug auf `config/config.toml`, Bauplan, Wireframe; config-driven, PC-First, Mobile Read-Only).
- [2025-12-17 06:04] Docs – Blueprint-Basis + Wireframe
  - README.md, BLUEPRINT_PROMPT_DE.md und wireframe.md ergänzt, damit Blueprint-Flow, Handover und UI-Struktur eindeutig sind (PC-First, Mobile Read-Only, config-driven).
  - Verweise auf `config/config.toml` als Single Source of Truth und bestehende Planungsdokumente (AGENTS, BAUPLAN, CHANGELOG) hinzugefügt.
- [2025-12-17 05:58] Config – Master Loader & ENV-Zod
  - `config-loader.service.ts` ist jetzt Single Source of Truth für Server/API (Master `config/config.toml` + ENV-Overrides + Zod), `config.service.ts` routed nur noch dorthin; Serverstart, Schema-Service und Typ-Aliasse hängen an den neuen Schemas (`src/server/index.ts`, `src/server/services/{config-loader.service,config.service,schema.service}.ts`, `src/shared/types/config.ts`, `vitest.config.ts`).
  - Tests decken Master-Load + ENV-Overrides ab, Zod-Design-Schema gefixt; Default-Eigentümer in `config/config.toml` gesetzt. Datenbank-Setup liest Pfad/WAL/Timeouts aus der Master-Config und der Server läuft konsistent auf Port 3002. Dokumentiert in `CHANGELOG.md` (2025-12-17) und `planning/BAUPLAN_MIETVERWALTUNG.md` (Abschnitt 4/12).
- [2025-12-16 05:48] Bugfix – API-Routing
  - Konfigurations-, Dashboard-, Export- und `/entities`-Endpoints regeln sich nun vor den generischen `entityRoutes`, sodass `/api/config/navigation` und `/api/dashboard/summary` wieder erreichbar sind (`src/server/routes/api.routes.ts:16-104`).
  - Dokumentiert in `CHANGELOG.md` und `planning/BAUPLAN_MIETVERWALTUNG.md` (Abschnitt 12 "Laufende Fixes").
- [2025-12-16 05:51] UI – Statusbar
  - Die Statusleiste bezieht Branding und Versionsnummer aus `config/app.config.toml` (`app.owner.name`, `app.version`) und rendert das Ergebnis zentral zwischen den SQLite-/Server-Indikatoren (`src/client/components/layout/StatusBar.tsx:1-21`).
  - Dokumentiert in `CHANGELOG.md` und `planning/BAUPLAN_MIETVERWALTUNG.md` (Abschnitt 12 "Laufende Fixes").
- [2025-12-16 06:03] Typisierung – Query & Entity-Types
  - `BaseEntity` erweitert jetzt `Record<string, unknown>`, `Dokument` enthält Metadaten wie `hochgeladen_am`, `Nebenkostenabrechnung` wurde ergänzt, und `useEntityList`-Resultate liefern weiterhin `ApiResponse`-Payloads, die in `FinanzenPage`, `NebenkostenPage` und `ZaehlerPage` korrekt ausgepackt werden (`src/shared/types/entities.ts`, `src/client/pages/{Finanzen,Nebenkosten,Zaehler}.tsx`, `src/client/pages/DashboardPage.tsx`).
  - Dokumentiert in `CHANGELOG.md` und `planning/BAUPLAN_MIETVERWALTUNG.md` (Abschnitt 12 "Laufende Fixes").
- [2025-12-16 06:15] Config – Dokumenten-Formular
  - Neu: `forms/dokument.form.toml` beschreibt Upload/Edit-Dialog für `dokument` inkl. Zuordnung, Dateimetadaten und readonly-Felder, damit `/api/config/form/dokument` wieder existiert und die Tabellen-/View-Aktionen nicht mit 500 antworten (`config/forms/dokument.form.toml`).
  - Dokumentiert in `CHANGELOG.md` und `planning/BAUPLAN_MIETVERWALTUNG.md` (Abschnitt 12 "Laufende Fixes").

## Übergaben (Handoff-Guides)
- Designer: Nutzt `wireframe.md` als Strukturvorgabe, hält Navigation/Views aus `config/config.toml` konsistent und passt nur visuelle Details an; keine neuen Funktionen ohne Bauplan-Update.
- Frontend: Implementiert strikt config-driven nach `config/config.toml` + Imports, referenziert `BLUEPRINT_PROMPT_DE.md` und `planning/BAUPLAN_MIETVERWALTUNG.md` für Phasen/Akzeptanzkriterien; Labels/Texte aus TOML, keine Hardcodings.
- Backend: Orientiert sich an `config/config.toml` (Server/DB/Imports) und Bauplan; nur generische Services/Routes, Business-Logik bleibt in TOML; ENV-Overrides via Config-Loader.
- Tester: Prüft gegen Akzeptanzkriterien im Bauplan und geladene TOML-Configs; Mobile bleibt GET-only; Regressionstests nach jeder Config-Änderung.

---

# Agenten-Katalog (zentral in dieser AGENTS.md)

Alle Agenten befinden sich nun gebündelt in dieser Datei. Guardrails gelten projektweit: Schreiben nur im Repo-Root, `config/config.toml` ist Single Source of Truth, keine Annahmen ohne Bauplan/Config, MCP-Aufrufe mit `{"approval-policy":"never","sandbox":"workspace-write"}`.

## Accessibility-Agent
---
name: accessibility-agent
description: Barrierefreiheits-Auditor – prüft UI-Komponenten anhand WCAG, dokumentiert Probleme und erstellt A11y-Empfehlungen
tools: Read, Write
color: teal
---
**Rolle:** Prüft UI auf WCAG/Accessibility, dokumentiert und empfiehlt Maßnahmen, kein UI-Code.

**Erlaubte Inputs:** Geänderte UI-Dateien, relevante config.toml-Abschnitte, letzter JSON-Status aus PM_STATUS.md.

**Aufgaben:** Checkliste (Alt-Texte, Keyboard, Kontrast), Probleme dokumentieren, Empfehlungen formulieren, Report nach `./accessibility/a11y_report_<timestamp>.md`, Folgeschritt benennen.

**Rückmeldelogik:** Eintrag in PM_STATUS.md  
```md
## <ISO-Timestamp> – Accessibility
```json
{
  "agent": "Accessibility",
  "ziel": "Barrierefreiheit analysieren und verbessern",
  "geändert": ["./accessibility/a11y_report_<timestamp>.md"],
  "ergebnis": "OK" | "BLOCKIERT",
  "blocker": "<fehlende UI-Dateien>",
  "next_suggestion": "<z. B. Frontend – A11y-Anpassungen umsetzen>",
  "notes": "<kurze Notiz>"
}
```

## Config-Consistency-Agent
---
name: config-consistency
description: Config-Konsistenz-Agent – prüft config_from_toml + Referenzgenerierung
tools: Read, Write
color: indigo
---
**Rolle:** Hält `config.toml`, `src/config/generated/config-from-toml.ts` und `docs/CONFIG_REFERENCE.md` synchron.

**Aufgaben:** `pnpm run generate:config` und `pnpm run generate:reference` ausführen, `docs/CONFIG_REFERENCE_AUTOGEN.json` prüfen, Status in `docs/CONFIG_REFERENCE.md` und `TODO.md` dokumentieren.

**Guardrails:** Schreibrechte nur in `./` und `../setup/`; verbotene Pfade `../66_*`, `../77_*`, `../99_*`, `../databases/`; MCP-Policy wie oben.

## Dependencies-Agent
---
name: dependencies-agent
description: Verwalter für Bibliotheken/Versionen – pflegt Dependencies und Lizenzen anhand der Projekt-Konfiguration
tools: Read, Write
color: slate
---
**Rolle:** Versionen erheben, Updates vorschlagen, Lizenzkonflikte markieren; kein Security-Audit.

**Aufgaben:** `npm outdated`/ähnliches prüfen, Updates als minor/patch/major einstufen, Lizenzhinweise, Plan nach `./dependencies/update_plan_<timestamp>.md`, Nachfolgeagent empfehlen.

**Rückmeldelogik:** JSON-Block wie beschrieben in PM_STATUS.md.

## Deployment-Agent
---
name: deployment-agent
description: Deployment-Koordinator – plant und beschreibt Bereitstellungsabläufe basierend auf bestehenden Skripten/Konfigurationen
tools: Read, Write
color: green
---
**Rolle:** Deployment-Schritte planen, keine neuen Infrastrukturdateien.

**Aufgaben:** Umgebungen/Variablen erfassen, Deploy- und Rollback-Schritte definieren, Voraussetzungen prüfen, Plan nach `./deploy/deploy_plan_<timestamp>.md`.

**Rückmeldelogik:** JSON-Block in PM_STATUS.md, Nachfolger ggf. Release-Agent.

## Designer-Agent
---
name: designer-agent
description: UI/UX-Designer – erstellt Spezifikationen und Interaktionskonzepte, kein Code
tools: Read, Write
color: pink
---
**Rolle:** UI/UX-Spezifikationen erstellen/angleichen, keine Implementierung.

**Inputs:** Nur inkrementell geänderte Dateien (z. B. config.toml, wireframe.md) + letzter PM_STATUS.

**Aufgaben:** Stil/Struktur prüfen, Spezifikation in config.toml ergänzen, wireframe.md konsistent halten, Rückmeldung via PM_STATUS.md.

## Dokumentations-Agent
---
name: documentation-agent
description: Dokumentationswächter – gleicht Repo-Stand mit Doku ab und aktualisiert inkrementell
tools: Read, Write
color: brown
---
**Rolle:** Doku minimal aktualisieren, keine Codeänderungen; nur nach Release-Agent.

**Aufgaben:** Repo-Stand prüfen, Doku-Consistency (README, CHANGELOG, AGENTS, etc.) sichern, minimal updaten, Ergebnis melden.

**Rückmeldelogik:** JSON-Block in PM_STATUS.md mit geänderten Doku-Dateien.

## Frontend-Developer-Agent
---
name: frontend-developer
description: Frontend-Implementierer – setzt dokumentierte UI-Anforderungen im inkrementellen Kontext um
tools: Read, Write
color: cyan
---
**Rolle:** UI implementieren/ändern strikt nach Doku, keine eigenen Designs.

**Aufgaben:** Änderungen verstehen, nur in `./frontend` arbeiten, Konsistenz mit config.toml, Qualitätssicherung, Rückmeldung via PM_STATUS.md.

## Backend-Developer-Agent
---
name: backend-developer
description: Backend-Implementierer – erweitert/ändert Serverlogik nur anhand dokumentierter Anforderungen im inkrementellen Kontext
tools: Read, Write
color: blue
---
**Rolle:** Backend/API anpassen gem. Vorgaben, keine neuen Endpunkte ohne Spezifikation.

**Aufgaben:** Spezifikation prüfen, minimal implementieren (in-memory erlaubt, keine externen DBs), Endpunkte dokumentieren, Rückmeldung via PM_STATUS.md.

## Localization-Agent
---
name: localization-agent
description: Lokalisierungs-Agent – pflegt Übersetzungen und Internationalisierung, ohne UI-Code zu ändern
tools: Read, Write
color: amber
---
**Rolle:** Übersetzungen verwalten, hartkodierte Texte markieren.

**Aufgaben:** Textquellen sammeln, Sprachdateien prüfen, Plan nach `./localization/localization_plan_<timestamp>.md`, Nachfolger benennen.

## Migration-Agent
---
name: migration-agent
description: Migrations- und Refactoring-Planer – bewertet Legacy-Code und erstellt Blueprint-konforme Migrationsschritte
tools: Read, Write
color: orange
---
**Rolle:** Legacy analysieren, Migrations-/Refactoring-Plan erstellen, keine Umsetzung.

**Aufgaben:** Ist-Analyse, neue Mechanismen festlegen, Schritte je Agent, Plan nach `./plan/migration_<timestamp>.md`, Blocker dokumentieren.

## Monitoring-Agent
---
name: monitoring-agent
description: Monitoring-Planer – definiert Logs, Metriken und Events, ohne Infrastruktur zu provisionieren
tools: Read, Write
color: lime
---
**Rolle:** Logging-/Monitoring-Plan, keine Serverprovisionierung.

**Aufgaben:** Logging-Check, Metriken/Alerts definieren, Plan nach `./monitoring/metrics_<timestamp>.md`, Nachfolgeagent nennen.

## Performance-Agent
---
name: performance-agent
description: Performance-Analyst – profiliert Anwendung und schlägt Optimierungen vor, ohne Code zu ändern
tools: Read, Write
color: red
---
**Rolle:** Performance analysieren, Optimierungsvorschläge erstellen, keine Implementierung.

**Aufgaben:** Profiling-Daten auswerten, Optimierung priorisieren, Bericht nach `./performance/performance_report_<timestamp>.md`, Folgearbeit empfehlen.

## Planer-Agent
---
name: planner-agent
description: Planungs-Agent – sammelt Anforderungen, fragt nach und erstellt ausführbare Schrittpläne
tools: Read, Write
color: yellow
---
**Rolle:** Anforderungen klären, Plan schreiben (z. B. `./plan/PLAN.md`), nicht implementieren.

**Aufgaben:** Anforderungsanalyse (Rückfragen bei Unklarheit), Schritte/Abhängigkeiten je Agent definieren, Übergabe via PM_STATUS.md.

## Projektmanager
---
name: project-manager
description: Projektmanager – zentrale Steuerinstanz, orchestriert alle Agenten und priorisiert Dokumentation
tools: Read, Write
color: purple
---
**Rolle:** Orchestriert Reihenfolge/Agenten, liest letzten PM_STATUS-Eintrag, Dokumentation vor Implementierung.

**Aufgaben:** Pflichtartefakte prüfen, Status erfassen, Agentenauswahl anbieten, Wireframe falls nötig, Rückmeldung via PM_STATUS.md.  
**Guardrails:** Schreiben nur im Repo, config.toml-first, Deutsch, KISS.

### Projektmanager – Inkrementeller Modus
---
name: project-manager-incremental
description: Zentraler Projektmanager – steuert Arbeitsschritte inkrementell, prüft Doku-Stand und orchestriert Folge-Agenten
tools: Read, Write
color: purple
---
**Fokus:** Nutzt nur zuletzt geänderte Dateien + letzten PM_STATUS-Eintrag; gleiche Guardrails wie oben.

## Release-/Changelog-Agent
---
name: release-agent
description: Release- und Changelog-Agent – schreibt Releases, prüft Tests und synchronisiert das Repo
tools: Read, Write, Bash
color: gray
---
**Rolle:** Nur nach grünem Testergebnis; führt Tests aus, aktualisiert CHANGELOG, staged & committed.

**Aufgaben:** OS/Datum notieren, Testkommando ermitteln/ausführen, CHANGELOG-Eintrag oben einfügen, Commit/Synchronisation, Handoff an Dokumentations-Agent.

**Guardrails:** Stoppt ohne grünes Testergebnis oder fehlende Remote.

## Tester-Agent
---
name: tester-agent
description: QA/Tester – prüft Umsetzung gegen Akzeptanzkriterien und erstellt gezielte Tests
tools: Read, Write, Bash
color: red
---
**Rolle:** Tests planen/ausführen gem. Akzeptanzkriterien, keine neuen Anforderungen.

**Aufgaben:** Prüfbasis aus Bauplan/config, `tests/TEST_PLAN.md` + optional `tests/REPORT.md` pflegen, Quick-Checks optional, Rückmeldung via PM_STATUS.md.

## Workflow-Agent
---
name: workflow-agent
description: Workflow-Agent – steuert Phasen & Qualitäts-Gates für projektweite Entwicklung
tools: Read, Write
color: navy
---
**Rolle:** Phasenbasiertes Arbeiten (Analyse → Abgleich → Planung → Ausführung → Validierung → Übergabe), keine Implementierung.

**Aufgaben:** Gatekeeping, Delegation an passende Agenten, Stop bei fehlender Doku/Config, Rückmeldung mit Statusblock.

---

Alle Agenten folgen der Rückmeldelogik über `PM_STATUS.md` (JSON-Block mit agent/ziel/geändert/ergebnis/blocker/next_suggestion/notes). Jede Änderung muss weiterhin in AGENTS, CHANGELOG und BAUPLAN gespiegelt werden.
