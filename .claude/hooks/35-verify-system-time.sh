#!/bin/bash

# Hook 35: Systemzeit-Verifikation vor CHANGELOG-Updates
# Stellt sicher dass Systemzeit vor jeder CHANGELOG-Änderung geprüft wird
#
# Trigger: Wenn CHANGELOG.md geändert wird

# Nur ausführen wenn CHANGELOG.md in den geplanten Änderungen ist
if ! git diff --cached --name-only | grep -q "CHANGELOG.md"; then
    exit 0
fi

# Systemzeit prüfen
CURRENT_TIME=$(date '+%Y-%m-%d %H:%M')
CURRENT_TIME_FULL=$(date '+%Y-%m-%d %H:%M:%S UTC')

echo ""
echo "════════════════════════════════════════════════════════════"
echo "⏰ SYSTEMZEIT-VERIFIKATION für CHANGELOG-Update"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🔍 Aktuelle Systemzeit: $CURRENT_TIME_FULL"
echo ""
echo "✅ Bitte stelle sicher, dass CHANGELOG.md mit dieser Systemzeit aktualisiert wurde:"
echo "   Format: [${CURRENT_TIME}] oder [YYYY-MM-DD HH:MM]"
echo ""
echo "❌ NICHT akzeptabel:"
echo "   - Geschätzte oder angenommene Zeiten"
echo "   - Zeiten ohne Verifikation per 'date' Befehl"
echo "   - [Latest] oder [Current] ohne Zeitstempel"
echo ""
echo "📋 Commit-Message muss enthalten:"
echo "   Systemzeit verifiziert: ${CURRENT_TIME} UTC (per 'date' Befehl)"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
