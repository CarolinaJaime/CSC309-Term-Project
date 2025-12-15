# INSTALL.txt — CSC309 Loyalty Points System

This document explains how to deploy and run the CSC309 Loyalty Points System using the same setup described in the project README.

The application consists of:
- A **backend API** (Node.js + Express + Prisma)
- A **frontend web app** (React + Vite)
- A **PostgreSQL database** in production (via Railway)

---

## 1. Required Packages and Software

### System Requirements
- **Node.js 18+**
- **npm** (comes with Node.js)
- **Git**

### Backend Dependencies (installed via npm)
Installed automatically when running `npm install` in the `backend` directory:
- `express`
- `prisma`
- `@prisma/client`
- `jsonwebtoken`
- `bcrypt`
- `cors`
- `dotenv`

### Frontend Dependencies (installed via npm)
Installed automatically when running `npm install` in the `frontend` directory:
- `react`
- `react-dom`
- `react-router-dom`
- `tailwindcss`
- `vite`

No global packages are required beyond Node.js and npm.

---

## 2. Deployment Using Railway (Production)

The project is deployed using **Railway**, which provides:
- Managed backend hosting
- Managed PostgreSQL database
- HTTPS by default

---

### 2.1 Backend Deployment (Railway)

#### Steps
1. Create a new Railway project  
2. Select **Deploy from GitHub repo**  
3. Add a **PostgreSQL** database to the project  

#### Backend Service Configuration
- **Root Directory:** `backend`

**Build Command:**
```bash
npm install && npx prisma generate && npx prisma migrate deploy && npx prisma db seed
```

**Start Command:**
```bash
npm start
```

#### Required Environment Variables
Configured in Railway → Service → Variables:
- `DATABASE_URL` = Railway PostgreSQL connection URL
- `JWT_SECRET` = secure random string
- `NODE_ENV` = `production`
- `PORT` = `3000`

The backend runs as a Node.js server and exposes a REST API over HTTPS.

---

### 2.2 Frontend Deployment (Railway or Vercel)

The frontend is a static React application built with Vite.

#### Frontend Service Configuration
- **Root Directory:** `frontend`

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npx serve dist -s
```

#### Required Environment Variable
- `VITE_API_BASE_URL` = public URL of the deployed backend API

The frontend communicates with the backend using HTTP requests to this base URL.

---

## 3. Summary

To deploy this project:
1. Install Node.js and npm  
2. Deploy backend to Railway with PostgreSQL  
3. Set required environment variables  
4. Deploy frontend with correct API base URL  
