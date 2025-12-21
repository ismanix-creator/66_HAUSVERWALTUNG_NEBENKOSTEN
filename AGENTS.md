# Agenten-Katalog (projekteingepasst)

Dieses Dokument fasst die in diesem Repository anzuwendenden Agenten‑Beschreibungen zusammen und wurde speziell auf die tatsächliche Struktur dieses Projekts angepasst.
Ziel: keine Annahmen, keine Referenzen auf nicht existente Tools/Ordner (z. B. pnpm/generische .vscode-Policies) – stattdessen reale Skripte und Pfade verwenden.

Wichtiges Projektkontext (Quelle): package.json, config/config.toml, scripts/, src/, tests/, docs/

Grundregeln (Guardrails projekt-spezifisch):
- Schreiben nur im Projekt‑Root (`./`) und in projekt‑internen Unterordnern (z. B. ./docs, ./plan, ./accessibility). Keine Änderungen außerhalb.
- `config/config.toml` ist Single Source of Truth für Laufzeit-/UI-Definitionen; Agenten lesen es bevorzugt.
- Statusmeldungen erfolgen über `PM_STATUS.md` (JSON-Block, letzter Eintrag gilt).
- Systemzeit-Verifikation: Vor Änderungen an CHANGELOG.md oder Commits ist die Systemzeit zu prüfen:
  date '+%Y-%m-%d %H:%M:%S UTC'
  Commit‑/Changelog‑Einträge müssen die verifizierte Zeit im Text angeben (siehe Release-Agent).
- Scripts: Nutze vorhandene npm-scripts aus package.json (z. B. npm run dev, npm run build, npm test, npm run start:server).

Format für PM_STATUS.md (alle Agenten):

## <ISO-Zeitstempel> – <Agentenname>
```json
{
  "agent": "<Agentenname>",
  "ziel": "<kurze Zielbeschreibung>",
  "geändert": ["<Datei1>", "<Datei2>"],
  "ergebnis": "OK" | "BLOCKIERT",
  "blocker": "<falls vorhanden>",
  "next_suggestion": "<Agent> – <kurzer Auftrag>",
  "notes": "<optionale kurze Notiz>"
}
```

Hinweis: PM_STATUS.md wird nur angehängt; Agenten lesen den letzten JSON-Block zur Orchestrierung.

---

Agenten (auf dieses Projekt zugeschnitten)

1) project-manager
- Rolle: Orchestriert Agentenläufe, prüft Pflichtdokumente und priorisiert Arbeitsschritte.
- Inputs: PM_STATUS.md (letzter JSON-Block), geänderte Dateien, config/config.toml, README.md, CHANGELOG.md.
- Aufgaben: Status zusammenfassen, fehlende Pflichtdokumente benennen, Agenten-Auswahl anbieten, Wireframe nur falls notwendig in wireframe.md schreiben.
- Guardrails: Keine externen Annahmen, deutsch, KISS.

2) config-consistency
- Rolle: Prüft, dass config/config.toml zum laufenden Code passt und dokumentiert Abweichungen.
- Inputs: config/config.toml, generierte Konfig‑Artefakte falls vorhanden (z. B. src/config/generated), docs/ (z. B. CONFIG_REFERENCE.md wenn vorhanden), Scripts in scripts/.
- Aufgaben:
  * Prüfen, ob `config/config.toml` valide ist und mit dem aktuellen Code benutzt wird.
  * Falls Projekt-spezifische Generations-Skripte existieren, diese mittels npm/run‑Skript ausführen; sonst nur Lesekonsistenz prüfen.
  * Dokumentiere Abweichungen als ./docs/config_consistency_<timestamp>.md und ggf. TODO in TODO.md.
- Implementationstipp: Verwende vorhandene npm-Skripte (package.json) oder node scripts/*; vermeide PNPM-only Befehle.

3) documentation-agent
- Rolle: Prüft und aktualisiert Projektdokumentation minimal und inkrementell.
- Inputs: geänderte Dateien seit letztem Lauf, README.md, AGENTS.md, CHANGELOG.md, config/config.toml.
- Aufgaben: Korrigiere nur eindeutig ableitbare Fakten (z. B. npm scripts, Ordnernamen). Melde Unsicherheiten als Blocker.
- Outputs: geänderte Doku-Dateien und PM_STATUS.md Eintrag.

4) dependencies-agent
- Rolle: Erfasst Abhängigkeiten und schlägt Updates vor (kein Sicherheits-Audit).
- Inputs: package.json, package-lock.json.
- Aufgaben: npm outdated (oder lokale Überprüfung), Liste mit Vorschlägen in ./dependencies/update_plan_<timestamp>.md, Lizenzhinweise aus LICENSE prüfen.
- Guardrail: Keine automatische Aktualisierung ohne menschliche Freigabe.

5) release-agent
- Rolle: Release- und Changelog‑Koordinator (nur nach grünen Tests).
- Vorbedingungen: `npm test` muss grün laufen; Remote (git) erreichbar wenn Commit/Synchronisation nötig.
- Aufgaben:
  * Systemzeit verifizieren (date '+%Y-%m-%d %H:%M:%S UTC') und Zeit in Changelog/Commit-Message dokumentieren.
  * Tests ausführen (`npm test`).
  * CHANGELOG.md oben ergänzen im Format: "### [YYYY-MM-DD HH:MM] - <Typ> - Beschreibung" mit verifizierter Zeit.
  * Optional: Commit & Push, nur wenn Projektstandard dies verlangt und Remote konfiguriert ist.
- Guardrail: Stoppen bei fehlendem Remote oder fehlschlagenden Tests.

6) tester-agent
- Rolle: Führt vorhandene Tests aus (vitest) und validiert Akzeptanzkriterien.
- Aufgaben: `npm test`, kurze Testzusammenfassung als ./tests/report_<timestamp>.md, Blocker melden in PM_STATUS.md.

7) deployment-agent
- Rolle: Beschreibt Deploy‑Abläufe basierend auf vorhandenen Skripten (z. B. npm run start:server, build steps).
- Inputs: package.json scripts, scripts/, config/config.toml (server.host/port).
- Aufgaben: Erstelle ./deploy/deploy_plan_<timestamp>.md mit konkreten Schritten (build, copy config, start service) und Rollback-Hinweisen.
- Hinweis: Agenten implementieren keine Infrastruktur (kein Terraform/Ansible automatisch erzeugen).

8) frontend-developer (projekt-spezifisch)
- Rolle: Implementiert Änderungen in der Client‑Codebasis (Vite + React). In diesem Projekt liegt Client-Code primär in src/ (React + Vite).
- Inputs: config/config.toml für UI-Definitions, geänderte UI-Komponenten in src/.
- Guardrails: Keine Annahmen; nur implementieren was die Doku vorgibt.

9) backend-developer (projekt-spezifisch)
- Rolle: Implementiert/ändert Server-Logik (Express, better-sqlite3) unter src/ bzw. dist/server nach Build.
- Inputs: config/config.toml (server/database settings), scripts/ für DB-Migrationen.
- Guardrails: Keine externen DBs ohne Absprache; lokale migrations unter scripts/ nutzen.

10) accessibility-agent
- Rolle: Prüft Accessibility-Aspekte auf Codebasis/Views; erstellt Report in ./accessibility/a11y_report_<timestamp>.md.
- Inputs: Views/Forms in config/config.toml, src/ (React Komponenten), public assets.
- Aufgaben: Baseline-Checks (alt-Texte, keyboard focus, color contrast Hinweise), keine UI-Implementierung.

Nicht angewandte/entfernte Punkte aus der Originaldatei
- Entfernt wurden Referenzen auf pnpm-only Skripte, generische .vscode-Policies und mehrfach duplizierte Agentenblöcke.
- Falls spezielle Agent-Prompts unter .github/agents/ existieren, sind sie weiterhin referenzierbar; AGENTS.md ist die zentrale, konsolidierte Referenz.

Änderungshistorie dieser Datei
- Diese Version wurde erstellt, um AGENTS.md 1:1 an die vorhandene Repo-Struktur anzupassen (package.json, config/config.toml, scripts/).

---

Kurz: AGENTS.md jetzt präzise, nicht redundant und auf reale Dateien/Skripte dieses Repos ausgerichtet. Agenten, die externe Tools/Ordner voraussetzen, wurden angepasst oder als optional markiert.
