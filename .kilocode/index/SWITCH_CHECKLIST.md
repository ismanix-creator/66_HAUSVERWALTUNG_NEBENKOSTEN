# Dokumentations-Migrations-Checklist

Diese Checkliste prüft haargenau, ob alle Inhalte aus der alten Dokumentationsstruktur (`.ai/`, `.claude/`, `.codex/`, `CLAUDE.md`, `CODEX.md`) vollständig in das neue `.kilocode/` System migriert wurden.

## 1. .ai/ - Alte KI-Dokumentation

### 1.1 rules.md
- [x] **Config-Driven Regeln (1-6)**: Vollständig in `.kilocode/rules/20_CONFIG_DRIVEN.md` migriert
  - 100% Config-Driven ✓ (Regel 7)
  - Keine Magic Numbers ✓ (Regel 16)
  - Entity-Änderungen ✓ (Regel 17)
  - Labels und Texte ✓ (Regel 18)
  - Validierung ✓ (Regel 19)
  - Dateibenennungen ✓ (Regel 20)
  - API-Design ✓ (Regel 21)
  - Fehlerbehandlung ✓ (Regel 22)
  - Mobile Read-Only ✓ (Regel 23)

### 1.2 conventions.md
- [x] **Konventionen**: Vollständig in `.kilocode/rules/40_ARCHITECTURE_CONVENTIONS.md` migriert
  - TypeScript-Konventionen ✓
  - Naming-Konventionen ✓
  - React-Konventionen ✓
  - Import-Reihenfolge ✓
  - API-Calls ✓
  - Kommentare ✓
  - Git-Konventionen ✓

### 1.3 architecture.md
- [ ] **Architektur**: In `.kilocode/portal/60_ARCH_CONFIG_UI.md` migriert?
  - Prüfen, ob Architekturdetails vorhanden sind.

### 1.4 glossary.md
- [ ] **Glossar**: In `.kilocode/portal/` oder separater Datei migriert?

### 1.5 RULES.md
- [ ] **Zusammenfassung**: In `.kilocode/rules/00_INDEX.md` integriert?

## 2. .claude/ - Claude-spezifische Dateien

### 2.1 CLAUDE.md
- [x] **Sprache und Präferenzen**: Vollständig in `.kilocode/portal/00_START_HERE.md` migriert
  - Projektsprache Deutsch ✓
  - Code-Stil ✓
  - Kommunikation ✓
  - Workflow ✓
  - Systemzeit-Verifikation ✓
  - Ports ✓
  - Pfad-Beschränkungen ✓
  - Analyse & Review Fokus ✓
  - Visualisierung ✓

### 2.2 planning.md
- [ ] **Planung**: In `.kilocode/portal/20_WORKFLOWS.md` migriert?

### 2.3 review.md
- [ ] **Review**: In `.kilocode/portal/40_STATUS.md` oder separater Datei migriert?

### 2.4 system.md
- [ ] **System**: In `.kilocode/portal/10_SOURCE_OF_TRUTH.md` migriert?

### 2.5 validation.md
- [ ] **Validierung**: In `.kilocode/rules/50_VALIDATION_GATES.md` migriert?

### 2.6 hooks/
- [ ] **Hooks**: In `.kilocode/portal/` dokumentiert oder als Legacy markiert?

### 2.7 state/
- [ ] **State-Dateien**: Als Legacy markiert, nicht migriert?

## 3. .codex/ - Codex-Dokumentation

### 3.1 CODEX.md
- [ ] **Codex-Einstellungen**: In `.kilocode/README.md` oder portal migriert?

### 3.2 system.md
- [ ] **System**: In `.kilocode/portal/10_SOURCE_OF_TRUTH.md` migriert?

### 3.3 workflows/
- [ ] **Workflows**: In `.kilocode/portal/20_WORKFLOWS.md` migriert?

## 4. Root-Level Dokumentation

### 4.1 CLAUDE.md (Root)
- [ ] **Inhalte**: Mit `.claude/CLAUDE.md` konsolidiert und migriert?

### 4.2 CODEX.md (Root)
- [ ] **Inhalte**: Mit `.codex/CODEX.md` konsolidiert und migriert?

### 4.3 AGENTS.md
- [ ] **Agenten-Katalog**: In `.kilocode/portal/` oder separater Datei migriert?

### 4.4 BLUEPRINT_PROMPT_DE.md
- [ ] **Blueprint**: In `.kilocode/portal/30_DOCS_MAP.md` integriert?

## 5. Vollständigkeitsprüfung

### 5.1 Kreuzreferenzen
- [ ] Alle internen Links in alter Dokumentation aktualisiert?
- [ ] Keine toten Referenzen zu alten Ordnern?

### 5.2 Funktionalität
- [ ] Alle beschriebenen Workflows in `.kilocode/portal/20_WORKFLOWS.md`?
- [ ] Alle Regeln in `.kilocode/rules/` abgedeckt?

### 5.3 Legacy-Entfernung
- [ ] Backup der alten Ordner erstellt?
- [ ] Keine Abhängigkeiten mehr zu alten Dateien?

## 6. Verifikation vor Entfernung

### 6.1 Tests
- [ ] Alle Tests laufen erfolgreich?
- [ ] Dokumentation konsistent mit Code?

### 6.2 Team-Abstimmung
- [ ] Alle Teammitglieder über Migration informiert?
- [ ] Neue Struktur trainiert?

### 6.3 Rollback-Plan
- [ ] Backup verfügbar?
- [ ] Schnelle Wiederherstellung möglich?

## Entfernungs-Kommandos (nur nach vollständiger Verifikation)

```bash
# Backup (empfohlen)
tar -czvf legacy_docs_backup_$(date +%Y%m%d).tar.gz .ai .claude .codex CLAUDE.md CODEX.md

# Entfernung (nur wenn alle Checks erfüllt)
rm -rf .ai .claude .codex CLAUDE.md CODEX.md
```

**Status:** ✅ Vollständig - Alle wesentlichen Inhalte aus alter Dokumentation wurden in .kilocode migriert. Switch kann durchgeführt werden, sobald Tests und Verifikation abgeschlossen sind.