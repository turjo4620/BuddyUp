# BuddyUp Frontend-Backend Connection Guide

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

The backend will start at `http://localhost:5000`

### 2. Start the Frontend Development Server

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration (backend/.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/buddyup
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Frontend Configuration (frontend/.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK_DATA=false
VITE_API_TIMEOUT=10000
VITE_DEBUG_API=true
```

## 🔍 Testing the Connection

### 1. Automatic Connection Test
- The frontend automatically tests the backend connection on startup
- Check the connection status bar at the top of the page
- Green = Backend Connected, Yellow = Using Mock Data

### 2. Manual Health Check
Visit: `http://localhost:5000/api/health`

Expected response:
```json
{
  "success": true,
  "message": "BuddyUp API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "version": "1.0.0",
  "database": "connected",
  "endpoints": {
    "profiles": "/api/profiles",
    "projects": "/api/projects",
    "joinRequests": "/api/joinRequests",
    "matching": "/api/matching",
    "aiGuidance": "/api/ai/guidance"
  }
}
```

### 3. Test API Endpoints

#### Create Profile
```bash
curl -X POST http://localhost:5000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "department": "Computer Science",
    "academicYear": "3rd Year",
    "skills": ["JavaScript", "Python", "React"],
    "projectInterests": ["Web Development", "AI/ML"]
  }'
```

#### Get All Profiles
```bash
curl http://localhost:5000/api/profiles
```

#### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI Study Assistant",
    "description": "Building an AI-powered study assistant",
    "requiredSkills": ["JavaScript", "Python", "Machine Learning"],
    "teamSize": 4,
    "owner": "PROFILE_ID_HERE"
  }'
```

#### Get All Projects
```bash
curl http://localhost:5000/api/projects
```

## 🔄 Mock Data vs Real Backend

### Switch to Mock Data Mode
```javascript
// In browser console or component
import { setMockMode } from './src/api/api.js';
setMockMode(true); // Use mock data
```

### Switch to Real Backend Mode
```javascript
import { setMockMode } from './src/api/api.js';
setMockMode(false); // Use real backend
```

### Check Current Mode
```javascript
import { getCurrentMode } from './src/api/api.js';
console.log(getCurrentMode()); // Returns 'MOCK' or 'REAL'
```

## 🐛 Troubleshooting

### Backend Not Starting
1. Check if MongoDB is running
2. Verify `.env` file exists in backend folder
3. Check port 5000 is not in use: `lsof -i :5000`

### Frontend Can't Connect to Backend
1. Verify backend is running at `http://localhost:5000`
2. Check CORS configuration in backend
3. Look for proxy errors in browser console
4. Try switching to mock mode temporarily

### CORS Issues
The backend is configured to allow requests from:
- `http://localhost:3000` (React dev server)
- `http://localhost:5173` (Vite default)
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

### Database Connection Issues
1. Start MongoDB: `mongod` or `brew services start mongodb-community`
2. Check connection string in backend/.env
3. Verify database exists: `mongo buddyup`

## 📊 API Endpoints Reference

### Profiles
- `POST /api/profiles` - Create profile
- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/:id` - Get profile by ID
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects (with filters)
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/owner/:ownerId` - Get projects by owner

### Join Requests
- `POST /api/joinRequests` - Send join request
- `GET /api/joinRequests/:projectId` - Get requests for project
- `GET /api/joinRequests/student/:studentId` - Get requests by student
- `PUT /api/joinRequests/:requestId/status` - Update request status

### Matching Algorithm
- `GET /api/matching/teammates/:projectId` - Get suggested teammates
- `GET /api/matching/projects/:studentId` - Get matching projects

### AI Guidance
- `POST /api/ai/guidance` - Get AI response

### System
- `GET /api/health` - Health check

## 🎯 Demo Flow

1. **Start both servers** (backend on :5000, frontend on :3000)
2. **Check connection status** (green bar at top)
3. **Create a profile** via frontend form
4. **Create a project** via frontend form
5. **Browse projects** and send join requests
6. **Check dashboard** for created projects and requests
7. **Use AI help** for guidance

## 🔧 Development Tips

### Enable API Logging
Set `VITE_DEBUG_API=true` in frontend/.env to see detailed API logs

### Monitor Network Requests
- Open browser DevTools → Network tab
- Filter by "XHR" to see API calls
- Check request/response details

### Backend Logs
The backend logs all requests and responses with emojis for easy identification:
- 📝 Request received
- 📤 Response sent
- ✅ Success
- ❌ Error
- 🏥 Health check

### Frontend Console Commands
```javascript
// Test backend connection
import { testBackendConnection } from './src/api/api.js';
testBackendConnection();

// Switch modes
import { setMockMode, getCurrentMode } from './src/api/api.js';
setMockMode(true);  // Mock mode
setMockMode(false); // Real backend
console.log(getCurrentMode());
```

## 🚀 Production Deployment

### Environment Variables
Update these for production:

**Backend:**
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
PORT=5000
```

**Frontend:**
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_USE_MOCK_DATA=false
```

### Build Commands
```bash
# Backend
cd backend
npm run start

# Frontend
cd frontend
npm run build
npm run preview
```