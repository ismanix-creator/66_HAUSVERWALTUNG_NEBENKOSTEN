# Erste Review: Duplikate & auffällige Redundanzen

Datum: 2025-12-21

Gefundene Auffälligkeiten (erste, nicht-invasive Analyse):

- Konfigurations‑Implementierungen
  - `src/server/services/config-loader.service.ts`
  - `src/server/services/config.service.ts`
  - `src/shared/config/index.ts` (+ `schemas.ts`)
  - `config.toml` (root) und `config/config.toml` (Konfig-Ordner) — mögliche Mehrfachquelle
  -> Problem: Mehrere Config‑Services + mehrere Konfigurationsdateien erzeugen Verwirrung. Empfehlung: Single Source of Truth definieren und einen Konsolidierungs-PR planen.

- Tests referenzieren Loader
  - `tests/unit/config-loader.service.test.ts` verwendet offenbar `config-loader.service`.
  -> Risiko: Entfernen des Loaders kann Tests brechen; zuerst Tests anpassen/umleiten.

- Scripts & Generierungs-Hinweise
  - `scripts/copy-config.js` existiert; deutet auf Konfigurationskopien/-generierung hin.
  -> Empfehlung: Prüfe, welche Datei als finale Runtime-Konfiguration gelten soll (root `config.toml` vs `config/config.toml`).

- Dokumentation (nur Referenz)
  - `README.md`, `AGENTS.md`, `wireframe.md`, `CLAUDE.md` etc. enthalten Hinweise, dürfen aber nicht verändert werden in diesem Durchlauf.

- Sonstige auffällige Bereiche
  - `src/client/hooks/useConfig.ts` vs `src/shared/config`: Doppelung von Konfigurationszugriff im Client/Shared-Bereich prüfen.
  - `tmp/build_logs/*` enthält Build-Artefakte (sicher archivieren oder ignorieren).
  - `plan/` enthält bereits Plan-Dateien; behalten.

Erste Priorisierungsvorschläge
1. Config‑Konsolidierung (hoch): Kläre Single Source of Truth; erst Inventar-PR, dann Refactor-PRs.
2. Tests (hoch): Stelle sicher, dass Tests die neue Struktur nutzen; passe `config-loader`-Tests an.
3. Scripts (mittel): Prüfe `scripts/copy-config.js` und ähnliche — entweder dokumentieren oder archivieren.
4. tmp/build_logs (niedrig): Archivieren oder .gitignore prüfen.

Konkrete nächste Schritte (nicht-invasiv)
1. Automatische Referenzsuche: Wo werden `config-loader.service` und `config.service` importiert? (static grep/tsc)
2. Liste aller Dateien erzeugen (bereit in `fs-list-trimmed.txt`).
3. Erstelle einen Konsolidierungs-Vorschlag (PR-Proposal): welche Dateien bleiben, welche archiviert, welche umgezogen.

Hinweis: Dies ist eine initiale, konservative Review — keine Dateien verändert. Für tiefergehende Aussagen führe ich eine Import-Analyse (usage grep) und Änderungsimpact-Analyse durch.
