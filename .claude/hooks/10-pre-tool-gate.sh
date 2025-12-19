#!/usr/bin/env bash
# Pre-Tool Hook: Simple validation for Write/Edit operations
set -euo pipefail

STATE_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/state"

# Check if user is changing config files
# This is just informational, not blocking
if [[ "${1:-}" == *"config"* ]] || [[ "${1:-}" == *".toml"* ]]; then
  cat > "$STATE_DIR/last_change.log" <<EOF
$(date '+%Y-%m-%d %H:%M:%S') - Config/TOML file changed: ${1:-unknown}
Remember to update:
  - CHANGELOG.md
  - Documentation if schema changed
  - Blueprint/BAUPLAN if entity structure changed
EOF
fi

exit 0
