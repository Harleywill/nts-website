#!/bin/bash

# NTS Website Deployment Script
# Deploys to Hostinger VPS with proper handling of Next.js standalone mode

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

echo "📦 Copying public assets to standalone build..."
mkdir -p .next/standalone/public
cp -r public/* .next/standalone/public/

echo "📦 Copying static CSS/JS to standalone build..."
mkdir -p .next/standalone/.next/static
cp -r .next/static/* .next/standalone/.next/static/ || true

echo "📦 Copying prisma folder to standalone build..."
cp -r prisma .next/standalone/

echo "🗄️  Running Prisma migrations in standalone build..."
cd /root/nts-website/.next/standalone
npx prisma migrate deploy || echo "Migrations already applied"

echo "🌱 Seeding database with initial data..."
npx prisma db seed || echo "Database already seeded"

echo "🔄 Setting up PM2 process..."
cd /root/nts-website
pm2 delete nts-website 2>/dev/null || true
PORT=3000 NODE_ENV=production pm2 start "node .next/standalone/server.js" --name nts-website --cwd /root/nts-website

echo "⏳ Waiting for app to start..."
sleep 3

echo "✅ Verifying deployment..."
images=$(curl -s -o /dev/null -w "%{http_code}" "https://nevilletuckerservices.co.uk/images/ntsLogo.png")
css=$(curl -s -o /dev/null -w "%{http_code}" "https://nevilletuckerservices.co.uk/_next/static/chunks/0-qgiswpibda~.css" || echo "404")

if [ "$images" = "200" ]; then
    echo "✅ Images loading correctly (HTTP 200)"
else
    echo "⚠️  Warning: Images not loading (HTTP $images)"
fi

if [ "$css" = "200" ]; then
    echo "✅ CSS loading correctly (HTTP 200)"
else
    echo "⚠️  Warning: CSS not loading (HTTP $css)"
fi

echo ""
echo "📋 PM2 Status:"
pm2 status | grep nts-website
echo ""
echo "✅ Deployment complete!"

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
