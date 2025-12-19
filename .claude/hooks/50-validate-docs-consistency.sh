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

# 5. Check button types completeness
check_button_types() {
  local button_types=("add" "edit" "save" "cancel" "delete" "confirm" "close" "back" "export" "import" "search")
  local missing=()

  for btn_type in "${button_types[@]}"; do
    if ! grep -q "\[buttons\.$btn_type\]" "$CONFIG_FILE"; then
      missing+=("$btn_type")
    fi
  done

  if [[ ${#missing[@]} -gt 0 ]]; then
    error "Button-Typen fehlen in config.toml: ${missing[*]}"
  else
    success "Alle Standard-Button-Typen definiert"
  fi

  # Check form actions use button references
  if grep -q 'submit = "buttons\.' "$CONFIG_FILE"; then
    success "Form-Actions verwenden Button-Referenzen"
  else
    warning "Form-Actions verwenden noch alte Label-Struktur"
  fi
}

# 6. Check table configuration completeness
check_table_config() {
  local has_table=$(grep -q "\[table\]" "$CONFIG_FILE" && echo "1" || echo "0")
  [[ "$has_table" == "0" ]] && return 0

  # Check required row styling properties
  local required_props=("row_padding" "row_height" "header_padding" "header_height" "stripe_enabled" "stripe_odd_bg" "stripe_even_bg")
  local missing_props=()

  for prop in "${required_props[@]}"; do
    if ! grep -q "^$prop = " "$CONFIG_FILE"; then
      missing_props+=("$prop")
    fi
  done

  if [[ ${#missing_props[@]} -gt 0 ]]; then
    error "Table-Eigenschaften fehlen: ${missing_props[*]}"
  else
    success "Alle Tabellen-Eigenschaften definiert (row_height, stripe_enabled, etc.)"
  fi

  # Check for spacing subsection
  if grep -q "\[table\.spacing\]" "$CONFIG_FILE"; then
    success "[table.spacing] Subsection konfiguriert"
  else
    warning "[table.spacing] Subsection nicht gefunden"
  fi
}

# Run validations
check_port_consistency
check_version_consistency
check_api_endpoints
check_config_structure
check_button_types
check_table_config

# Summary
echo ""
if [[ $ERRORS -eq 0 ]]; then
  echo "✓ Dokumentations-Validierung erfolgreich"
  exit 0
else
  echo "❌ $ERRORS Fehler, $WARNINGS Warnungen"
  exit 1
fi
