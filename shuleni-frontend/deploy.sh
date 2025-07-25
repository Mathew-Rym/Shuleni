#!/bin/bash

echo "🚀 Shuleni Frontend - Easy Deployment Script"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the project
echo ""
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if Python is available for serving
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "⚠️  Python not found. You'll need to serve the dist folder manually."
    echo "📁 Built files are in the 'dist' directory"
    echo "🌐 You can serve them using any static file server"
    exit 0
fi

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "Choose an option:"
echo "1) Start local server (recommended for testing)"
echo "2) Just show deployment info"
echo ""
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Starting local server..."
        echo "📱 Your app will be available at: http://localhost:4001"
        echo "🛑 Press Ctrl+C to stop the server"
        echo ""
        cd dist && $PYTHON_CMD -m http.server 4001 --bind 0.0.0.0
        ;;
    2)
        echo ""
        echo "📁 Your built application is in the 'dist' directory"
        echo ""
        echo "🌐 Deployment Options:"
        echo "  • Upload 'dist' folder to any web hosting service"
        echo "  • Use Netlify: drag & drop 'dist' folder to netlify.com"
        echo "  • Use Vercel: run 'npx vercel' in this directory"
        echo "  • Use GitHub Pages: push 'dist' to gh-pages branch"
        echo ""
        echo "🖥️  Local Testing:"
        echo "  cd dist && $PYTHON_CMD -m http.server 4001"
        echo ""
        ;;
    *)
        echo "Invalid choice. Exiting..."
        exit 1
        ;;
esac
