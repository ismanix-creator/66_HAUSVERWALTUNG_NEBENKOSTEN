# Changelog - Mietverwaltung

Alle wichtigen Änderungen werden hier dokumentiert.

Format: `[YYYY-MM-DD HH:MM] - Kategorie - Beschreibung`

---

## 2025-12-16

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
- [ ] Phase 2: Frontend-Grundgerüst + generische Komponenten
