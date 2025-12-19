#!/usr/bin/env bash
# Session-Start Hook: Initializes state directory
set -euo pipefail

STATE_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/state"
mkdir -p "$STATE_DIR"

# Initialize state file if it doesn't exist
if [ ! -f "$STATE_DIR/session.env" ]; then
  cat > "$STATE_DIR/session.env" <<'EOF'
# Session state (set by hooks)
DOCS_CHECKED=0
TODOS_READY=0
TYPECHECK_DONE=0
LINT_DONE=0
TESTS_DONE=0
EOF
fi

# Log session start
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Session started" >> "$STATE_DIR/session.log"
exit 0
