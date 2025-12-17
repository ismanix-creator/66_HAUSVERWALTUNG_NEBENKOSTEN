# Mietverwaltung (Config-Driven)

Lokale, 100% konfigurationsgetriebene Miet- und Nebenkostenverwaltung mit React/TypeScript (Vite) und Express/SQLite. PC-First mit optionaler Mobile-Übersicht (Read-Only), keine Cloud-Abhängigkeit.

## Leitplanken
- Single Source of Truth: `config/config.toml` inkl. Imports für Navigation, Entities, Views, Forms, Tables, Labels.
- Root-Stub `./config.toml` existiert nur, damit alle Pflichtdokumente im Projekt-Root liegen; produktiv wird ausschließlich `config/config.toml` von `ConfigLoaderService` geladen.
- Config-First, kein Hardcoding; Business-Logik, Server-Ports, DB-Pfade und UI-Struktur kommen aus TOML + ENV-Overrides.
- PC-First (CRUD), Mobile nur GET unter `/mobile/...` (Middleware blockiert Schreibzugriffe).
- Backups lokal über SQLite (`data/`), Assets unter `public/`.

## Schnellstart
1) Voraussetzungen: Node 18+, npm.
2) Abhängigkeiten: `npm install`
3) Entwicklung: `npm run dev` (Vite + ts-node)
4) Qualität: `npm run lint`, `npm run typecheck`, `npm test`
5) Build: `npm run build`

## Struktur (Auszug)
- `config/` – Master-Config (`config.toml`), Entities, Views, Forms, Tables, Catalogs, Labels.
- `src/client/` – React-UI, config-driven Seiten/Komponenten.
- `src/server/` – Express-API, zentraler Config-Loader, Schema-/DB-Services, generische Entity-Routen.
- `src/shared/` – Geteilte Typen/Utilities.
- `planning/` – Baupläne und Config-Strukturen.
- `.ai/`, `.codex/`, `.claude/` – Projektregeln, Workflows, Reviews.
- `data/` – SQLite-DB, Backups, Dokumente (lokal, nicht im Repo).

## Dokumentation & Referenzen
- `config/config.toml` – zentrale Konfiguration.
- `BLUEPRINT_PROMPT_DE.md` – Blueprint-Vorgaben (Zielbild, Phasen, Akzeptanzkriterien).
- `planning/BAUPLAN_MIETVERWALTUNG.md` – Detailbauplan & Akzeptanzkriterien.
- `AGENTS.md` – Rollen, Prozesse, Coding-/Testregeln.
- `wireframe.md` – strukturelle UI-Wireframes (PC + Mobile Read-Only).
- `CHANGELOG.md` – Änderungsverlauf.

## Mobile Read-Only
- Route: `/mobile/dashboard` (+ ggf. weitere GET-Views).
- Keine POST/PUT/DELETE; UI blendet Schreibaktionen aus, Server blockiert sie.
- Zugriff empfohlen über VPN (WireGuard zur FritzBox).
