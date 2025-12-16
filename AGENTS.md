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

## Laufende Änderungen
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
