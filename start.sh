#!/usr/bin/env bash
# Launch InternshipTracker locally — backend (Spring Boot) + frontend (Vite) —
# then open it in your browser. Stop everything with Ctrl+C.
#
#   ./start.sh
#
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load local env if present (gitignored). Mainly RESEND_API_KEY so email works.
if [ -f "$ROOT/.env" ]; then
  set -a; . "$ROOT/.env"; set +a
fi

# JDK 21 for the Spring Boot backend (Homebrew keg-only path on this machine).
export JAVA_HOME="${JAVA_HOME:-/usr/local/opt/openjdk@21}"

echo "▶  Starting backend  → http://localhost:8080"
( cd "$ROOT/backend" && mvn -q -DskipTests spring-boot:run ) &
BACKEND_PID=$!

echo "▶  Starting frontend → http://localhost:5173"
( cd "$ROOT/frontend" && npm run dev ) &
FRONTEND_PID=$!

cleanup() {
  echo
  echo "■  Shutting down…"
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  pkill -P "$BACKEND_PID" 2>/dev/null || true   # mvn spawns the java child
  pkill -P "$FRONTEND_PID" 2>/dev/null || true  # npm spawns the vite child
  pkill -f 'spring-boot:run' 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

# Wait until BOTH the backend (so data loads) and frontend are ready, then open
# the browser. Waiting on the backend avoids a failed first fetch on a cold start.
echo "⏳  Waiting for the app to be ready…"
for _ in $(seq 1 90); do
  if curl -sf http://localhost:8080/api/reminders/health >/dev/null 2>&1 \
     && curl -sf http://localhost:5173 >/dev/null 2>&1; then
    echo "✅  Ready — opening http://localhost:5173"
    open http://localhost:5173 2>/dev/null || true
    break
  fi
  sleep 1
done

echo "   Press Ctrl+C to stop both servers."
wait
