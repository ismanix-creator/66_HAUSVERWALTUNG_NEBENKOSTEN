# Changelog - Mietverwaltung

Alle wichtigen Änderungen werden hier dokumentiert.

Format: `[YYYY-MM-DD HH:MM] - Kategorie - Beschreibung`

---

## 2025-12-16

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
