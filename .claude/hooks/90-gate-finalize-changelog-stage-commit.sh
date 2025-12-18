#!/usr/bin/env bash
set -euo pipefail

cd "$CLAUDE_PROJECT_DIR"

# Keine Änderungen? Dann nichts erzwingen.
if git diff --quiet && git diff --cached --quiet; then
  exit 0
fi

state="$CLAUDE_PROJECT_DIR/.claude/state/state.env"
[[ -f "$state" ]] || { echo "BLOCK: state.env fehlt." 1>&2; exit 2; }
# shellcheck disable=SC1090
source "$state"

# 1) Mindest-Checks
if [[ "${LINT_RAN}" != "1" || "${TYPECHECK_RAN}" != "1" ]]; then
  echo "BLOCK: Bitte erst ausführen: npm run lint && npm run typecheck" 1>&2
  exit 2
fi

# 1b) PM_STATUS.md muss nach jedem Agentenlauf einen JSON-Statusblock enthalten.
changed_files="$(git status --porcelain)"
if [[ -n "${changed_files}" ]] && ! echo "${changed_files}" | grep -q "PM_STATUS.md"; then
  echo "BLOCK: Bitte PM_STATUS.md mit neuem JSON-Statusblock (agent/ziel/geändert/ergebnis/blocker/next_suggestion/notes) aktualisieren und stagen." 1>&2
  exit 2
fi

# 2) Changelog Timestamp prüfen: heute muss ein Eintrag existieren (oder du ergänzt ihn)
today="$(date +%Y-%m-%d)"
if ! grep -Eq "^### \\[[0-9]{2}:[0-9]{2}\\] - " CHANGELOG.md 2>/dev/null || ! grep -q "$today" CHANGELOG.md; then
  echo "BLOCK: Bitte CHANGELOG.md mit neuem Eintrag ergänzen (Format: [YYYY-MM-DD HH:MM] - Kategorie - Beschreibung) und dann stage+commit." 1>&2
  exit 2
fi

# 3) Stage: wir verlangen, dass der User/Claude staged und committed (wir machen es nicht automatisch).
if ! git diff --cached --quiet; then
  # staged vorhanden -> ok
  exit 0
fi

echo "BLOCK: Änderungen sind noch nicht staged. Bitte: git add -A && git commit -m \"...\" (und sicherstellen, dass CHANGELOG Eintrag passt)." 1>&2
exit 2
