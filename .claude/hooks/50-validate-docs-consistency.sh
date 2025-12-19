#!/usr/bin/env bash
# Validate documentation consistency with actual code
set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
CONFIG_FILE="$PROJECT_DIR/config/config.toml"
CLAUDE_FILE="$PROJECT_DIR/CLAUDE.md"
CODEX_FILE="$PROJECT_DIR/CODEX.md"
CLAUDE_DOT_FILE="$PROJECT_DIR/.claude/CLAUDE.md"
CODEX_DOT_FILE="$PROJECT_DIR/.codex/CODEX.md"

ERRORS=0
WARNINGS=0

# Helper functions
error() {
  echo "❌ [$1]" >&2
  ((ERRORS++))
}

warning() {
  echo "⚠️  [$1]" >&2
  ((WARNINGS++))
}

success() {
  echo "✓ [$1]"
}

# 1. Check port consistency (should be 3002)
check_port_consistency() {
  local port_code=$(grep -o "port.*3[0-9][0-9][0-9]" "$PROJECT_DIR/src/server/index.ts" | grep -o "3[0-9][0-9][0-9]" | head -1)
  [[ -n "$port_code" ]] || return 0

  for file in "$CLAUDE_FILE" "$CODEX_FILE" "$CLAUDE_DOT_FILE" "$CODEX_DOT_FILE"; do
    [[ -f "$file" ]] || continue

    if ! grep -q "$port_code" "$file"; then
      error "Port $port_code nicht dokumentiert in $file"
    fi
  done

  [[ $ERRORS -eq 0 ]] && success "Port-Konsistenz: $port_code korrekt"
}

# 2. Check version consistency
check_version_consistency() {
  local config_version=$(grep -A5 "^\[meta\]" "$CONFIG_FILE" | grep "^version = " | head -1 | cut -d'"' -f2)
  [[ -n "$config_version" ]] || return 0

  local claude_version=$(grep "v$config_version" "$CLAUDE_FILE" | head -1)
  local codex_version=$(grep "v$config_version" "$CODEX_FILE" | head -1)

  [[ -n "$claude_version" ]] || error "Version $config_version nicht in CLAUDE.md"
  [[ -n "$codex_version" ]] || error "Version $config_version nicht in CODEX.md"

  [[ $ERRORS -eq 0 ]] && success "Version-Konsistenz: v$config_version korrekt"
}

# 3. Check API endpoints documentation
check_api_endpoints() {
  if grep -q "/api/config/widths" "$CLAUDE_FILE"; then
    success "API-Endpunkt /api/config/widths dokumentiert"
  else
    warning "API-Endpunkt /api/config/widths nicht dokumentiert"
  fi

  # Check for old endpoints (should not exist)
  if grep -q "api/config/{typ}" "$CLAUDE_FILE"; then
    error "Alte API-Endpunkte (api/config/{typ}) noch dokumentiert"
  fi
}

# 4. Check config.toml structure documentation
check_config_structure() {
  local has_widths=$(grep -q "\[widths\]" "$CONFIG_FILE" && echo "1" || echo "0")
  local doc_widths=$(grep -c "widths" "$CLAUDE_FILE" 2>/dev/null || echo "0")

  local has_buttons=$(grep -q "\[buttons\]" "$CONFIG_FILE" && echo "1" || echo "0")
  local has_table=$(grep -q "\[table\]" "$CONFIG_FILE" && echo "1" || echo "0")

  if [[ "$has_widths" == "1" ]] && [[ "$doc_widths" -lt 1 ]]; then
    warning "config.toml [widths] Sektion nicht in CLAUDE.md dokumentiert"
  else
    [[ "$has_widths" == "1" ]] && success "[widths] Sektion vorhanden"
  fi

  [[ "$has_buttons" == "1" ]] && success "[buttons] Sektion vorhanden"
  [[ "$has_table" == "1" ]] && success "[table] Sektion vorhanden"
}

# Run validations
check_port_consistency
check_version_consistency
check_api_endpoints
check_config_structure

# Summary
echo ""
if [[ $ERRORS -eq 0 ]]; then
  echo "✓ Dokumentations-Validierung erfolgreich"
  exit 0
else
  echo "❌ $ERRORS Fehler, $WARNINGS Warnungen"
  exit 1
fi
