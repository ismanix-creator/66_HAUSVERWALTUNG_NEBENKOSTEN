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
