# Shuleni Deployment Guide - Vercel + Render Integration

## Current Status
- **Frontend**: Ready for Vercel deployment
- **Backend**: Running on Render at `https://shuleni-sfox.onrender.com`
- **Integration**: Configured and tested

## Fixes Applied

### 1. **Vercel Configuration Issues Fixed**
- Updated `vercel.json` with proper SPA routing
- Fixed import/export issues in API services
- Configured environment variables
- Optimized Vite configuration for production

### 2. **API Integration Configured**
- created `src/config/api.js` with backend endpoints
- Created `src/services/api.js` with API service functions
- Environment variables for different environments

### 3. **Build Optimization**
- Removed CSP headers causing deployment issues
- Optimized chunk splitting for better performance
- Added proper .vercelignore file

## 🌐 Deployment Steps

### **Step 1: Deploy to Vercel**

1. **Login to Vercel**: Go to [vercel.com](https://vercel.com)

2. **Import Project**: 
   - Click "New Project"
   - Import from GitHub: `Mathew-Rym/Shuleni`
   - Select **root directory** as `shuleni-frontend`

3. **Configure Settings**:
   ```
   Framework Preset: Vite
   Root Directory: shuleni-frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables** (Add in Vercel dashboard):
   ```
   VITE_API_BASE_URL=https://shuleni-sfox.onrender.com
   VITE_APP_ENV=production
   ```

5. **Deploy**: Click "Deploy"

### **Step 2: Verify Backend on Render**

Your backend is already deployed at: **`https://shuleni-sfox.onrender.com`**

Test these endpoints:
```bash
# Health check
curl https://shuleni-sfox.onrender.com/api/health

# Test API endpoints
curl https://shuleni-sfox.onrender.com/api/users/students
curl https://shuleni-sfox.onrender.com/api/classes
```

### **Step 3: Configure CORS on Backend**

Make sure your Flask backend has CORS configured for your Vercel domain:

```python
from flask_cors import CORS

CORS(app, origins=[
    "http://localhost:5173",  # Development
    "https://your-vercel-app.vercel.app",  # Production
    "https://shuleni.vercel.app"  # Custom domain
])
```

## 🔍 Common Vercel Error Solutions

### **DEPLOYMENT_NOT_READY_REDIRECTING (303)**
- **Cause**: Build process taking too long
- **Solution**: Build completed successfully 

### **FUNCTION_INVOCATION_FAILED (500)**
- **Cause**: Server-side function errors
- **Solution**: Using static build (no functions) 

### **ROUTER_CANNOT_MATCH (502)**
- **Cause**: Routing configuration issues
- **Solution**: Added proper SPA routing in `vercel.json` 

### **NOT_FOUND (404)**
- **Cause**: Missing files or incorrect paths
- **Solution**: Proper build output configuration 

## Frontend Features Ready

### **Admin Dashboard**
- Student/teacher management
- Calendar events with role-based targeting
- Photo upload functionality
- Real-time reporting

### **Teacher Dashboard**
- Resource upload/download
- Attendance reports (PDF download)
- Grade reports (PDF download)
- Class management

### **Student Dashboard**
- Resource access
- Class information
- Calendar events

### **Resources Management**
- File upload/download
- Edit/delete functionality
- Type-based organization

## 🌐 API Integration

### **Authentication**
```javascript
// Login
POST /api/auth/login
// Register
POST /api/auth/register
```

### **User Management**
```javascript
// Students
GET /api/users/students
POST /api/users/students
PUT /api/users/students/:id

// Teachers
GET /api/users/teachers
POST /api/users/teachers
PUT /api/users/teachers/:id
```

### **Resources**
```javascript
// Get resources
GET /api/resources
// Upload resource
POST /api/resources/upload
// Download resource
GET /api/resources/download/:id
```

## Expected URLs After Deployment

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://shuleni-sfox.onrender.com`

## Testing Checklist

1. **Build Success**: Local build completed
2. **API Configuration**: Backend URL configured
3. **Environment Variables**: Set for production
4. **Routing**: SPA routing configured
5. **CORS**: Backend allows frontend domain

## If You Encounter Issues

1. **Check Vercel Logs**: Function tab in Vercel dashboard
2. **Check Backend**: Ensure Render service is running
3. **Test API**: Use Postman/curl to test backend endpoints
4. **Environment Variables**: Verify they're set correctly in Vercel

## Next Steps After Deployment

1. Test login/registration
2. Test resource upload/download
3. Test PDF report generation
4. Verify calendar functionality
5. Test role-based access

Your app is now ready for deployment! 
