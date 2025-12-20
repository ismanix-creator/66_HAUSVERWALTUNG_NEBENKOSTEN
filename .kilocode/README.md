# Kilocode System - Single Source of Truth

**Dies ist die zentrale Dokumentationsquelle für das Projekt. Alle Projektregeln, Workflows und Referenzen sind hier konsolidiert.**

## Einstieg
- [portal/](portal/) - Hauptportal und Navigation (Startpunkt für neue Teammitglieder)
- [rules/](rules/) - Verbindliche Projektregeln (müssen vor jeder Änderung gelesen werden)

## Navigation
- [index/FILES.md](index/FILES.md) - Komplette Dateiliste mit Links (für detaillierte Suche)
- [index/TREE.txt](index/TREE.txt) - Verzeichnisstruktur-Übersicht (für schnelle Orientierung)
- [index/SWITCH_CHECKLIST.md](index/SWITCH_CHECKLIST.md) - Migrations-Status der Dokumentation

## Legacy

Die folgenden Verzeichnisse und Dateien gelten als Legacy und dürfen nach dem Systemswitch entfernt werden:
- `.ai/` - Alte KI-Dokumentation
- `.claude/` - Claude-spezifische Dateien
- `.codex/` - Codex-Dokumentation
- `CLAUDE.md` - Haupt-Claude-Dokumentation
- `CODEX.md` - Haupt-Codex-Dokumentation

Diese Verzeichnisse enthalten veraltete Dokumentationsstrukturen, die durch das neue `.kilocode/` System ersetzt wurden.

## Migration

Nach erfolgreicher Migration und Verifikation können die Legacy-Verzeichnisse mit folgenden Kommandos entfernt werden:

```bash
# Backup erstellen (empfohlen)
tar -czvf legacy_docs_backup_$(date +%Y%m%d).tar.gz .ai .claude .codex CLAUDE.md CODEX.md

# Legacy-Verzeichnisse entfernen (optional)
rm -rf .ai .claude .codex CLAUDE.md CODEX.md
```

**Wichtig:** Führen Sie die Entfernung erst durch, wenn alle Referenzen aktualisiert und alle Tests erfolgreich sind.
