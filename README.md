# CSC309 Loyalty Points System

A full-stack web application for managing a loyalty points program with role-based access control, event management, transactions, and promotions.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | `term-project-frontend-production.up.railway.app` |
| **Backend API** | `term-project-backend-production-a2a4.up.railway.app` |

---

## 👤 Demo Accounts

All demo accounts use the password: **`password123`**

| Role | UTORid | Email | Capabilities |
|------|--------|-------|--------------|
| **Superuser** | `superadmin` | superadmin@mail.utoronto.ca | Full system access, manage all users and roles |
| **Manager** | `manager01` | manager@mail.utoronto.ca | Manage users, events, promotions, view reports |
| **Cashier** | `cashier01` | cashier@mail.utoronto.ca | Process transactions, register users |
| **Regular User** | `user0001` | user@mail.utoronto.ca | Earn/redeem points, attend events |

### Additional Test Users
- `user0002` (Alice Johnson) - Verified, 1200 points
- `user0003` (Bob Smith) - **Unverified** (for testing verification flow)
- `user0004` (Carol Williams) - Verified, 750 points

---

## 🏗️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **TailwindCSS** for styling
- **Context API** for state management (AuthContext)

### Backend
- **Node.js** with Express.js
- **Prisma ORM** for database access
- **JWT** for authentication
- **bcrypt** for password hashing

### Database
- **SQLite** (development)
- **PostgreSQL** (production/Railway)

### Deployment
- **Railway** (Backend + PostgreSQL)
- **Railway** or **Vercel** (Frontend)

---

## 🚀 Deployment to Railway

### Prerequisites
- A [Railway](https://railway.app) account
- Your project pushed to GitHub

### Step 1: Create Railway Project
1. Log in to Railway
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository

### Step 2: Add PostgreSQL Database
1. In your Railway project, click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Wait for it to provision

### Step 3: Configure Backend Service
1. Click on your backend service
2. Go to **Settings** → **Variables**
3. Add these environment variables:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-secure-random-string-here
NODE_ENV=production
PORT=3000
```

4. Go to **Settings** → **Build & Deploy**:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy && npx prisma db seed`
   - **Start Command:** `npm start`

### Step 4: Configure Frontend Service
1. Add another service for frontend (or use Vercel)
2. Go to **Settings** → **Variables**:

```env
VITE_API_BASE_URL=https://your-backend.up.railway.app
```

3. Go to **Settings** → **Build & Deploy**:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npx serve dist -s`

### Step 5: Update Schema for PostgreSQL
Before deploying, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure .env with your local settings:
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="your-dev-secret"

# Run database migrations
npx prisma migrate dev

# Seed the database with demo data
npx prisma db seed

# Start development server
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure .env:
# VITE_API_BASE_URL=http://localhost:3000

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 📁 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── auth/              # AuthContext, ProtectedRoutes
│   │   ├── components/        # Reusable UI components
│   │   ├── layouts/           # AppLayout, PublicLayout
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Users.jsx
│   │   │   └── ...
│   │   └── router/            # Route definitions
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed.js            # Database seeding script
│   │   └── migrations/        # Database migrations
│   ├── routes/                # API route handlers
│   ├── middleware/            # Auth, validation middleware
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🔐 Security Measures

| Security Feature | Implementation |
|-----------------|----------------|
| **HTTPS** | Enforced by Railway in production |
| **Password Hashing** | bcrypt with salt rounds |
| **Authentication** | JWT tokens with expiration |
| **Input Validation** | Server-side validation on all endpoints |
| **SQL Injection Prevention** | Parameterized queries via Prisma ORM |
| **XSS Prevention** | React's built-in escaping + input sanitization |
| **Secrets Management** | Environment variables (not in codebase) |
| **CORS** | Configured to allow only frontend origin |

### Security Checklist
- ✅ `.env` files are in `.gitignore`
- ✅ No hardcoded API keys or secrets
- ✅ JWT tokens stored in localStorage (with expiration)
- ✅ Password requirements enforced
- ✅ Role-based access control on all protected routes

---

## 📊 Pre-populated Data

The seed script (`prisma/seed.js`) creates:

### Users (7 total)
- 1 Superuser, 1 Manager, 1 Cashier, 4 Regular users
- Includes verified and unverified users for testing

### Promotions (3 total)
- **Welcome Bonus**: One-time 100 points for first purchase over $10
- **Double Points Week**: 2x points on all purchases
- **Big Spender Bonus**: 200 bonus points for purchases over $50

### Events (3 total)
- **Welcome Week Kickoff**: Published, with registered guests
- **Tech Talk: AI in 2025**: Published, with organizers
- **Study Session**: Draft/unpublished for testing

### Transactions (8 total)
- Purchase transactions with various amounts
- Redemption transaction
- Point transfers between users
- Event attendance rewards
- Manager adjustments

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/tokens` | Login, returns JWT |
| POST | `/auth/resets` | Request password reset |
| POST | `/auth/resets/:token` | Complete password reset |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user profile |
| PATCH | `/users/me` | Update profile |
| PATCH | `/users/me/password` | Change password |
| GET | `/users` | List users (manager+) |
| POST | `/users` | Create user (cashier+) |
| PATCH | `/users/:id` | Update user (manager+) |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions` | List transactions |
| POST | `/transactions` | Create transaction |
| GET | `/users/me/transactions` | My transactions |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | List events |
| POST | `/events` | Create event |
| GET | `/events/:id` | Event details |
| PATCH | `/events/:id` | Update event |
| DELETE | `/events/:id` | Delete event |
| POST | `/events/:id/guests` | RSVP to event |

### Promotions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/promotions` | List promotions |
| POST | `/promotions` | Create promotion |
| GET | `/promotions/:id` | Promotion details |

---

## 🧪 Testing the Application

### As a Regular User (`user0001`)
1. Login and view dashboard with points balance
2. Browse and RSVP to events
3. View transaction history
4. Update profile information

### As a Cashier (`cashier01`)
1. Process purchase transactions
2. Register new users
3. Switch to regular user view

### As a Manager (`manager01`)
1. View all users with filters/pagination
2. Verify unverified users (`user0003`)
3. Create and manage events
4. Manage promotions
5. Switch between manager/cashier/regular views

### As a Superuser (`superadmin`)
1. All manager capabilities
2. Promote users to manager role
3. Full system access

---

## 📝 Additional Notes

- The application supports interface switching for users with multiple roles
- Event organizers can manage their events without being cashiers/managers
- All times are displayed in the user's local timezone
- The system uses a 1:1 point-to-dollar ratio by default

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Ensure PostgreSQL is running (Railway) or SQLite file exists (local)
- Check `DATABASE_URL` environment variable

### "Invalid token" errors
- Clear localStorage and login again
- Check that `JWT_SECRET` matches between sessions

### Frontend not loading data
- Verify `VITE_API_BASE_URL` points to correct backend URL
- Check browser console for CORS errors
- Ensure backend is running and accessible