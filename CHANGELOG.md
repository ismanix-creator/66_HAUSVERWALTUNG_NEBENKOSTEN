# Changelog - Mietverwaltung

Alle wichtigen Änderungen werden hier dokumentiert.

Format: `[YYYY-MM-DD HH:MM] - Kategorie - Beschreibung`

---

## 2025-12-17

### [12:00] - Config - Master-Loader & ENV-Validation
- Server und API ziehen Konfigurationswerte jetzt zentral aus `config/config.toml` via `ConfigLoaderService`, inklusive ENV-Overrides und Zod-Validierung (`src/server/index.ts`, `src/server/services/config-loader.service.ts`, `src/server/services/config.service.ts`, `config/config.toml`).
- Typen spiegeln die Zod-Schemas statt Legacy-Interfaces; Schema-Initialisierung nutzt die geladene Entity-Liste und Vitest kennt die Projekt-Aliasse (`src/shared/types/config.ts`, `src/server/services/schema.service.ts`, `vitest.config.ts`).
- Neuer Vitest-Check stellt sicher, dass Master-Config/Imports geladen und ENV-Werte angewandt werden; Zod-Schema für Design-Shadows korrigiert (`tests/unit/config-loader.service.test.ts`, `src/shared/config/schemas.ts`).

## 2025-12-16

### [06:03] - Bugfix - Typisierung & Query Handling
- `BaseEntity` erbt nun von `Record<string, unknown>`, Nebenkostenabrechnungen wurden typisiert, `Dokument` kennt `hochgeladen_am`/`dateiname`, und die `useEntityList`-Resultate in `FinanzenPage`, `NebenkostenPage`, `ZaehlerPage` und `DashboardPage` nutzen die tatsächliche `ApiResponse`-Payload (`src/shared/types/entities.ts`, `src/client/pages/{Finanzen,Nebenkosten,Zaehler,Dashboard}.tsx`).
- Holen von Table-/Form-Configs und Tabelleninhalte rechnet jetzt sauber mit `.data`, sodass `DataTable`/`DynamicForm` stets `Record<string, unknown>`-kompatible Daten sehen.

### [06:15] - Config - Dokumenten-Formular
- `forms/dokument.form.toml` liefert einen Upload/Edit-Dialog für `dokument` inklusive Zuordnungen, Dateinamen, Format, Größe und readonly-Metadaten, so dass `/api/config/form/dokument` wieder vorhanden ist und die Tabellen/Views keine 500er mehr erzeugen (`config/forms/dokument.form.toml`).

### [05:51] - UI - Statusbar
- Branding und Versionsnummer der Statusleiste stammen nun aus `config/app.config.toml` (`app.owner.name`, `app.version`), damit der mittige Hinweis komplett config-driven bleibt (`src/client/components/layout/StatusBar.tsx`).

### [05:48] - Bugfix - API-Routing
- Konfigurations-, Dashboard- und Export-Endpunkte (`/api/config/*`, `/api/dashboard/summary`, `/api/export/steuerberater`) sowie die `/api/entities`-Liste werden jetzt vor den generischen Entity-Routen registriert, damit sie nicht mehr von `entityRoutes` mit `/:entity/:id` abgefangen werden.

### [04:45] - Feature - Phase 6: Mobile & Polish
- `/mobile/dashboard` liefert eine Read-Only-Übersicht (Summary, Erinnerungen, offene Rechnungen) über `mobileRoutes`, den neuen `mobile.service` und das `MobileSnapshot`-Payload.
- `mobileReadOnlyMiddleware` blockiert alle Schreibzugriffe auf `/mobile`, während `MobileDashboardPage` mit `useMobileSnapshot` eine Touch-optimierte Seite liefert.
- Tests (`tests/unit/mobile.service.test.ts`) sowie AGENTS, BAUPLAN und `.claude/validation.md` dokumentieren den Status von Phase 6 und brandneue Mobile-Entscheidungen.

### [04:02] - Feature - Phase 5: Dashboard, Dokumente & PDF
- Dashboard liefert jetzt echte Zähler (Objekte, Einheiten, Verträge, offene Rechnungen, Dokumente, Erinnerungen) aus `/dashboard/summary`.
- Dokumente-Ansicht ermöglicht Upload/Preview, nutzt die neue `documents.table`/`document.form` und greift auf `Steuerberater-Export` zurück.
- PDF-Service (`/api/export/steuerberater`) erstellt einen PDF-Report basierend auf der Dashboard-Zusammenfassung.

### [03:41] - Feature - Phase 4: Nebenkosten & Ablesungen
- `ZaehlerPage` liefert jetzt Ablesungen mit Verbrauchsvergleich plus `zaehlerstand`-Formular für neue Messwerte.
- `NebenkostenPage` (Route `/nebenkosten`) bietet Rechnungs-Tab mit Konfigurations-Formen und Abrechnungs-Tab inklusive Share-Rechner basierend auf Umlageschlüsseln.
- Neue Forms/Tables für `rechnung`, `nebenkostenabrechnung`, `zaehlerstand` sowie API-Katalog für Umlageschlüssel und `config/forms/zaehler` ergänzen den Config-Stack.

### [03:29] - Feature - Phase 4: Nebenkosten (Zähler)
- `ZaehlerPage` (Route `/nebenkosten/zaehler`) zeigt config-gesteuerte Tabelle mit Action-Buttons.
- Zähler-Formular (`config/forms/zaehler.form.toml`) ermöglicht Zuordnung, Typ, Messeinheit + Notizen.

### [03:17] - Feature - Phase 3: Verträge + Finanzen
- Verträge- und Finanzen-Bereiche mit config-gesteuerter Liste/Form (Routes `/vertraege`, `/finanzen`) ergänzt.
- Neue Form-Configs (`kaution.form`, `zahlung.form`, `sollstellung.form`) sowie Tabellen-Configs für Kautionen erlauben standardisierte Dialoge und Übersichten.
- Dokumentation erweitert (`AGENTS.md`) und `vitest.config.ts` + Tests sichern die Config‑Ladepflicht.
- Shared Logger (`src/server/utils/logger.ts`) verhindert `no-console`-Warnungen bei Start/Schema-Init.

### [02:16] - Feature - Phase 2: Frontend-Grundgerüst + generische Komponenten
- API-Service: Fetch-Wrapper für Backend-Kommunikation
- TanStack Query Hooks: useConfig, useEntity, useTableConfig, useFormConfig
- DataTable: Generische Tabelle mit Sortierung, Pagination, Row-Actions
- DynamicForm: Config-gesteuertes Formular mit Validierung
- ObjektePage: 100% Config-Driven (lädt Table/Form/Entity-Config aus API)
- Sidebar: Navigation dynamisch aus TOML-Config geladen
- Expandierbare Sub-Navigation für Finanzen/Nebenkosten
- API-Endpunkte: /api/config/table/:name, /api/config/form/:name

### [02:00] - Feature - Phase 1: Entity-System + CRUD
- Schema-Generator: TOML → SQL CREATE TABLE (14 Tabellen)
- Generischer Entity-Service mit CRUD-Operationen
- REST API: /api/:entity Routen (GET, POST, PUT, DELETE)
- Validierung gegen Entity-Config (required, type, min/max, enum)
- DB-Schema automatische Initialisierung beim Server-Start

### [01:45] - Setup - AI-Dokumentationsstruktur finalisiert
- CLAUDE.md (Root) + .claude/CLAUDE.md (User) erstellt
- CODEX.md (Root) + .codex/CODEX.md (User) erstellt
- Änderungs-Workflow dokumentiert (Ändern → Testen → Dokumentieren → Commit)
- User-spezifische Dateien zu .gitignore hinzugefügt

### [01:14] - Setup - Phase 0 abgeschlossen
- Projektstruktur angelegt
- Build-Config (TypeScript, Vite, ESLint, Prettier, Tailwind)
- TOML-Konfigurationen (37 Dateien)
- Express-Server mit Config-API
- React-Grundgerüst (AppShell, Sidebar, StatusBar, Dashboard)
- AI-Dokumentationsstruktur (.ai/, .codex/, .claude/)

### [00:50] - Planung - BAUPLAN erweitert
- Abschnitt 3 "AI-Dokumentationsstruktur" hinzugefügt
- Trennung: .ai/ (Shared Truth) → .codex/ (Implementierung) / .claude/ (Analyse)

---

## Nächste Schritte

- [x] Phase 1: Entity-System + CRUD
- [x] Phase 2: Frontend-Grundgerüst + generische Komponenten
- [ ] Phase 3: Erweiterte Views (Mieter, Verträge, Finanzen)
- [ ] Phase 4: Nebenkosten-Abrechnung
- [ ] Phase 5: Dokumente + PDF-Generation
