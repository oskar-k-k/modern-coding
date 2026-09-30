#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
if ! docker info >/dev/null 2>&1; then
  echo 'Bitte Docker mit Compose v2 installieren und starten.' >&2
  exit 1
fi
docker compose up --build --detach --wait --wait-timeout 180
address=$(docker compose port frontend 3000)
url="http://$address"
echo "Praesentation bereit: $url"
if command -v xdg-open >/dev/null 2>&1; then xdg-open "$url" >/dev/null 2>&1 || true
elif command -v open >/dev/null 2>&1; then open "$url" || true
fi
