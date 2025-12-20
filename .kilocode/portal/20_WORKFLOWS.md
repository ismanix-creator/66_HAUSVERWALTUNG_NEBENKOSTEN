# 20_WORKFLOWS – Change- und Release-Workflow

**Quellen:** `CODEX.md`, `CLAUDE.md`, `.codex/workflows/implement.md`, `.codex/workflows/refactor.md`, `.github/agents/workflow.agent.md`, `AGENTS.md`

## 1. Phasenmodell (Workflow-Agent)

1. **Analyse:** Ziel und Umfang klären, Projektstatus prüfen (bestehend vs. neu).  
2. **Abgleich:** Pflichtdokumente (`README.md`, `BLUEPRINT_PROMPT_DE.md`, `AGENTS.md`, `config/config.toml`, `.ai/`, `.claude/`, `.codex/`, `wireframe.md`) und Guardrails abgleichen.  
3. **Planung:** Schritte zerlegen, jedem Agenten eine Verantwortlichkeit zuweisen, Abbruchbedingungen definieren.  
4. **Ausführung:** Agenten durchführen lassen, Eingaben sicherstellen, keine Annahmen treffen.  
5. **Validierung:** Änderungen prüfen (richtige Dateien, config-first, Tests, Docs).  
6. **Übergabe:** Status zusammenfassen, nächste Iteration planen oder abschließen.

*Hinweis:* Die Phasenfolge ist verbindlich; bei fehlenden Informationen oder Blockern unbedingt stoppen und Rückfragen stellen (`workflow.agent.md`).

## 2. Change-Workflow & Gates (Root CODEX/CLAUDE)

1. **Änderung durchführen** – Nur nach Gate-Dokumenten (Pflichttexte) und config-first-Prüfung.  
2. **Tests** – Typische Befehle: `npm run lint`, `npm run typecheck`, `npm test`, `npm run dev` (Seitennutzung), `npm run build`.  
3. **Hardcode-Check** – 0 % Hardcode, 100 % TOML-konfiguriert (siehe `.ai/rules.md`).  
4. **Dokumentation** – `.claude/`, `.codex/`, `.ai/` sowie `AGENTS.md`, `PM_STATUS.md`, `README.md`, `CHANGELOG.md` updaten.  
5. **CHANGELOG** – Eintrag mit verifizierter Systemzeit (`date '+%Y-%m-%d %H:%M:%S UTC'`), Format `[YYYY-MM-DD HH:MM]`.  
6. **Stage & Commit** – Git-Add, Commit-Message mit Systemzeitvermerk (`Systemzeit verifiziert: ... UTC`).  
7. **Workflow-Hooks** – Hooks in `.claude/hooks/` (z. B. Dokumenten-Update, Final-Changelog-Gate) müssen passieren.

## 3. Dokumentationskreislauf

- Systemzeit prüfen **vor** CHANGELOG- und Commit-Änderungen (`CLAUDE.md`, `.codex/CODEX.md` Regel).  
- Jede Änderung löst neue PM_STATUS-Einträge aus (`AGENTS.md`, `CLAUDE.md`).  
- `.codex/workflows/implement.md` beschreibt Schritt-für-Schritt: Planning → Implement → Test → Docs → Changelog → Commit.  
- `.codex/workflows/refactor.md` liefert ergänzende Hinweise für Refactoring (Tests, Backups, Release).  

## 4. Tests & Checks

- Standardbefehle: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run dev` (Integration).  
- Release-Gates verlangen grüne Tests bevor Changelog aktualisiert oder Commit erstellt wird.  
- `PM_STATUS.md` benutzt `next_suggestion`, um erwartete Tests oder Folgearbeiten zu signalisieren.

## 5. Commit & Release

- Commit-Message muss das Systemzeit-Statement enthalten (`Systemzeit verifiziert: ... UTC (per 'date' Befehl)`), wie in `.codex/CODEX.md` und `.claude/CLAUDE.md` beschrieben.  
- CHANGELOG-Eintrag oben anfügen, inklusive Timestamp, OS, Test-Kommando (Release-Agent).  
- Release-Agent (wenn aktiviert) führt Tests, Changelog, Commit und Push durch, danach Dokumentation abstimmen (siehe `.github/agents/release.agent.md`).

Datei `portal/20_WORKFLOWS.md` vollständig erstellt.
