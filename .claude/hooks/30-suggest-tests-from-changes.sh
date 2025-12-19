#!/usr/bin/env bash
set -euo pipefail

# Wir machen hier bewusst KEIN auto-run, nur Hinweis (Exit 0).
# So vermeidest du Hook-Schleifen und unerwünschte Last.

state="$CLAUDE_PROJECT_DIR/.claude/state/state.env"
[[ -f "$state" ]] || exit 0
# shellcheck disable=SC1090
source "$state"

# Wenn an Code gearbeitet wird, sollten mind. lint+typecheck laufen.
if [[ "${LINT_RAN}" != "1" || "${TYPECHECK_RAN}" != "1" ]]; then
  echo "HINWEIS: Nach Code-Änderungen bitte: npm run lint && npm run typecheck" 1>&2
fi

# Tests sind optional je nach Scope – wir erinnern nur.
if [[ "${TESTS_RAN}" != "1" ]]; then
  echo "HINWEIS: Falls Logik geändert: npm test (Vitest) ausführen." 1>&2
fi

exit 0
