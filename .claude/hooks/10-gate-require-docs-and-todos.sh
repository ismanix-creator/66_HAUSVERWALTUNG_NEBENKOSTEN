#!/usr/bin/env bash
set -euo pipefail

state="$CLAUDE_PROJECT_DIR/.claude/state/state.env"
[[ -f "$state" ]] || { echo "State fehlt. Bitte Session neu starten." 1>&2; exit 2; }

# shellcheck disable=SC1090
source "$state"

if [[ "${DOCS_READ}" != "1" ]]; then
  echo "BLOCK: Erst Pflicht-Doku lesen: .claude/*, .codex/*, .ai/*, CLAUDE.md, CODEX.md, AGENTS.md, PM_STATUS.md (letzter JSON-Block), BLUEPRINT_PROMPT_DE.md, wireframe.md, todo.md, config/config.toml. Prüfe bei Rollenfragen zusätzlich .github/agents/*.agent.md. Danach DOCS_READ=1 setzen." 1>&2
  exit 2
fi

if [[ "${TODOS_READY}" != "1" || "${READY_FOR_CHANGES}" != "1" ]]; then
  echo "BLOCK: Erst TODOs definieren/speichern in .claude/state/todo.md (max 10 Punkte) und READY_FOR_CHANGES=1 setzen." 1>&2
  exit 2
fi

exit 0
