# Migration: StatsCard Integration (inline)
Datum: 2025-12-21

Ziel: `views.dashboard.stats` konfigurierbar machen und DashboardPage nutzt die vorhandene inline-`StatsCard`-Funktionalität.

1) Prüfung
 - `config/config.toml` prüfen: Existiert `views.dashboard.stats` oder `views.dashboard.stats_cards`?
 - Prüfe API `/api/config/view/dashboard` (gibt die View-Config zurück?)

2) Änderungen (minimal, inline-Strategie)
 - Backend: `StatsCardConfig` Typ ergänzen in `src/server/services/config-types.statscard.ts` und in den Config-Loader importieren
 - Config-Generator: `pnpm run generate:config` ausführen, damit `views.*.stats` in `src/config/generated` erscheint
 - Frontend: keine neue `StatsCard.tsx` Datei erstellen — `DashboardPage.tsx` verwendet bereits eine inline-Funktion `StatsCard`. Nur die Konfigurationsfelder prüfen und mapping testen.
 - Schema: Nur falls neue DB-Felder nötig sind; ansonsten keine Schema-Änderung.

3) Tests
 - `npm run typecheck`
 - `npm run test`
 - `npm run build`

4) Doku
 - `CHANGELOG.md`: neuen Eintrag (siehe `CHANGELOG.ADD.md`) mit verifizierter Systemzeit
 - `PM_STATUS.md`: JSON-Block anhängen (siehe `PM_STATUS.ADD.md`) mit verifizierter Systemzeit

5) Commit
 - Systemzeit prüfen, Commit-Message enthält verifizierte Zeit

Hinweis: Das Dashboard verwendet die inline-`StatsCard` in `src/client/pages/DashboardPage.tsx` (keine separate Komponente erforderlich).
# Migration: StatsCard Integration
Datum: 2025-12-21

1) Prüfung
 - `config/config.toml` auf `views.dashboard.stats` prüfen
 - vorhandene API `/api/config/view/dashboard` prüfen

2) Änderungen (minimal)
 - Client: add `src/client/components/StatsCard.tsx`
 - Client: integrate into `src/client/pages/DashboardPage.tsx`
 - Server: add `StatsCardConfig` type file and import into config-loader
 - Schema: falls DB-Felder benötigt -> `schema.service` anpassen

3) Tests
 - `npm run typecheck`
 - `npm run test`
 - `npm run build`

4) Doku
 - Update `CHANGELOG.md`
 - Append JSON Block to `PM_STATUS.md`

5) Commit
 - Systemzeit prüfen, Commit mit verifizierter Zeit, push
