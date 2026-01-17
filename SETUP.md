# Setup Guide for New Developers

This guide will help you set up the project from scratch after cloning from Git.

## Prerequisites

- **Python 3.10+** (Python 3.14 recommended)
- **Node.js 18+** and npm/yarn
- **Docker and Docker Compose** (optional, for PostgreSQL and Redis)
- **Git**

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Jansetu
```

## Step 2: Backend Setup

### 2.1 Create Virtual Environment

**On Windows:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### 2.2 Install Dependencies

```bash
# Make sure virtual environment is activated
pip install --upgrade pip
pip install -r requirements.txt
```

### 2.3 Set Up Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file (if it exists) or create new one
# Windows:
copy .env.example .env
# macOS/Linux:
cp .env.example .env
```

Edit `.env` and set:
```env
DATABASE_URL=sqlite:///./jansetu.db
REDIS_URL=redis://localhost:6379/0
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
OTP_EXPIRE_MINUTES=5
OTP_LENGTH=6
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
PLATFORM_BASE_URL=http://localhost:8000
```

**Note:** For SQLite (default), you don't need PostgreSQL. For PostgreSQL, use:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/jansetu
```

### 2.4 Initialize Database

```bash
# Make sure virtual environment is activated
python init_db.py
```

This will create the database tables and initial roles.

### 2.5 Start Backend Server

```bash
# Make sure virtual environment is activated
python -m uvicorn jansetu_platform.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Test the backend:**
```bash
# In another terminal
curl http://localhost:8000/health
```

Should return: `{"status":"healthy"}`

## Step 3: Frontend Setup

### 3.1 Install Dependencies

Open a **new terminal** (keep backend running):

```bash
cd frontend
npm install
# or
yarn install
```

### 3.2 Set Up Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
# Windows:
copy .env.example .env
# macOS/Linux:
cp .env.example .env
```

Edit `.env` and set:
```env
VITE_API_BASE_URL=http://localhost:8000
```

**Important:** Make sure the backend is running on `http://localhost:8000` before starting the frontend.

### 3.3 Start Frontend Server

```bash
npm run dev
# or
yarn dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 4: Verify Setup

1. **Backend is running:** Open http://localhost:8000/docs (Swagger UI)
2. **Frontend is running:** Open http://localhost:5173
3. **Test login:** 
   - Go to http://localhost:5173/login
   - Enter Aadhar: `ABC123456789`
   - Click "Send OTP"
   - Check backend terminal for OTP code
   - Enter OTP and verify

## Troubleshooting

### "uvicorn: command not found" or "ModuleNotFoundError: No module named 'uvicorn'"

**Solution:** You're not in the virtual environment or haven't installed dependencies.

1. Make sure you're in the `backend` directory
2. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`

### "Cannot connect to server" in Frontend

**Checklist:**
1. ✅ Backend is running (check http://localhost:8000/health)
2. ✅ Frontend `.env` file has `VITE_API_BASE_URL=http://localhost:8000`
3. ✅ Restart frontend after creating/editing `.env` file
4. ✅ No firewall blocking port 8000
5. ✅ Backend is running on `0.0.0.0:8000` (not just `127.0.0.1:8000`)

**Test backend connection:**
```bash
curl http://localhost:8000/health
# or open in browser: http://localhost:8000/health
```

### Database Errors

**If you see database errors:**
1. Make sure you ran `python init_db.py` in the backend directory
2. Check that `jansetu.db` file exists in `backend/` directory
3. If using PostgreSQL, make sure it's running:
   ```bash
   docker-compose up -d postgres
   ```

### Redis Errors (OTP not working)

**If OTP is not working:**
- Redis is optional for development
- OTP will be printed to backend console if Redis is not available
- To use Redis:
  ```bash
  docker-compose up -d redis
  ```

### Port Already in Use

**If port 8000 is already in use:**
1. Find what's using the port:
   - Windows: `netstat -ano | findstr :8000`
   - macOS/Linux: `lsof -i :8000`
2. Kill the process or change the port in backend startup command

### Frontend Build Errors

**If you see module errors:**
1. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   # Windows: rmdir /s node_modules && del package-lock.json
   ```
2. Reinstall: `npm install`

## Quick Start Scripts

### Windows (PowerShell)

Create `setup-backend.ps1`:
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
python init_db.py
Write-Host "Backend setup complete! Run: python -m uvicorn jansetu_platform.main:app --reload --host 0.0.0.0 --port 8000"
```

### macOS/Linux

Create `setup-backend.sh`:
```bash
#!/bin/bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python init_db.py
echo "Backend setup complete! Run: python -m uvicorn jansetu_platform.main:app --reload --host 0.0.0.0 --port 8000"
```

Make it executable:
```bash
chmod +x setup-backend.sh
./setup-backend.sh
```

## Next Steps

- Read [README.md](README.md) for project overview
- Check [QUICK_START.md](QUICK_START.md) for troubleshooting
- Review API documentation at http://localhost:8000/docs

## Getting Help

If you're still stuck:
1. Check backend terminal for error messages
2. Check browser console (F12) for frontend errors
3. Verify all environment variables are set correctly
4. Make sure all prerequisites are installed
