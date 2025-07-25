#!/bin/bash

echo "🚀 Starting Shuleni Development Server..."

# Function to build the project
build_project() {
    echo "📦 Building project..."
    npm run build
    if [ $? -eq 0 ]; then
        echo "✅ Build successful!"
    else
        echo "❌ Build failed!"
        exit 1
    fi
}

# Function to start the server
start_server() {
    echo "🌐 Starting server on http://localhost:4001"
    cd dist && python3 -m http.server 4001 --bind 0.0.0.0 &
    SERVER_PID=$!
    echo "Server PID: $SERVER_PID"
}

# Function to stop the server
stop_server() {
    if [ ! -z "$SERVER_PID" ]; then
        echo "🛑 Stopping server..."
        kill $SERVER_PID 2>/dev/null
    fi
    pkill -f "python3 -m http.server 4001" 2>/dev/null
}

# Trap to ensure server is stopped when script exits
trap stop_server EXIT

# Initial build and start
build_project
start_server

echo ""
echo "🎉 Development server is running!"
echo "📱 Local: http://localhost:4001"
echo "🌍 Network: http://0.0.0.0:4001"
echo ""
echo "👀 Watching for changes... (Press Ctrl+C to stop)"
echo ""

# Watch for changes in src directory
while true; do
    # Use inotifywait if available, otherwise use a simple sleep loop
    if command -v inotifywait &> /dev/null; then
        inotifywait -r -e modify,create,delete,move src/ package.json vite.config.js 2>/dev/null
    else
        sleep 5
    fi
    
    echo "🔄 Changes detected, rebuilding..."
    stop_server
    build_project
    start_server
    echo "✅ Server restarted!"
done
