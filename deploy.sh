#!/bin/bash

set -e

echo "Starting deployment process..."

echo "Running npm install in root..."
npm install

echo "Navigating to backend directory..."
cd apps/pet-markt-be/

echo "Generating Prisma client..."
npx prisma generate

echo "Building backend application..."
npx nx build pet-markt-be

echo "Copying .env and ecosystem config to dist..."
cp .env ./dist/
cp ecosystem.config.js ./dist/

echo "Navigating to backend dist directory..."
cd dist

echo "Stopping and deleting existing 'backend' pm2 process..."
# Continue even if stop or delete fails (process might not exist)
pm2 stop backend || true
pm2 delete backend || true

echo "Starting backend with pm2..."
pm2 start ./ecosystem.config.js

echo "Verifying backend process..."
# This will show details or error if not running
pm2 describe backend

# frontend

echo "Navigating back to project root..."
cd ../../../

echo "Building frontend application..."
npx nx build pet-markt-web

echo "Copying frontend ecosystem config to dist..."
mkdir -p dist/apps/pet-markt-web/server
cp apps/pet-markt-web/ecosystem.config.js dist/apps/pet-markt-web/server/

echo "Navigating to frontend dist directory..."
cd dist/apps/pet-markt-web/server

echo "Stopping and deleting existing 'frontend' pm2 process..."
pm2 stop frontend || true
pm2 delete frontend || true

echo "Starting frontend with pm2..."
pm2 start ./ecosystem.config.js

echo "Verifying frontend process..."
pm2 describe frontend

echo "Navigating back to project root..."
cd ../../../../

echo "Deployment script finished."

exit 0