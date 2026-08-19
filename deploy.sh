#!/bin/bash

# NTS Website Deployment Script
# Deploys to Hostinger VPS. Runs `next start` directly (not standalone —
# see the PM2 step below for why) and verifies the app is actually up
# before reporting success.

set -e  # Exit on error

REMOTE_USER="root"
REMOTE_HOST="72.62.6.180"
REMOTE_PATH="/root/nts-website"
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
cd /root/nts-website

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

echo "🔄 Setting up PM2 process..."
# Runs `next start` directly (NOT the standalone server) — the production
# server needs the real public/ directory on disk so files uploaded after
# boot (CVs, project/news images) are served without a restart. Standalone
# mode snapshots public/ at boot and breaks that; do not switch back.
pm2 delete nts-website 2>/dev/null || true
PORT=3000 NODE_ENV=production pm2 start npm --name nts-website --cwd /root/nts-website -- start
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
    echo "Visit: https://nevilletuckerservices.co.uk"
else
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi
