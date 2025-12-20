# 00_START_HERE – Einstieg & Gates

Diese Datei ordnet die **Pflichtlektüre**, die **Gates** und den **Arbeitsrhythmus** für das Projekt, bevor Schreibzugriff oder Implementierung erfolgt. Sie fasst die zentralen Hinweise aus `README.md`, `CLAUDE.md`, `CODEX.md`, den Spezialdokumenten unter `.ai/`, `.claude/`, `.codex/` sowie den Agenten-Workflows (`.github/agents/workflow.agent.md`) zusammen.

## 1. Ziel & Gesamtbild

- Die Mietverwaltung ist **100 % config-driven** (siehe `README.md`, `CLAUDE.md`, `.ai/rules.md`): Business-Logik, Labels, Tabellen, Entities, Forms, Views, Navigation und Styling kommen aus `config/config.toml` und den Imports. Code bleibt generisch, Änderungen passieren vorrangig über TOML.
- Die zentrale Leitlinie ist **Config-First** (ESA: `README.md`, `CLAUDE.md`, `.codex/CODEX.md`). Vor jeder Codeänderung prüfen, ob die bestehende Konfiguration ausreicht; erst dann Code anpassen.
- `config/config.toml` ist der Single Source of Truth (siehe `.claude/CLAUDE.md`, `.codex/CODEX.md`); die Root-Stub `./config.toml` dient lediglich der Dokumentation.
- Alle Prozesse, Namen, Commit- und CHANGELOG-Regeln stammen aus `.claude/CLAUDE.md`, `.codex/CODEX.md` und den `.ai/`-Dokus; keine neuen Regeln erfinden.
- Keine Annahmen treffen; widersprüchliche Informationen sofort als **„Konflikt zur Klärung“** markieren und nicht weiterarbeiten (vgl. `.github/agents/workflow.agent.md`, globale Guardrails).

## 2. Pflichtlektüre (Reihenfolge)

1. **`.claude/CLAUDE.md`** – Benutzerpräferenzen, Sprache, Workflow-Vorbedingungen, Systemzeit-Verifikation vor CHANGELOG/Commits, Pfad- und Port-Gates.
2. **`.codex/CODEX.md`** – weitere Zugriffsbeschränkungen, Ports, Kommunikationsstil, Workflow-Präferenzen, Commitment zur Systemzeit-Regel.
3. **`CLAUDE.md` & `CODEX.md`** (Root) – Projektübersicht, config-driven Architektur, generische API/Services, Dokumentations- und Changelog-Gates, PM_STATUS-Statuslog. (`CODEX.md` beschreibt u. a. den Pflicht-Workflow nach jeder Dateiänderung.)
4. **`.ai/rules.md`, `.ai/architecture.md`, `.ai/conventions.md`, `.ai/glossary.md`** – alle harten Regeln, Architekturprinzipien, Namenskonventionen sowie relevantes Glossar; keine Inhalte duplizieren, sondern zusammenfassen oder referenzieren.
5. **`README.md`** – Schnellstart, Strukturüberblick, Hinweise zu Mobile Read-Only und Backup.
6. **`PM_STATUS.md`** – nur der letzte JSON-Block zählt; daraus ersieht man letzten Agenten, Ergebnis, Blocker und die Liste geänderter Dateien (siehe `CLAUDE.md`, `CODEX.md`). Interpretationen immer aus dem letzten Block ableiten.
7. **`wireframe.md`** – vorhandene Wireframes (PC, Mobile Read-Only) als strukturelles Referenzmodell für jede UI-Änderung.
8. **`.github/agents/workflow.agent.md`** – Phasenmodell (Analyse → Abgleich → Planung → Ausführung → Validierung → Übergabe) und globale Qualitäts-Gates.
9. **`.codex/workflows/implement.md` & `.codex/workflows/refactor.md`** – Umsetzungsschritte, Tests und Gate-Checks.
10. **`CHANGELOG_ARCHIVE.md` / `CHANGELOG.md`** – Format, Versionierung, Systemzeit-Regel; bei neuen Einträgen zuerst Zeit per `date '+%Y-%m-%d %H:%M:%S UTC'` prüfen (siehe `.claude/CLAUDE.md`, `.codex/CODEX.md`, `CLAUDE.md`).

> Hinweis: Diese Reihenfolge darf nicht übersprungen werden; ohne Kenntnis der obersten Quellen ist kein Schreiben zulässig.

## 3. Gates & Systemzeit

- **Systemzeit prüfen** mit `date '+%Y-%m-%d %H:%M:%S UTC'` **vor** jeder Änderung, die den CHANGELOG oder Commits betrifft (zentrale Regel in `.claude/CLAUDE.md`, `.codex/CODEX.md`, `CLAUDE.md`).
- **0 % Hardcode, 100 % TOML:** Felder, Label Keys, Validation, Tabellenbreiten etc. stammen aus `.ai/rules.md`; Code darf keine festen Strings enthalten (`CODEX.md`).
- **Mobile-Routen sind Read-Only** (siehe `.ai/rules.md`, `CLAUDE.md`).
- **Gates laut `.github/agents/workflow.agent.md`:** Dokumentation vor Implementierung, immer in der vorgegebenen Phase bleiben, bei Blockern sofort stoppen, keine Annahmen, immer den letzten JSON-Block in `PM_STATUS.md` respektieren.
- **PM_STATUS-Log:** Jeder Agent melding results as per `CLAUDE.md`, `CODEX.md`. Nur letzter JSON-Block gilt; `notes` und `next_suggestion` steuern den nächsten Schritt.

## 4. Bevor du schreibst

1. Lese die oben genannten Dokumente in der Reihenfolge.
2. Kläre Ziel und Umfang (Phase: Analyse).
3. Prüfe, dass `config/config.toml` die relevante Stelle enthält (Config-First).
4. Erstelle ggf. Fragen, wenn Infos fehlen; ohne Antwort **stoppen**.
5. Halte dich strikt an die Phasen: Analyse → Abgleich → Planung → Ausführung → Validierung → Übergabe (`.github/agents/workflow.agent.md`).
6. Dokumentiere jede Entscheidung (z. B. im PM_STATUS-Log im `notes`-Feld) – Kommunikation gemäß `.claude/CLAUDE.md`.
7. Beachte, dass `.ai/rules.md` und `.ai/architecture.md` die Regeln explizit aufzählen; du darfst sie nicht ändern, nur wiederverwenden.

## 5. Wie weiter?

- Änderungen starten mit Doku (Portal/Rules) → dann Designer/Frontend/Backend → Tests → Release → Dokumentations-Abgleich.
- Jede Phase endet mit einer Statusmeldung in `PM_STATUS.md`; nur wenn das Ergebnis `OK` ist, folgt der nächste Agent.
- Konflikte (z. B. widersprüchliche Angaben zwischen `CLAUDE.md` und `.ai/architecture.md`) werden explizit als **Konflikt zur Klärung** benannt und nicht aufgelöst (siehe `.github/agents/workflow.agent.md`).
- Alle Informationen bleiben in den Quellen; keine Inhalte entfernen oder neu erfinden.

## 6. Spezifische Projekteinstellungen

### Sprache & Kommunikation
- **Projektsprache:** Deutsch
- **Codesprache:** Englisch (Variablen, Funktionen)
- **UI-Texte:** Deutsch (aus TOML-Labels)
- **Kommentare:** Deutsch erlaubt
- **Kurze, prägnante Antworten**
- **Technische Details wenn relevant**
- **Keine Emojis (außer explizit gewünscht)**

### Code-Stil
- TypeScript strict mode
- Funktionale React-Komponenten
- Tailwind CSS für Styling
- Keine `any` Typen

### Workflow
- Config-First: Prüfe immer zuerst ob TOML-Änderung ausreicht
- Kleine Commits mit deutschen Commit-Messages
- TypeScript-Check vor jedem Commit

### Systemzeit-Verifikation (KRITISCH)
**REGEL:** Systemzeit IMMER prüfen, BEVOR CHANGELOG aktualisiert oder Commits erstellt werden!

```bash
# Systemzeit prüfen (vor CHANGELOG-Änderungen)
date '+%Y-%m-%d %H:%M:%S UTC'

# Output: 2025-12-19 22:17:38 UTC
```

**CHANGELOG Format:**
- `[YYYY-MM-DD HH:MM]` - Verifizierte Systemzeit (geprüft per `date` Befehl)
- `[YYYY-MM-DD XX:XX]` - Zeit unbekannt/ungeprüft (nur für alte Einträge)

**Commit-Message Format:**
```
fix: Beschreibung der Änderung

Systemzeit verifiziert: 2025-12-19 22:17 UTC (per 'date' Befehl)

Details...

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### Ports (fest zugewiesen)
| Service | Port | Hinweis |
|---------|------|---------|
| Vite | 5174 | Nicht 5173 (belegt durch 88_HIDEANDSEEK) |
| Express | 3002 | Backend-Server (konfigurierbar via `process.env.PORT`) |

### Pfad-Beschränkungen
```
ERLAUBT:
├── ./                    # Dieses Projekt
└── ../setup/             # Setup-Verzeichnis

VERBOTEN:
├── ../77_*               # Andere Projekte
├── ../88_*               # Andere Projekte
├── ../99_*               # Andere Projekte
└── ../databases/         # Zentrale Datenbanken
```

### Analyse & Review Fokus
Bei Code-Reviews prüfen:
1. **Gegen Config-Driven Regeln:**
   - Keine hardcodierten Strings für Labels
   - Keine hardcodierten Feldnamen
   - Validierung aus TOML
   - Keine Magic Numbers

2. **Gegen Code-Konventionen:**
   - TypeScript strict mode
   - Keine `any` verwendet
   - Naming-Konventionen befolgt

3. **Gegen Architektur:**
   - Kein Schreibzugriff in Mobile-Routen
   - SQLite-Transaktionen korrekt
   - Config-Service für TOML-Zugriff

### Visualisierung
- Mermaid-Diagramme für Architektur
- ASCII-Art für schnelle Übersichten
- Tabellen für strukturierte Daten

Datei `portal/00_START_HERE.md` vollständig erstellt.
