#!/usr/bin/env bash
# Deploy clashback to the VPS. Run from the clashback folder: bash deploy.sh
# Does not touch other apps on the server (nemaa-backend, its Nginx site, Postgres).
set -euo pipefail

SERVER="root@187.126.17.246"
APP_DIR="/var/www/clashback"

# 0) Preflight: abort before changing anything if port 5000 is taken by something else
#    or the Nginx config is already broken
ssh "$SERVER" bash -s <<'EOF'
set -e
if ss -tlnp | grep -q ':5000 ' && ! pm2 describe clashback >/dev/null 2>&1; then
  echo "❌ Port 5000 is in use by another process. Aborting."; exit 1
fi
nginx -t 2>/dev/null || { echo "❌ Nginx config already invalid. Aborting."; exit 1; }
echo "✅ Preflight OK"
EOF

# 1) Upload source (no node_modules, no .git, no local .env)
ssh "$SERVER" "mkdir -p $APP_DIR"
tar --exclude=node_modules --exclude=.git --exclude=.env -czf - . | ssh "$SERVER" "tar -xzf - -C $APP_DIR"

# 2) Server .env: token from local .env, listen on localhost only (Nginx in front)
TOKEN=$(grep -E '^COC_API_TOKEN=' .env | cut -d= -f2- | tr -d '\r')
printf 'PORT=5000\nHOST=127.0.0.1\nCOC_API_TOKEN=%s\nCORS_ORIGIN=\n' "$TOKEN" |
  ssh "$SERVER" "cat > $APP_DIR/.env && chmod 600 $APP_DIR/.env"

# 3) Install deps and (re)start with PM2
ssh "$SERVER" bash -s <<EOF
set -e
cd $APP_DIR
npm ci --omit=dev --no-audit --no-fund
pm2 startOrReload ecosystem.config.js --update-env
pm2 save
EOF

# 4) Nginx: new site for the bare IP only (existing sites untouched)
ssh "$SERVER" bash -s <<'EOF'
set -e
cat > /etc/nginx/sites-available/clashback <<'NGINX'
server {
    listen 80;
    server_name 187.126.17.246;

    gzip on;
    gzip_types application/json;
    gzip_min_length 1024;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
    }
}
NGINX
ln -sf /etc/nginx/sites-available/clashback /etc/nginx/sites-enabled/clashback
if nginx -t; then
  systemctl reload nginx   # graceful: no downtime for existing sites
else
  echo "❌ Nginx test failed, rolling back"
  rm -f /etc/nginx/sites-enabled/clashback /etc/nginx/sites-available/clashback
  exit 1
fi
EOF

# 5) Smoke test
sleep 2
curl -s -o /dev/null -w "health: %{http_code}\n" http://187.126.17.246/health
curl -s http://187.126.17.246/api/clan/2PYCUY8RG | head -c 150; echo
curl -sk -o /dev/null -w "nemaa (must stay 2xx/3xx/4xx, not 5xx): %{http_code}\n" https://api.naama.org.sa/
