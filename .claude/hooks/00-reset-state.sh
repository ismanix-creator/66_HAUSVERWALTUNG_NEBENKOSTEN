#!/usr/bin/env bash
set -euo pipefail

mkdir -p "$CLAUDE_PROJECT_DIR/.claude/state"

cat > "$CLAUDE_PROJECT_DIR/.claude/state/state.env" <<'EOF'
DOCS_READ=0
TODOS_READY=0
READY_FOR_CHANGES=0
TYPECHECK_RAN=0
LINT_RAN=0
TESTS_RAN=0
EOF

# TODO-Datei nicht löschen (falls du History willst) – aber leeren:
: > "$CLAUDE_PROJECT_DIR/.claude/state/todo.md"
exit 0
