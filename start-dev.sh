#!/bin/bash
echo "Starting Shuleni Development Server..."
cd /home/rym/Desktop/Shuleni/shuleni-frontend

echo "Checking Node version..."
node --version
echo "Checking npm version..."
npm --version

echo "Installing dependencies..."
npm install

echo "Running ESLint check..."
npm run lint

echo "Starting development server..."
npm run dev
