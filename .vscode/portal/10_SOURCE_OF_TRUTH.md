# 10_SOURCE_OF_TRUTH – Verantwortlichkeiten & Dateien

Diese Seite ordnet jede zentrale Projektdatei bzw. -sammlung einer klaren Verantwortung zu und zeigt, wie sie sich zur Config-First-Strategie (`config/config.toml`) verhält. Sie fasst nur Informationen aus der vorhandenen Dokumentation zusammen; die Originale bleiben unverändert.

## Konfigurations-Zentrum

- `config/config.toml` – Single Source of Truth für Entities, Forms, Tables, Views, Navigation, Labels, Catalogs, App-Settings. Alle Änderungen an Business-Logik, Labels, Tabellenbreiten oder Validierungen müssen hier beginnen (vgl. `README.md`, `.ai/rules.md`, `.ai/architecture.md`, `.codex/CODEX.md`).
- `./config.toml` – Root-Stub zur Erfüllung der Pflichtdokumente im Projekt-Root (nicht produktiv genutzt, sondern reines Referenz-Etikett).

## Projektleitlinien & Guardrails

- `AGENTS.md` – Projektweite Guardrails, Agentenrollen, Systemzeit-Regel für CHANGELOG/Commits, Pflichtdokumente (`README`, `BLUEPRINT_PROMPT_DE`, `wireframe`, `.ai`/.codex/.claude). Definiert, dass nur der letzte JSON-Block in `PM_STATUS.md` zählt und dass Agenten keine Annahmen treffen dürfen.
- `.ai/rules.md`, `.ai/architecture.md`, `.ai/conventions.md`, `.ai/glossary.md` – Bodenregeln für Config-Driven Logik, Architektur-Vorgaben, Naming-Konventionen, Glossarbegriffe (Quelle für vielerlei Regeln in `.kilocode/rules/`).
- `.claude/CLAUDE.md`, `.codex/CODEX.md`, `.claude/system.md`, `.claude/review.md`, `.claude/planning.md`, `.claude/hooks/*` – Analyse-, Review- und Planungsvorgaben plus Hooks (Versioning, Validierung), die das Verhalten sämtlicher Agenten/Workflows steuern.
- `.github/agents/` – Detaillierte Rollenbeschreibungen; der Projektmanager liest nur den letzten JSON-Part aus `PM_STATUS.md` und steuert den Ablauf (siehe `project-manager.agent.md`, `workflow.agent.md`).

## Dokumentations- & Status-Spannung

- `README.md` – Projektüberblick, Leitplanken (Config-First, Mobile Read-Only), Schnellstart und Strukturübersicht.
- `CLAUDE.md` / `CODEX.md` (Root) – Architekturbeschreibung, Config-Driven-Definition, API-Endpunkte, Befehle, Ports, Workflow-Schritte für jede Dateiänderung sowie der Hinweis, dass `PM_STATUS.md` die Steuerlogdatei ist.
- `PM_STATUS.md` – JSON-Log; nur der letzte Block bestimmt den nächsten Schritt; beinhaltet Ziel, geänderte Dateien, Ergebnis, Blocker, nächste Empfehlung, Notizen (für den Project Manager zentral).
- `CHANGELOG.md` & `CHANGELOG_ARCHIVE.md` – Änderungsverlauf; Format `[YYYY-MM-DD HH:MM]` mit verifizierter Systemzeit (per `date '+%Y-%m-%d %H:%M:%S UTC'` prüfen).
- `planning/BAUPLAN_MIETVERWALTUNG.md` & `BLUEPRINT_PROMPT_DE.md` – Baupläne, Phasen, Akzeptanzkriterien für Features; müssen config- und doc-consistent bleiben.

## Support-Strukturen

- `.kilocode/README.md` – Einstiegspunkt für die `.kilocode`-Doku (Versionierung, Zweck, Struktur, Arbeitsweise).  
- `.kilocode/portal/00_START_HERE.md` – Pflichtlektüre-Gate für neue Agenten (Reihenfolge, Gates, Systemzeit-Regel).  
- `.kilocode/rules/` – Regeldateien (z. B. `00_INDEX.md`, `10_WORKFLOW.md`, `20_CONFIG_DRIVEN.md` etc.) übernehmen präzise Formulierungen der Regeln aus `.ai/` und `.claude/` ohne neue Inhalte zu generieren.
- `.kilocode/index/FILES.md` & `.kilocode/index/TREE.txt` – Dateiübersicht zur Navigation durch das Projekt (steht noch zur Fertigstellung).

## Systemzeit‑Verifikation (Pflicht)

- Vor jedem Changelog‑Eintrag oder Commit, der `CHANGELOG.md` oder Releases betrifft, ist die Systemzeit zu verifizieren. Verwende dazu das folgende Kommando und dokumentiere die zurückgegebene UTC‑Zeit in der Commit‑Message bzw. im Changelog‑Eintrag:

```bash
date '+%Y-%m-%d %H:%M:%S UTC'
# Beispiel Output: 2025-12-19 22:17:38 UTC
```

- Commit‑Message‑Template (Beispiel, Systemzeit einfügen):

```
fix: Beschreibung

Systemzeit verifiziert: 2025-12-19 22:17 UTC (per 'date' Befehl)

Details...

🤖 Generated with [Claude Code]...
```

Diese Anweisung ist bindend für alle Agenten, die `CHANGELOG.md` oder Commit‑Einträge erzeugen oder automatisiert schreiben.

## Fazit

Die `.kilocode`-Portalstruktur kapselt die bestehende Dokumentation vollständig: `README`, `CLAUDE`, `CODEX`, `.ai/`, `.claude/`, `.codex/`, `AGENTS`, `PM_STATUS`, `CHANGELOG`, `planning`, `wireframe` usw. bleiben weiterhin die Originalquellen. Was wir hier einbauen, ist lediglich eine neue Ordnung: jede Datei in `.kilocode` fasst bestimmte Pflicht-Infos zusammen, verlinkt klar auf die maßgeblichen Quellen und bleibt im Rahmen der Config-First/Syszeit-Regeln.

Datei `portal/10_SOURCE_OF_TRUTH.md` vollständig erstellt.
