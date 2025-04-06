#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting deployment process..."

# 1. Install root dependencies
echo "Running npm install in root..."
npm install

# 2. Backend build and deployment
echo "Navigating to backend directory..."
cd apps/pet-markt-be/

echo "Generating Prisma client..."
npx prisma generate

echo "Building backend application..."
# Use the confirmed build command
npx nx build pet-markt-be

echo "Copying .env and ecosystem config to dist..."
cp .env ./dist/
cp ecosystem.config.js ./dist/

echo "Navigating to backend dist directory..."
cd dist

echo "Stopping and deleting existing 'backend' pm2 process..."
pm2 stop backend || true # Continue even if stop fails (process might not exist)
pm2 delete backend || true # Continue even if delete fails

echo "Starting backend with pm2..."
pm2 start ./ecosystem.config.js

echo "Verifying backend process..."
pm2 describe backend # This will show details or error if not running

# 3. Navigate back to root
echo "Navigating back to project root..."
# Adjusted path for Linux/bash standard
cd ../../../

# 4. Frontend build and deployment
echo "Building frontend application..."
# Use the confirmed build command
npx nx build pet-markt-web

echo "Copying frontend ecosystem config to dist..."
# Ensure target directory exists (though nx build usually creates it)
mkdir -p dist/apps/pet-markt-web/server
cp apps/pet-markt-web/ecosystem.config.js dist/apps/pet-markt-web/server/

echo "Navigating to frontend dist directory..."
cd dist/apps/pet-markt-web/server

echo "Stopping and deleting existing 'frontend' pm2 process..."
pm2 stop frontend || true # Continue even if stop fails
pm2 delete frontend || true # Continue even if delete fails

echo "Starting frontend with pm2..."
pm2 start ./ecosystem.config.js

echo "Verifying frontend process..."
pm2 describe frontend # This will show details or error if not running

# 5. Navigate back to root
echo "Navigating back to project root..."
# Adjusted path for Linux/bash standard
cd ../../../../

echo "Deployment script finished."

exit 0
