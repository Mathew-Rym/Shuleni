# Shuleni Frontend - Setup & Deployment Guide

A modern educational platform frontend built with React, Redux, and Vite.

## 🚀 Quick Start for Developers

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Python 3 (for local development server)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Shuleni/shuleni-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   # Option 1: Use our custom development script (recommended)
   ./dev-server.sh
   
   # Option 2: Manual build and serve
   npm run build
   cd dist && python3 -m http.server 4000 --bind 0.0.0.0
   ```

4. **Access the application**
   - Local: http://localhost:4001
   - Network: http://0.0.0.0:4001

## 🌐 Deployment Options

### Option 1: Static Hosting (Recommended for Public Access)

**Netlify Deployment:**
1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy automatically on every push

**Vercel Deployment:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Your app will be live at the provided URL

**GitHub Pages:**
1. Build the project: `npm run build`
2. Push the `dist` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

### Option 2: Self-Hosted Server

**Using the included server script:**
```bash
# Make sure you have the repository
git clone <your-repo-url>
cd Shuleni/shuleni-frontend

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
./dev-server.sh
```

### Option 3: Docker Deployment

I can create a Docker setup if you'd like to containerize the application for easy deployment anywhere.

## 📱 Features

- ✅ **Demo Video Integration** - YouTube video popup explaining the app
- ✅ **Multi-language Support** - English, Swahili (🇰🇪), French
- ✅ **Teacher Management System** - Complete admin dashboard
- ✅ **Automatic Dashboard Creation** - Auto-generated credentials for teachers/students
- ✅ **Responsive Design** - Works on all devices
- ✅ **Real-time Updates** - Redux state management

## 🔧 Development Scripts

```bash
npm run dev        # Start Vite development server (may have issues)
npm run build      # Build for production
npm run preview    # Preview production build
npm run serve      # Start Express server
npm start          # Build and serve
./dev-server.sh    # Custom development script (recommended)
```

## 🐛 Troubleshooting

**If Vite dev server doesn't work:**
- Use our custom `dev-server.sh` script instead
- It uses Python HTTP server which is more reliable

**If you get module errors:**
- Make sure all dependencies are installed: `npm install`
- Try clearing node_modules: `rm -rf node_modules && npm install`

**For production deployment:**
- Always run `npm run build` first
- Serve the `dist` folder content
- Make sure your server supports SPA routing

## 🌍 Making Your App Publicly Accessible

**For immediate public access, I recommend:**

1. **Netlify** (easiest):
   - Just drag and drop your `dist` folder to netlify.com
   - Or connect your GitHub repo for automatic deployments

2. **Vercel** (developer-friendly):
   - Connect GitHub repo
   - Automatic deployments and great performance

3. **GitHub Pages** (free):
   - Good for static sites
   - Requires some additional setup for React Router

Would you like me to help you set up any of these deployment options?

## 📞 Support

If someone has issues running your frontend:
1. Make sure they have Node.js installed
2. Guide them through the setup steps above
3. The `dev-server.sh` script should work on any Unix-like system
4. For Windows users, they can use the manual Python server approach

---

**Note:** This is a frontend application that requires a backend API for full functionality. Make sure your backend is also deployed and accessible.
