#!/bin/bash

# NTS Website Deployment Script
# Deploys to Hostinger VPS with proper handling of Next.js standalone mode

set -e  # Exit on error

REMOTE_USER="root"
REMOTE_HOST="72.62.6.180"
REMOTE_PATH="/var/www/ntsltd"
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
cd /var/www/ntsltd

echo "📥 Pulling latest code from git..."
git pull origin main

echo "🔨 Building Next.js application..."
npm run build

echo "📦 Copying public assets to standalone build..."
cp -r public/* .next/standalone/public/

echo "🔄 Restarting PM2 process..."
pm2 restart nts-website

echo "⏳ Waiting for app to start..."
sleep 3

echo "✅ Verifying deployment..."
if curl -s https://nevilletuckerservices.co.uk/images/ntsLogo.png -o /dev/null -w "%{http_code}" | grep -q "200"; then
    echo "✅ Images loading correctly (HTTP 200)"
else
    echo "⚠️  Warning: Image verification failed"
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
