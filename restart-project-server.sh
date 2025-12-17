#!/usr/bin/env bash
#
# @file        restart-project-server.sh
# @description Stoppt und startet nur 66_HAUSVERWALTUNG_NEBENKOSTEN (Ports 5174/3002)
# @version     1.0.0
# @updated     2025-12-16 12:50:00 CET
# @author      Claude Code CLI

set -euo pipefail

PROJECT_DIR="/home/akki/codes/66_HAUSVERWALTUNG_NEBENKOSTEN"
cd "$PROJECT_DIR"

BACKEND_PORT=3002
FRONTEND_PORT=5174
BACKEND_HOST="127.0.0.1"

LOG="$PROJECT_DIR/logs/restart-project.log"
mkdir -p "$(dirname "$LOG")"

# Ports, die für dieses Projekt gekillt werden sollen
PORTS_TO_KILL=(5174 3002)

stop_port() {
  local port=$1
  echo "Stopping processes on port $port..." | tee -a "$LOG"
  local pids
  pids=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  if [[ -n "$pids" ]]; then
    echo "Found PIDs: $pids" | tee -a "$LOG"
    for pid in $pids; do
      echo "Sending SIGTERM to PID $pid" | tee -a "$LOG"
      kill "$pid" 2>/dev/null || true
      sleep 1
      if kill -0 "$pid" 2>/dev/null; then
        echo "PID $pid still alive, sending SIGKILL" | tee -a "$LOG"
        kill -9 "$pid" 2>/dev/null || true
      fi
      echo "Killed PID $pid" | tee -a "$LOG"
    done
  else
    echo "No process on port $port" | tee -a "$LOG"
  fi
}

echo "=== $(date '+%Y-%m-%d %H:%M:%S %Z') Restart started ===" | tee -a "$LOG"

# Stop services
echo "Stopping 66_HAUSVERWALTUNG_NEBENKOSTEN ports..." | tee -a "$LOG"
for port in "${PORTS_TO_KILL[@]}"; do
  stop_port "$port"
done

echo "" | tee -a "$LOG"
echo "========================================" | tee -a "$LOG"
echo "Starting 66_HAUSVERWALTUNG_NEBENKOSTEN (5174/3002)" | tee -a "$LOG"
echo "========================================" | tee -a "$LOG"

echo "Building backend for 66_HAUSVERWALTUNG_NEBENKOSTEN..." | tee -a "$LOG"
if npm run build:server >>"$LOG" 2>&1; then
  echo "Backend build successful" | tee -a "$LOG"

  echo "Starting backend on port 3002..." | tee -a "$LOG"
  nohup env HOST="$BACKEND_HOST" PORT="$BACKEND_PORT" NODE_OPTIONS="--experimental-loader=./loaders/resolve-js-extension.mjs" node dist/server/server/index.js >>"$LOG" 2>&1 &
  backend_pid=$!
  disown
  sleep 2

  if kill -0 "$backend_pid" 2>/dev/null; then
    echo "Backend started (PID $backend_pid)" | tee -a "$LOG"
  else
    echo "Backend failed to start" | tee -a "$LOG"
  fi
else
  echo "Backend build failed for 66_HAUSVERWALTUNG_NEBENKOSTEN" | tee -a "$LOG"
fi

echo "Starting frontend on port 5174..." | tee -a "$LOG"
nohup env BACKEND_PORT="$BACKEND_PORT" npm run dev:client -- --port "$FRONTEND_PORT" >>"$LOG" 2>&1 &
frontend_pid=$!
disown
sleep 2

if kill -0 "$frontend_pid" 2>/dev/null; then
  echo "Frontend started (PID $frontend_pid)" | tee -a "$LOG"
else
  echo "Frontend failed to start" | tee -a "$LOG"
fi

echo "" | tee -a "$LOG"
echo "========================================" | tee -a "$LOG"
echo "Access checks" | tee -a "$LOG"
echo "========================================" | tee -a "$LOG"

sleep 3

for port in "$BACKEND_PORT" "$FRONTEND_PORT"; do
  if curl -s --max-time 3 "http://localhost:$port/" >/dev/null; then
    echo "http://localhost:$port is UP" | tee -a "$LOG"
  else
    echo "http://localhost:$port is DOWN or not responding" | tee -a "$LOG"
  fi
done

echo "" | tee -a "$LOG"
echo "========================================" | tee -a "$LOG"
echo "Summary" | tee -a "$LOG"
echo "========================================" | tee -a "$LOG"

# Check service status
backend_status="❌"
frontend_status="❌"

if lsof -ti tcp:3002 >/dev/null 2>&1; then
  backend_status="✅"
fi

if lsof -ti tcp:5174 >/dev/null 2>&1; then
  frontend_status="✅"
fi

echo "66_HAUSVERWALTUNG_NEBENKOSTEN:" | tee -a "$LOG"
echo "  - Frontend: http://localhost:5174 $frontend_status" | tee -a "$LOG"
echo "  - Backend:  http://localhost:3002 $backend_status" | tee -a "$LOG"
echo "" | tee -a "$LOG"
echo "Log: $LOG" | tee -a "$LOG"
echo "=== $(date '+%Y-%m-%d %H:%M:%S %Z') Restart finished ===" | tee -a "$LOG"
