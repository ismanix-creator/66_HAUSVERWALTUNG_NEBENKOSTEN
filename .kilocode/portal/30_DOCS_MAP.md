# 30_DOCS_MAP – Themenlandkarte zu den Quellen

**Quellen:** `README.md`, `CLAUDE.md`, `CODEX.md`, `AGENTS.md`, `.ai/*`, `.claude/*`, `.codex/*`, `.github/agents/*`, `planning/BAUPLAN_MIETVERWALTUNG.md`, `BLUEPRINT_PROMPT_DE.md`, `wireframe.md`, `PM_STATUS.md`, `CHANGELOG.md`

## 1. Projektverständnis & Einstieg

- **“Was ist die Mietverwaltung?”** → `README.md` liefert Technologiestack, Config-First Prinzip, Mobile Read-Only sowie Schnellstart und Strukturübersicht.  
- **“Welche Ziele & Akzeptanzkriterien gelten?”** → `BLUEPRINT_PROMPT_DE.md` plus `planning/BAUPLAN_MIETVERWALTUNG.md` enthalten Funktionsziele, Phasen, Hooks und Hand-off-Punkte.  
- **“Wie liest man alle Regeln?”** → `.ai/rules.md`, `.ai/architecture.md`, `.ai/conventions.md`, `.ai/glossary.md`; `.kilocode/rules/` fasst sie präzise zusammen.

## 2. Guardrails & Prozesse

- **Projektrichtlinien / Agentenrollen** → `AGENTS.md` beschreibt Rollen, Systemzeit-Verifikation, Pflichtlektüre, Statuslog (`PM_STATUS.md`), No-Assumption-Policy.  
- **Workflow-Modell** → `.github/agents/workflow.agent.md` (Phasen + Gates) und `project-manager.agent.md`.  
- **Analyse/Review/Planning Guides** → `.claude/CLAUDE.md`, `.claude/system.md`, `.claude/planning.md`, `.claude/review.md`, `.claude/hooks/` (Dokumentations- und Finalisierungsgates).  
- **Implementierungs-Workflows** → `.codex/workflows/implement.md`, `.codex/workflows/refactor.md` (Tests, Docs, Changelog, Commit).  
- **Code-/Commit-Gates** → `.codex/CODEX.md`, `CLAUDE.md` (Systemzeit, Ports, 0%-Hardcode).

## 3. Konfiguration & Architektur

- **Single Source of Truth** → `config/config.toml` (Entities, Tables, Views, Labels, Catalogs) und `config/`-Imports (Labels, Catalogs, Validation).  
- **Configurierte UI & APIs** → `README.md`, `CLAUDE.md`, `CODEX.md` mit Technologie-Stack, REST-Pattern, Ports, generischer Config Loader (`src/server/services/config-loader.service.ts`).  
- **UI-Wireframes / Struktur** → `wireframe.md` zeigt PC-First + Mobile Read-Only Layouts für Seiten und Komponenten.

## 4. Weiterführende Referenzen

- **Änderungsverlauf** → `CHANGELOG.md`, `CHANGELOG_ARCHIVE.md` (Formatvorgabe `[YYYY-MM-DD HH:MM]`).  
- **Statuslog / Nächster Schritt** → `PM_STATUS.md` (letzter JSON-Block zählt, `next_suggestion` zeigt Folge-Agenten).  
- **Projektregeln** → `.kilocode/rules/` (Übersicht, kein Duplikat, klar und präzise).  
- **Komponenten & Services** → `src/client`, `src/server`, `src/shared` (strukturierte Implementierung, Config Loader, generic CRUD).

## 5. Wie man die Map nutzt

1. Wähle das Anliegen (z. B. neues Feature, Bugfix, Dokumentation).  
2. Folge dem Pfad in dieser Map zur relevanten Datei.  
3. Nutze die Quelle als Truth; `.kilocode` verweist darauf, ohne Inhalte zu entfernen.  
4. Achte auf die Systemzeit-, Config-First- und No-Assumption-Regeln, bevor du schreibst.

Datei `portal/30_DOCS_MAP.md` vollständig erstellt.
