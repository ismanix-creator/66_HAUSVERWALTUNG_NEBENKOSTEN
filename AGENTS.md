# Repository Guidelines

## Wichtige Referenzen
- Lies `CODEX.md` und `.codex/CODEX.md` für projektweite Erwartungen, Ports und das Config-first-Paradigma.
- Nutze `.codex/workflows/implement.md` bzw. `/refactor.md`, ergänze Änderungen in `.ai/*.md` oder `planning/BAUPLAN_MIETVERWALTUNG.md`.

## Projektstruktur & Modulorganisation
- `src/client`, `src/server` und `src/shared` trennen UI, API und gemeinsame Typen/Utilities.
- `config/entities/*.config.toml` definiert das Schema; `src/server/services/schema.service.ts` lädt diese beim Start. Änderungen verlangen einen Neustart.
- `data` enthält `database.sqlite`, WAL/SHM sowie `backups`; Skripte (z. B. `scripts/init-db.ts`) manipulieren die Datei.
- `public` liefert statische Assets, `dist` den Produktionsoutput, und `tests/unit` vs. `tests/integration` halten Testfälle getrennt.

## Build-, Test- und Entwicklungsbefehle
- `npm run dev` startet `npm run dev:server` + `npm run dev:client` für lokale Feature-Arbeit.
- `npm run build` erstellt Client (`vite build`) und Server (`tsc -p tsconfig.server.json`).
- `npm run preview` startet den gebauten Client lokal via Vite.
- `npm run lint`, `npm run lint:fix`, `npm run format` und `npm run typecheck` sichern Style und Typen.
- `npm test` (Vitest) führt alle Tests aus; `npm run test -- --watch` für schnelle Iterationen.
- `npm run db:init | db:migrate | db:seed | db:backup` führen Datenbankskripte in `scripts/` aus.

## Coding-Stil & Namenskonventionen
- ESLint (inkl. `@typescript-eslint`, React-Plugins) plus Prettier (`.prettierrc`) gelten: 2 Spaces, keine Semikolons, Single Quotes, `arrowParens: "avoid"`.
- Verwende sprechende Dateinamen wie `mieter.config.toml`, `api.routes.ts` oder `schema.service.ts`; TypeScript-Identifikatoren folgen CamelCase.
- Komponenten/Services sollen einzelne Verantwortlichkeiten tragen; splitte aufgeblähte Dateien entlang von `services`, `routes` oder `hooks`.
- Vermeide Hardcoding; nutze Konfiguration (`config/entities`, `config/forms`).

## Test-Richtlinien
- Platziere Tests unter `tests/unit` bzw. `tests/integration` mit beschreibenden Namen (z. B. `entity.routes.integration.test.ts`).
- Halte Tests deterministisch und mocke externe Abhängigkeiten, damit `vitest` zuverlässig läuft.
- Beschreibe in PRs unzureichend abgedeckte Bereiche; Coverage wird aktuell nicht erzwungen, aber Transparenz ist gewünscht.

## Commit- & PR-Richtlinien
- Commitze im Format `type(scope): beschreibung` (z. B. `feat(frontend): Phase 2`), damit die Historie übersichtlich bleibt.
- PRs brauchen Zusammenfassung, Teststatus und verlinkte Issues; UI-Änderungen ergänze mit Screenshots oder Mockups.
- Gib manuelle Validierung an (etwa `npm run dev` + `npm test`); dokumentiere Config-first-Entscheidungen wenn du eine TOML-Datei angepasst hast.

## Sicherheit & Konfigurationstipps
- Konfiguriere Entitäten über `config/entities`; direkte DB-Änderungen nur über Migrationen (`npm run db:migrate`) oder `scripts/` durchführen.
- Halte sensible Daten aus dem Repository; `data/backups` bleibt lokal und dient als Wiederherstellungsgrundlage vor riskanten Änderungen.
- Nutze `npm run db:backup` vor Eingriffen in die Datenbank und documentiere neue Felder stets in den TOML-Dateien sowie im CHANGELOG.
