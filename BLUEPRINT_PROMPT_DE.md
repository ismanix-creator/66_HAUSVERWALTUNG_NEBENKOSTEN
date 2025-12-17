# BLUEPRINT PROMPT (DE) – Mietverwaltung

Ziel: Einen vollständigen, config-driven Blueprint für die Mietverwaltung erzeugen, der direkt auf `config/config.toml` und die importierten TOML-Dateien aufsetzt. Fokus: PC-First (CRUD), Mobile Read-Only, keine Cloud-Abhängigkeit, SQLite lokal, alle Regeln in TOML.

## Eingaben (Pflicht)
- `config/config.toml` + alle Imports (Navigation, Entities, Views, Forms, Tables, Catalogs, Labels).
- `planning/BAUPLAN_MIETVERWALTUNG.md` (Phasen, Akzeptanzkriterien, Risiken).
- `.ai/rules.md`, `.ai/architecture.md`, `.ai/conventions.md` (Regeln, Architektur, Naming).
- `AGENTS.md`, `CHANGELOG.md` (Prozesse, letzte Änderungen).
- `wireframe.md` (Struktur der UI, PC/Mobile).

## Output-Struktur (Blueprint)
1. **Zielbild & Scope** – Kurzbeschreibung, Ausschlüsse, PC-First + Mobile-Read-Only.
2. **Architektur** – Stack, Ports, Datenfluss, Sicherheits- und Backup-Strategie.
3. **Config-Driven Artefakte** – Navigation, Entities, Views, Forms, Tables, Catalogs, Labels inkl. Pfade.
4. **View- und Interaktionsmodell** – Hauptseiten (Dashboard, Objekte, Mieter, Verträge, Finanzen, Nebenkosten, Dokumente, Einstellungen, Mobile), Navigation/Tabs, Aktionspunkte.
5. **Daten & Validierung** – Schema-Generierung aus TOML, Validierungsregeln, Migration/Backup-Strategie.
6. **Risiken & Gegenmaßnahmen** – Technik, Betrieb, Fachlichkeit.
7. **Phasenplan + Akzeptanzkriterien** – Phasen 1–6 wie im Bauplan, jeweils Done-Kriterien.
8. **Handover-Checkliste** – Welche Artefakte für Designer, Frontend, Backend, Tester bereitstehen müssen (insb. `config.toml`, Wireframe, Akzeptanzkriterien).

## Leitplanken
- KISS/DRY/YAGNI + SOLID anwenden; keine Hardcodings, alles aus TOML lesbar.
- `config/config.toml` ist Single Source of Truth; Blueprint referenziert Pfade statt Inhalte zu duplizieren.
- PC-First: volle CRUD-Funktionalität auf Desktop; Mobile nur GET unter `/mobile/...`.
- SQLite lokal mit WAL + Backups (`data/`); keine externen Abhängigkeiten.
- Wireframe ist bindend für Struktur; Designer darf nur konsistent verfeinern.

## Abnahme
Ein Blueprint ist vollständig, wenn alle Output-Punkte abgedeckt, gegen `config/config.toml` geprüft und die Akzeptanzkriterien/Phasen aus dem Bauplan referenziert sind. Jede Änderung wird in `AGENTS.md`, `CHANGELOG.md` und `planning/BAUPLAN_MIETVERWALTUNG.md` dokumentiert.
