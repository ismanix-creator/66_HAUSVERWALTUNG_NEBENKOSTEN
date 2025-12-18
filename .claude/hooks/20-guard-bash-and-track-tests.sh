#!/usr/bin/env bash
set -euo pipefail
json="$(cat)"

cmd="$(echo "$json" | sed -nE 's/.*"command" *: *"([^"]+)".*/\1/p' | head -n1)"
[[ -z "${cmd:-}" ]] && exit 0

# Riskante Kommandos blocken
echo "$cmd" | grep -Eq 'rm -rf (\/|~|"\$HOME")|curl .* \| *sh|wget .* \| *sh|sudo |mkfs\.|dd if=' && {
  echo "BLOCK: Riskantes Bash-Kommando erkannt: $cmd" 1>&2
  exit 2
}

state="$CLAUDE_PROJECT_DIR/.claude/state/state.env"
[[ -f "$state" ]] || exit 0
# shellcheck disable=SC1090
source "$state"

# Track “sinnvolle Tests”, sobald sie tatsächlich gelaufen sind
echo "$cmd" | grep -Eq 'npm run typecheck' && TYPECHECK_RAN=1
echo "$cmd" | grep -Eq 'npm run lint' && LINT_RAN=1
echo "$cmd" | grep -Eq 'npm (run )?test|vitest' && TESTS_RAN=1

cat > "$state" <<EOF
DOCS_READ=${DOCS_READ}
TODOS_READY=${TODOS_READY}
READY_FOR_CHANGES=${READY_FOR_CHANGES}
TYPECHECK_RAN=${TYPECHECK_RAN}
LINT_RAN=${LINT_RAN}
TESTS_RAN=${TESTS_RAN}
EOF

exit 0
