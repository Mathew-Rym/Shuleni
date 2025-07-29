#!/bin/bash

echo "🚀 Starting Shuleni Application..."

# Navigate to the frontend directory
cd /home/rym/Desktop/Shuleni/shuleni-frontend

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Install Chart.js dependencies for the detailed reports
echo "📊 Installing Chart.js dependencies..."
npm install chart.js react-chartjs-2

# Start the development server
echo "🎯 Starting development server..."
npm run dev

echo "✅ Application should now be running at http://localhost:5173/"
echo "🔄 Real-time features will be active with data updating every 5 seconds"
echo "👥 You can test different user roles: Admin, Teacher, Student"
