# 60_ARCH_CONFIG_UI – Architektur, Config-Driven & UI

**Quellen:** `README.md`, `CLAUDE.md`, `CODEX.md`, `.ai/architecture.md`, `.ai/rules.md`, `.claude/CLAUDE.md`, `wireframe.md`, `AGENTS.md`

## 1. Architekturüberblick

- **Config-Driven Kern:** Business-Logik, Entities, Forms, Views, Tables, Labels, Catalogs, Navigation und Design-Settings stammen aus `config/config.toml` und den importierten Konfigurationsdateien (`README.md`, `CODEX.md`, `.ai/architecture.md`).  
- **Code ist generisch:** Frontend und Backend lesen über `ConfigLoaderService` (Express + React) die gleichen TOML-Schemata (`CLAUDE.md`, `.ai/rules.md`, `.codex/CODEX.md`). Keine neuen Entitäten oder Tabellen ohne Config-Änderung.  
- **Data Layer:** SQLite (WAL) lokal, `data/` enthält Backups; Backend über `src/server/services/schema.service.ts` und `database.service.ts` generiert Tabellen.  
- **APIs:** REST-Pattern `/api/{entity}` + `/api/config/{typ}/{name}`; generische Entity-Service-Klassen (siehe `CODEX.md` für Pattern).

## 2. Config-Komponenten & Guardrails

- **Single Source of Truth** – `config/config.toml` konsolidiert alle Domain-Definitionen; die Root-Stub `./config.toml` existiert nur dokumentarisch.  
- **Labels/Text** – Labels kommen ausschließlich aus `config/labels/de.labels.toml` (`.ai/rules.md`, AGENTS).  
- **Validierung** – Zod-Schemas werden aus TOML generiert, serverseitige Validierung spiegelt Client-Regeln (`.ai/rules.md`).  
- **Systemzeit & Dokumentation** – Änderungen führen zu `CHANGELOG.md`, `PM_STATUS.md` und Portalseiten, Systemzeit zwingend per `date '+%Y-%m-%d %H:%M:%S UTC'` prüfen (`CLAUDE.md`, `CODEX.md`).

## 3. UI-Architektur & Wireframes

- **PC-First + Mobile Read-Only** – Desktop-CRUD, Mobile nur GET (wireframe.md, README). Mobile-Routen blockieren write-Methoden; UI blendet Schreibaktionen aus (`CLAUDE.md`).  
- **Wireframe-Logik** – `wireframe.md` beschreibt Struktur (Sidebar, Haupt-Content, Dialoge) sowie Interaktionsebenen; `portal/60` fasst diese Struktur in der `.kilocode`-Sprache zusammen.  
- **Komponenten** – React/Ts-Komponenten nutzen Tailwind, Zustand + TanStack Query; `src/client/components/data` beinhaltet `DataTable`, `DynamicForm`, `InfoCard` etc. Alle Layout-Entscheidungen stammen aus Config (Spacing, Farben, Typo) und nicht aus Hardcode.  
- **Design Guardrails** – Keine neuen visuellen Spezifikationen außerhalb der Wireframes; Designer-Agent hält sich an `wireframe.md` und `config.toml`.

## 4. Config ↔ UI Verbindung

- **Views / Tables** – `config/views` und `config/tables` definieren Columns, Row-Actions, Filter; Frontend generiert UI automatisch (`README`, `.ai/architecture`).  
- **Dialogs & Forms** – `config/forms/*.form.toml` steuern Felder, Placeholders, Validations. UI-Inputs lesen diese Konfigurationen und füllen automatisch `labels`.  
- **Navigation** – `config/navigation.config.toml` ± label keys; Sidebar/Routes generiert sich daraus (`README`, `CODEX`, `.github/agents/navigation-agent.md`).  
- **Autofill & Catalogs** – Catalog-Dateien (`config/catalogs/*.catalog.toml`) liefern Werte (BLZ, PLZ); Autocomplete/Autofill-Funktionen im Frontend referenzieren diese Datasets (Portal `30`).  
- **Tests & Performance** – Architektur-Docs empfehlen `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`; UI und Backend müssen diese Tests bestehen, bevor Änderungen in Docs/CHANGELOG enden (`CODEX.md`).

## 5. Zusammenfassung

Die `.kilocode`-Architekturseite verknüpft Config-First-Regeln mit dem konkreten UI-Blueprint: `config/config.toml` bleibt die Quelle, API/Services interpretieren sie, Wireframes liefern strukturierte Erwartungen, und Gatekeeper-Dokumente (AGENTS, `.ai`, `.claude`, `.codex`) gewährleisten Konsistenz. Alle weiteren Änderungen folgen dem Workflow (Portal 20) und hinterlassen eine Statusspur (Portal 40) in `PM_STATUS.md`.

Datei `portal/60_ARCH_CONFIG_UI.md` vollständig erstellt.
