#!/usr/bin/env bash
# Session-End Hook: Finalize work and suggest next steps
set -euo pipefail

STATE_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/state"

# Log session end
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Session ended" >> "$STATE_DIR/session.log"

# Summary (non-blocking)
if [ -f "$STATE_DIR/last_change.log" ]; then
  echo "=== Last changes logged ===" >&2
  cat "$STATE_DIR/last_change.log" >&2
fi

exit 0
