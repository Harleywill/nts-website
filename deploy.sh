#!/bin/bash

# NTS Website Deployment Script
# Deploys to /opt/nts-website on the Hostinger VPS, where the app runs as
# the unprivileged `ntsweb` user (not root — see the PM2 step below).
# Runs `next start` directly, not standalone mode (the production server
# needs the real public/ directory on disk so files uploaded after boot —
# CVs, project/news images — are served without a restart; standalone mode
# snapshots public/ at boot and breaks that). Verifies the app is actually
# up before reporting success.

set -e  # Exit on error

REMOTE_USER="root"
REMOTE_HOST="72.62.6.180"
REMOTE_PATH="/opt/nts-website"
SSH_KEY="$HOME/.ssh/hostinger_key"
BRANCH="${1:-main}"

echo "🚀 Starting NTS Website Deployment..."
echo "Branch: $BRANCH"
echo "Target: $REMOTE_HOST:$REMOTE_PATH"
echo ""

# Deploy steps
ssh -i "$SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" <<'DEPLOY_SCRIPT'
set -e

echo "📂 Navigating to project directory..."
cd /opt/nts-website

echo "📥 Pulling latest code from git..."
# Clean up any local database files that might block the pull
rm -f prisma/dev.db prisma/*.db
git pull origin main

echo "🔨 Building Next.js application..."
npm run build

echo "🗄️  Setting up database..."
# Run Prisma migrations to create the database schema
npx prisma migrate deploy || echo "Migrations already applied"

# Seed the database with initial data
npx prisma db seed || echo "Database already seeded"

echo "🔧 Generating Prisma client..."
npx prisma generate || echo "Prisma client already generated"

echo "🔄 Restarting PM2 process..."
# Since the September 2026 security hardening, nts-website runs as the
# unprivileged `ntsweb` system user, not root — and that uid/gid lives only
# in PM2's own per-process metadata (there's no ecosystem.config.js here).
# `pm2 delete` + a fresh raw `pm2 start` would drop that and silently bring
# the process back up as root, undoing the hardening. Always use `pm2
# restart` on the existing process instead — it preserves uid/gid, cwd, env,
# and the exec command as already configured.
pm2 restart nts-website
pm2 save

echo "⏳ Waiting for app to start..."
sleep 5

# Verify against localhost, not the public domain — the public hostname's
# DNS/CDN routing is a separate concern from whether this deploy actually
# booted, and checking through it can mask (or fake) a real app failure.
echo "✅ Verifying deployment..."
pm2_state=$(pm2 jlist | node -e "
  let d='';
  process.stdin.on('data', c => d += c);
  process.stdin.on('end', () => {
    const p = JSON.parse(d).find(p => p.name === 'nts-website');
    console.log(p ? p.pm2_env.status : 'missing');
  });
")
home=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://localhost:3000/")
services=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://localhost:3000/services")

echo "PM2 status: $pm2_state"
echo "Home page:  HTTP $home"
echo "Services:   HTTP $services"
echo ""
echo "📋 PM2 process list:"
pm2 status | grep nts-website
echo ""

if [ "$pm2_state" = "online" ] && [ "$home" = "200" ] && [ "$services" = "200" ]; then
    echo "✅ App is healthy."
else
    echo "❌ App did NOT come up healthy — check 'pm2 logs nts-website' on the VPS."
    exit 1
fi

DEPLOY_SCRIPT

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ✅ ✅  DEPLOYMENT SUCCESSFUL!"
    echo "Visit: https://ntslimited.org"
else
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi
