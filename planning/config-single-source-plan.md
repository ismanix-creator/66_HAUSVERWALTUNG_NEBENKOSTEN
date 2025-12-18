# Plan: Konsolidierung auf eine `config/config.toml`

Ziel: Umsetzung gemäß `docs/Config_toml_als_Quelle.md` ohne Abweichungen.

## 1) Vorbereitung
- Backup von `config/` erstellen (z. B. `config_backup/` im Repo).
- In `config/config.toml` am Ende folgende Root-Sektionen ergänzen:
  - `[labels]`
  - `[catalogs]`
  - `[entities]`
  - `[forms]`
  - `[tables]`
  - `[views]`
  - `[validation]`
  - `[design]`
- `imports`-Sektion aus `config/config.toml` entfernen.

## 2) Inhalte konsolidieren (Datei -> Sektion)
- Labels: `config/labels/de.labels.toml` -> `[labels]`
- Catalogs: `config/catalogs/*.catalog.toml` -> `[catalogs.<name>]`
- Entities: `config/entities/*.config.toml` -> `[entities.<entity>]` (ohne äußere `[entity]`)
- Forms: `config/forms/*.form.toml` -> `[forms.<id>]` (ohne äußere `[form]`)
- Tables: `config/tables/*.table.toml` -> `[tables.<id>]` (ohne äußere `[table]`)
  - Row-Actions nach `[tables.<id>.row_actions]`
- Views: `config/views/*.config.toml` -> `[views.<id>]` (ohne äußere `[view]`)
- Validation: `config/validation/rules.config.toml` -> `[validation]`
- Design: `config/themes/design-system.config.toml` -> `[design]`

## 3) Loader & Schemas anpassen
- Importlogik aus `src/server/services/config-loader.service.ts` entfernen.
- `ImportsSchema` aus `src/shared/config/schemas.ts` entfernen.
- `MasterConfigSchema` auf neue Keys erweitern:
  - `labels`, `catalogs`, `entities`, `forms`, `tables`, `views`, `validation`, `design`
- Neue Getter in `src/server/services/config.service.ts`:
  - `getLabels`, `getCatalogs`, `getEntities`, `getForms`, `getTables`, `getViews`, `getValidation`, `getDesign`

## 4) Backend-Refactor
- Services/Router auf neue Getter umstellen.
- `src/server/services/schema.service.ts` liest `config.entities`.
- Validierung kombiniert `config.validation` und `config.entities.<entity>.validation`.

## 5) Frontend-Refactor
- Hooks/Services auf Objektzugriff umstellen:
  - `config.tables.mieter` statt `mieter.table`
  - `config.forms.mieter` statt `mieter.form`
- DataTable/DynamicForm nutzen neue Struktur.

## 6) Aufräumen & Doku
- Alte TOML-Dateien löschen oder als deprecated markieren.
- Doku aktualisieren: `AGENTS.md`, `planning/BAUPLAN_MIETVERWALTUNG.md`, `CHANGELOG.md`.
- Tests ausführen (mind. vorhandene Unit-Tests).

## 7) Validierung
- Start der App/Server prüfen (z. B. `npm run dev`).
- Wichtige Flows testen: Entities, Tables, Forms, Views, Navigation.
