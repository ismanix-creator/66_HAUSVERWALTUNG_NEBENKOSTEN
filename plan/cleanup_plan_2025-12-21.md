# Projekt-Cleanup Plan — 2025-12-21

Ziel: Vollständiges, sicheres Aufräumen des Repositories; entferne veraltete, doppelte und redundante Dateien/Definitionen, behalte vollständige Rückverfolgbarkeit und Testsicherheit.

Kurzfassung
- Scope: gesamtes Repository inkl. `.vscode`, `config/`, `src/`, `scripts/`, `docs/`, `package.json`-scripts.
- Ergebnis: Inventarliste, priorisierte Lösch-/Archivierungs‑Pläne, safety/backups, PR-fähige Implementierungs-Schritte, Tests und Abschlussbericht.

Ausgeschlossene Pfade
- Folgende Ordner sind ausdrücklich von der Analyse und allen Lösch-/Archivierungs‑Vorschlägen ausgeschlossen: `.vscode`, `.claude`, `.codex`, `.github`, `.ai`, `.kilocode`.

Dokumentation: Nur Referenz, nicht ändern
- Projekt-Dokumentation (z. B. `README.md`, `AGENTS.md`, `docs/`, `wireframe.md`, `CHANGELOG.md`) darf ausschließlich als Informationsquelle verwendet werden, um das gewünschte Projektverhalten zu verstehen. Diese Dateien werden in diesem Cleanup‑Durchlauf nicht verändert; Änderungen an der Dokumentation sind separat zu planen und werden nur nach ausdrücklicher Freigabe vorgenommen.

Vorgehen (High-Level)
1. Vollständiger automatischer Repo-Scan (Dateien, Zeiten, Größen, letzter Commit).
2. Dokumenten- und Quell-Review (.vscode, README, AGENTS.md, config/config.toml, root config.toml, package.json, scripts).
3. Identifikation von Duplikaten und widersprüchlichen Implementationen (z.B. mehrere Config-Services).
4. Priorisierung: low-risk → safe delete; medium → archive + tests; high-risk → refactor PRs.
5. Umsetzung in kleinen PRs mit Backup, Tests und PM_STATUS.md Einträgen.

Konkrete Prüfungen & Befehle (Ausgangspunkt)
- Liste aller Dateien, Größe, letztes Änderungsdatum

```bash
git ls-files --stage > plan/inventory/git-index.txt
find . -type f -printf "%TY-%Tm-%Td %TT %p %kKB\n" | sort -r > plan/inventory/fs-list.txt
```

- Schnellprüfung auf doppelte Dateinamen / ähnliche Inhalte

```bash
rg "class .*Config|configLoader|loadConfig|shared/config" -n || true
rg "TODO|FIXME|DEPRECATED|ARCHIVE" -S || true
```

- Tests und Lint (Vorbedingung für Änderungen)

```bash
npm ci
npm test
npm run build --if-present
```

Bereiche mit besonderer Aufmerksamkeit
- `.vscode`: launch/tasks/settings können project-spezifische oder user-specific Einträge enthalten — vereinheitlichen oder entfernen.
- `config.toml` (root) vs `config/config.toml`: Quelle der Wahrheit klären, Generierungs-Skripte prüfen (`scripts/copy-config.js`, `scripts/*`).
- `src/*/services` und `shared/config`: Doppelimplementationen (zwei Config-Services) auflisten, Verantwortlichkeiten definieren.
- `docs/`, `README.md`, `AGENTS.md`, `wireframe.md`: Konsistente Aussagen zu Scripts/Startanweisungen prüfen.
- `scripts/` und `package.json`-scripts: ungenutzte Skripte markieren.

Inventar & Entscheidungslogik
- Jede Datei bekommt ein Status-Tag: keep | archive | delete | review-required.
- Regeln:
  - `delete` nur wenn: unreferenziert (kein Import), alt (letzte Änderung > 2 Jahre) und kein Tests-Fail-Risiko.
  - `archive` wenn: unsicher, aber vermutlich ungenutzt — verschiebe nach `backups/archive/<timestamp>/`.
  - `review-required` wenn: potenziell Breaking-Change (config, migration scripts, DB schema).

Workflow für jede Änderung (PR-Template)
1. Erstelle Branch `feature/cleanup/<area>-yyyyMMdd`.
2. Backup: exportiere DB und archiviere Dateien nach `backups/archive/<timestamp>/`.
   ```bash
   sqlite3 data/database.sqlite ".backup backups/db-backup-$(date -u +'%Y%m%dT%H%M%SZ').sqlite"
   mkdir -p backups/archive/$(date -u +'%Y%m%dT%H%M%SZ')
   git mv <file> backups/archive/$(date -u +'%Y%m%dT%H%M%SZ')/ || cp -a <file> backups/archive/$(date -u +'%Y%m%dT%H%M%SZ')/
   ```
3. Änderungen schrittweise: zuerst Inventar-PR (nur list files & proposal), danach kleine remove/refactor PRs.
4. Testausführung: `npm test` + smoke run `npm run start:server` (falls vorhanden).
5. PM_STATUS.md Append: JSON-Block mit ISO-Zeitstempel, Agentenname `project-manager` und Ergebnis.

Reporting
- Für jeden PR: Kurz-Report (Änderungen, Tests, Risiko, Rollback-Anweisungen).
- Abschluß-Report: Liste gelöschter/archivierter Dateien, Zeitstempel und PR-Links.

Priorisierte Checkliste (erste Iteration)
1. Vollständiger Scan & Inventar erzeugen (machine-readable files unter `plan/inventory/`).
2. `.vscode` prüfen & vereinheitlichen (falls nötig entfernen).
3. Konfigurationsquellen klar definieren (single source of truth).
4. Config-Service Duplikate: Analyse und Konsolidierungsplan.
5. Dokumentation: README & AGENTS.md Updates proposal.
6. Entfernen/Archivieren low-risk Dateien (Backup + PR).
7. Refactor für high-risk Änderungen mit kleinen PRs.
8. Final tests + release notes + PM_STATUS.md Eintrag.

Risiko- und Rollback-Strategie
- Behalte Backups (DB + Files) vor jeder Änderung.
- Jeder PR muss eine Revert-Anweisung enthalten (git revert <commit> oder restore from backups).

Deliverables (was ich für dich erstelle)
- `plan/inventory/` CSV/Text Dateien mit vollständigem Dateibaum und Metadaten.
- `plan/cleanup_plan_YYYY-MM-DD.md` (dieses Dokument als Basisversion).
- `plan/cleanup_proposals/` mit konkreten PR-Proposals (Liste der zu löschenden/zu archivierenden Dateien pro PR).
- Abschluss-Report `plan/cleanup_report_YYYY-MM-DD.md`.

Zeitplan (Vorschlag)
- Tag 0–1: Vollständiger Scan & Inventar (automatisiert).
- Tag 2: Detaillierte Review von Config & Services (1 Person, 1 Tag).
- Tag 3–5: Implementierung erster low-risk removals (2–3 PRs).
- Darauf folgend: schrittweise Refactors, bis abgeschlossen.

Nächste Schritte (wenn du freigibst)
1. Ich erzeuge das Inventar (`plan/inventory/`) automatisiert und lege es hier ab.
2. Du prüfst Prioritäten (z.B. config first oder .vscode first).
3. Ich erstelle die ersten PR-Proposals (nur Listings), die du freigibst.

Kontakt & Hinweise
- Änderungen niemals ad-hoc mergen; immer PR mit Tests.
- Bei Unsicherheit: archive statt delete.

— Ende —
