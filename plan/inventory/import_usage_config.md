# Import-/Usage-Analyse: Config-Services

Datum: 2025-12-21

Zweck: Kartierung aller Import-/Verwendungsstellen von `config-loader.service` und `config.service` zur Risikoeinschätzung und PR-Planung.

Wesentliche Erkenntnisse (konservativ)
- `src/server/services/config-loader.service.ts` wird an vielen Stellen importiert und ist die zentrale Runtime-Quelle für `config/config.toml`.
  - Importiert in: `src/server/index.ts`, `src/server/routes/entity.routes.ts`, `src/server/services/database.service.ts`, `src/server/services/schema.service.ts`, u.a.
- `src/server/services/config.service.ts` verwendet intern `config-loader.service` und bietet helper-APIs (`getAppConfig()`, `getEntityConfig(name)`) — importiert in: `src/server/routes/api.routes.ts`, `src/server/services/schema.service.ts`, `src/server/services/entity.service.ts`.
- `src/shared/config` und `src/shared/config/schemas.ts` enthalten Zod-Schemata und Typs für die Master-Config; viele Server-Utils importieren diese Typen.
- Client-seitige Hooks `src/client/hooks/useConfig.ts` greifen auf lokale/Shared-Config-Hooks zu und werden breit in `src/client/pages/*` genutzt.
- `scripts/copy-config.js` und vorhandene Dokumentation (`README.md`, `CHANGELOG.md`, AGENTS) deklarieren, dass `config/config.toml` die Master-Config ist; root `config.toml` ist ein Stub.

Risikobewertung
- Hoch: Entfernen oder Konsolidieren der Loader/Service-Dateien ohne vorherige Refactor-PRs würde zahlreiche Server- und Test-Imports brechen.
- Mittel: Änderungen an `src/shared/config/schemas.ts` können Typ- und Teständerungen erfordern.

Empfohlene nächste, nicht-invasive Schritte
1. Erzeuge eine vollständige Import‑Map (automatisch) für `config-loader.service.ts` und `config.service.ts` (wer importiert sie, welche Exporte werden verwendet).
2. Erstelle eine Liste der Tests, die auf diese Services angewiesen sind (`tests/unit/config-loader.service.test.ts`, `tests/unit/config-entities.test.ts`).
3. Definiere Zielarchitektur: `config/config.toml` bleibt Single Source; `config-loader` bleibt runtime-loader; `config.service` bietet convenience-APIs. Falls Konsolidierung gewünscht: erst Refactor‑Branch mit Adapter-Exports.

Dateien mit direkten Importen (Auszug)
- `src/server/index.ts`
- `src/server/routes/entity.routes.ts`
- `src/server/routes/api.routes.ts`
- `src/server/services/schema.service.ts`
- `src/server/services/database.service.ts`
- `src/server/services/entity.service.ts`
- `tests/unit/config-loader.service.test.ts`

Hinweis: Dies ist eine statische, read-only Analyse; keine Dateien wurden verändert. Auf Wunsch erstelle ich die vollständige Import-Map (CSV/JSON) und markiere Refactor-PRs mit konkreten Datei-Mappings.
