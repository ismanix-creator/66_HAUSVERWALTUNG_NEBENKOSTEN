#!/usr/bin/env bash
# Auto-update CLAUDE.md, CODEX.md with version from config.toml and CHANGELOG
set -euo pipefail

CONFIG_FILE="config/config.toml"
CLAUDE_FILE="CLAUDE.md"
CODEX_FILE="CODEX.md"
CHANGELOG_FILE="CHANGELOG.md"

# Exit if config doesn't exist
[[ -f "$CONFIG_FILE" ]] || exit 0

# Extract version and last modified from [meta] section
VERSION=$(grep -A5 "^\[meta\]" "$CONFIG_FILE" | grep "^version = " | head -1 | cut -d'"' -f2)
[[ -n "${VERSION:-}" ]] || exit 0

# Get current date and last commit
SHORT_DATE=$(date +"%Y-%m-%d %H:%M")
LAST_COMMIT=$(git log -1 --pretty=format:"%h %s" 2>/dev/null || echo "")

# Update CLAUDE.md if it contains "Zuletzt aktualisiert:"
if [[ -f "$CLAUDE_FILE" ]] && grep -q "Zuletzt aktualisiert:" "$CLAUDE_FILE"; then
  sed -i "s/Zuletzt aktualisiert:.*/Zuletzt aktualisiert: $SHORT_DATE CET (v$VERSION)/" "$CLAUDE_FILE"
fi

# Update CODEX.md if it contains "Zuletzt aktualisiert:"
if [[ -f "$CODEX_FILE" ]] && grep -q "Zuletzt aktualisiert:" "$CODEX_FILE"; then
  sed -i "s/Zuletzt aktualisiert:.*/Zuletzt aktualisiert: $SHORT_DATE CET (v$VERSION)/" "$CODEX_FILE"
fi

# Update CHANGELOG if not a docs: commit
if [[ -f "$CHANGELOG_FILE" ]] && [[ -n "$LAST_COMMIT" ]] && ! echo "$LAST_COMMIT" | grep -q "^docs:"; then
  TODAY=$(date +"%Y-%m-%d")
  if ! grep -q "^## $TODAY" "$CHANGELOG_FILE"; then
    HEADER="## $TODAY

### [$SHORT_DATE] - Auto - $(echo "$LAST_COMMIT" | cut -d' ' -f2-)"
    sed -i "7i $HEADER\n" "$CHANGELOG_FILE" 2>/dev/null || true
  fi
fi

exit 0
