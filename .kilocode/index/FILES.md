# Projektdatei-Index

## Wurzelverzeichnis
- [.eslintrc.cjs](.eslintrc.cjs)
- [.gitignore](.gitignore)
- [.gitpod.yml](.gitpod.yml)
- [.prettierrc](.prettierrc)
- [AGENTS.md](AGENTS.md)
- [BLUEPRINT_PROMPT_DE.md](BLUEPRINT_PROMPT_DE.md)
- [CHANGELOG_ARCHIVE.md](CHANGELOG_ARCHIVE.md)
- [CHANGELOG.md](CHANGELOG.md)
- [CLAUDE.md](CLAUDE.md)
- [CODEX.md](CODEX.md)
- [config.toml](config.toml)
- [german_banks_blz_bic.csv](german_banks_blz_bic.csv)
- [german_postcodes_cities.csv](german_postcodes_cities.csv)
- [package-lock.json](package-lock.json)
- [package.json](package.json)
- [PM_STATUS.md](PM_STATUS.md)
- [postcss.config.js](postcss.config.js)
- [README.md](README.md)
- [restart-project-server.sh](restart-project-server.sh)
- [tailwind.config.js](tailwind.config.js)
- [todo.md](todo.md)
- [tsconfig.json](tsconfig.json)
- [tsconfig.node.json](tsconfig.node.json)
- [tsconfig.server.json](tsconfig.server.json)
- [vite.config.ts](vite.config.ts)
- [vitest.config.ts](vitest.config.ts)
- [wireframe.md](wireframe.md)

## Konfigurationsverzeichnis
- [config/config.toml](config/config.toml)

### Kataloge
- [config/catalogs/anrede.catalog.toml](config/catalogs/anrede.catalog.toml)
- [config/catalogs/bankleitzahlen.catalog.toml](config/catalogs/bankleitzahlen.catalog.toml)
- [config/catalogs/dokumenttypen.catalog.toml](config/catalogs/dokumenttypen.catalog.toml)
- [config/catalogs/einheittypen.catalog.toml](config/catalogs/einheittypen.catalog.toml)
- [config/catalogs/heizungsarten.catalog.toml](config/catalogs/heizungsarten.catalog.toml)
- [config/catalogs/kostenarten.catalog.toml](config/catalogs/kostenarten.catalog.toml)
- [config/catalogs/objekttypen.catalog.toml](config/catalogs/objekttypen.catalog.toml)
- [config/catalogs/plz_orte.catalog.toml](config/catalogs/plz_orte.catalog.toml)
- [config/catalogs/prioritaeten.catalog.toml](config/catalogs/prioritaeten.catalog.toml)
- [config/catalogs/status.catalog.toml](config/catalogs/status.catalog.toml)
- [config/catalogs/umlageschluessel.catalog.toml](config/catalogs/umlageschluessel.catalog.toml)
- [config/catalogs/wiederholungen.catalog.toml](config/catalogs/wiederholungen.catalog.toml)
- [config/catalogs/zaehlertypen.catalog.toml](config/catalogs/zaehlertypen.catalog.toml)
- [config/catalogs/zahlungsarten.catalog.toml](config/catalogs/zahlungsarten.catalog.toml)

## Quellcode

### Client
- [src/client/App.tsx](src/client/App.tsx)
- [src/client/main.tsx](src/client/main.tsx)
- [src/client/vite-env.d.ts](src/client/vite-env.d.ts)

#### Komponenten
- [src/client/components/data/DataTable.tsx](src/client/components/data/DataTable.tsx)
- [src/client/components/data/DynamicForm.tsx](src/client/components/data/DynamicForm.tsx)
- [src/client/components/layout/AppShell.tsx](src/client/components/layout/AppShell.tsx)
- [src/client/components/layout/Sidebar.tsx](src/client/components/layout/Sidebar.tsx)
- [src/client/components/layout/StatusBar.tsx](src/client/components/layout/StatusBar.tsx)

#### Seiten
- [src/client/pages/DashboardPage.tsx](src/client/pages/DashboardPage.tsx)
- [src/client/pages/DokumentePage.tsx](src/client/pages/DokumentePage.tsx)
- [src/client/pages/EinheitenPage.tsx](src/client/pages/EinheitenPage.tsx)
- [src/client/pages/FinanzenPage.tsx](src/client/pages/FinanzenPage.tsx)
- [src/client/pages/MieterDetailPage.tsx](src/client/pages/MieterDetailPage.tsx)
- [src/client/pages/MieterPage.tsx](src/client/pages/MieterPage.tsx)
- [src/client/pages/NebenkostenPage.tsx](src/client/pages/NebenkostenPage.tsx)
- [src/client/pages/ObjektePage.tsx](src/client/pages/ObjektePage.tsx)
- [src/client/pages/VertraegePage.tsx](src/client/pages/VertraegePage.tsx)
- [src/client/pages/ZaehlerPage.tsx](src/client/pages/ZaehlerPage.tsx)

#### Mobile
- [src/client/pages/mobile/MobileDashboardPage.tsx](src/client/pages/mobile/MobileDashboardPage.tsx)

#### Services & Hooks
- [src/client/services/api.service.ts](src/client/services/api.service.ts)
- [src/client/hooks/useConfig.ts](src/client/hooks/useConfig.ts)
- [src/client/hooks/useEntity.ts](src/client/hooks/useEntity.ts)
- [src/client/hooks/useMobile.ts](src/client/hooks/useMobile.ts)

#### Styles & Types
- [src/client/styles/global.css](src/client/styles/global.css)
- [src/client/types/](src/client/types/)

### Server
- [src/server/index.ts](src/server/index.ts)

#### Middleware
- [src/server/middleware/error.middleware.ts](src/server/middleware/error.middleware.ts)
- [src/server/middleware/mobile.middleware.ts](src/server/middleware/mobile.middleware.ts)
- [src/server/middleware/rate-limit.middleware.ts](src/server/middleware/rate-limit.middleware.ts)

#### Routes
- [src/server/routes/api.routes.ts](src/server/routes/api.routes.ts)
- [src/server/routes/entity.routes.ts](src/server/routes/entity.routes.ts)
- [src/server/routes/mobile.routes.ts](src/server/routes/mobile.routes.ts)

#### Services
- [src/server/services/config-loader.service.ts](src/server/services/config-loader.service.ts)
- [src/server/services/config.service.ts](src/server/services/config.service.ts)
- [src/server/services/dashboard.service.ts](src/server/services/dashboard.service.ts)
- [src/server/services/database.service.ts](src/server/services/database.service.ts)
- [src/server/services/entity.service.ts](src/server/services/entity.service.ts)
- [src/server/services/mobile.service.ts](src/server/services/mobile.service.ts)
- [src/server/services/pdf.service.ts](src/server/services/pdf.service.ts)
- [src/server/services/schema.service.ts](src/server/services/schema.service.ts)

#### Utils & Types
- [src/server/utils/logger.ts](src/server/utils/logger.ts)
- [src/server/utils/pagination.ts](src/server/utils/pagination.ts)
- [src/server/types/pdfkit.d.ts](src/server/types/pdfkit.d.ts)

### Shared
- [src/shared/config/index.ts](src/shared/config/index.ts)
- [src/shared/config/schemas.ts](src/shared/config/schemas.ts)
- [src/shared/types/config.ts](src/shared/types/config.ts)
- [src/shared/types/dashboard.ts](src/shared/types/dashboard.ts)
- [src/shared/types/entities.ts](src/shared/types/entities.ts)
- [src/shared/types/index.ts](src/shared/types/index.ts)
- [src/shared/types/mobile.ts](src/shared/types/mobile.ts)

## Tests
- [tests/unit/config-entities.test.ts](tests/unit/config-entities.test.ts)
- [tests/unit/config-loader.service.test.ts](tests/unit/config-loader.service.test.ts)
- [tests/unit/database.service.test.ts](tests/unit/database.service.test.ts)
- [tests/unit/mobile.service.test.ts](tests/unit/mobile.service.test.ts)
- [tests/unit/pagination.util.test.ts](tests/unit/pagination.util.test.ts)
- [tests/unit/rate-limit.middleware.test.ts](tests/unit/rate-limit.middleware.test.ts)
- [tests/unit/schema.service.test.ts](tests/unit/schema.service.test.ts)

## Dokumentation
- [docs/Config_toml_als_Quelle.md](docs/Config_toml_als_Quelle.md)

## Planung
- [planning/BAUPLAN_MIETVERWALTUNG.md](planning/BAUPLAN_MIETVERWALTUNG.md)
- [planning/MIETVERWALTUNG_PLANUNG.md](planning/MIETVERWALTUNG_PLANUNG.md)

## Skripte
- [scripts/add-js-extensions.mjs](scripts/add-js-extensions.mjs)
- [scripts/copy-config.js](scripts/copy-config.js)
- [scripts/watch-server.js](scripts/watch-server.js)

## Legacy Verzeichnisse
- [.ai/](.ai/)
- [.claude/](.claude/)
- [.codex/](.codex/)
- [config_backup/](config_backup/)

## Kilocode System
- [.kilocode/README.md](.kilocode/README.md)
- [.kilocode/portal/](.kilocode/portal/)
- [.kilocode/rules/](.kilocode/rules/)
- [.kilocode/index/](.kilocode/index/)