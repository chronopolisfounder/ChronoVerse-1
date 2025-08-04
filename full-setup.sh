#!/bin/bash
set -e

echo "=============================================="
echo "      ChronoVerse Full Auto Setup Script      "
echo "=============================================="
echo ""
echo "STEP 1: Installing dependencies..."
npm install

echo ""
echo "STEP 2: Building for production..."
npm run build

echo ""
echo "STEP 3: Starting local preview server..."
npm run preview

echo ""
echo "=============================================="
echo " ChronoVerse is built and running!            "
echo " Access: http://localhost:4173/ (default Vite)"
echo "=============================================="
