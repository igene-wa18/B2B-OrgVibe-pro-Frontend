# 🏢 WORKFORCE PRO - Frontend

A modern, role-based B2B workforce management application built with **React**, **Vite**, and **Chart.js**. WORKFORCE PRO provides comprehensive HR management capabilities including attendance tracking, leave management, expense handling, and detailed analytics.

**Live Demo:** [https://b2-b-work-beta-app-frontend.vercel.app](https://b2-b-work-beta-app-frontend.vercel.app)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Architecture](#architecture)
- [Key Components](#key-components)
- [Pages & Features](#pages--features)
- [Authentication & Authorization](#authentication--authorization)
- [API Integration](#api-integration)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**WORKFORCE PRO** is an enterprise-grade HR management platform designed to streamline workforce operations. It provides a comprehensive suite of tools for managing:

- **Attendance**: Real-time check-in/check-out with time tracking
- **Leave Management**: Request and approve leaves with calendar view
- **Expense Management**: Submit and track business expenses with receipt uploads
- **Employee Management**: Centralized employee database with departmental organization
- **Analytics & Reporting**: Visual dashboards with charts and performance metrics
- **Memos**: Internal communication and announcements

The platform supports **4 role-based access levels** (Admin, Department Head, Manager, Employee) with granular permission controls.

---

## ✨ Features

### Core Features

| Feature | Description | Access Level |
|---------|-------------|--------------|
| **Dashboard** | Real-time analytics, attendance cards, performance metrics | All Roles |
| **Attendance Tracking** | Check-in/out, monthly records, attendance statistics | All Roles |
| **Leave Management** | Request/approve leaves, calendar view, team oversight | All Roles |
| **Expense Tracking** | Submit expenses, upload receipts, approval workflow | Manager+ |
| **Employee Management** | View/manage employees, departmental assignment | Admin/Dept Head/Manager |
| **Department Management** | Create/manage departments, assignments | Admin Only |
| **Memos** | Send internal memos and announcements | All Roles |
| **Notifications** | Real-time notification panel with unread count | All Roles |
| **Reports** | Visual analytics with charts and trends | Admin/Dept Head |
| **Export** | Download data in CSV format | Applicable Roles |

### Technical Features

- ✅ Role-Based Access Control (RBAC)
- ✅ Protected Routes with Authentication
- ✅ Real-time Notifications (15s polling)
- ✅ File Upload Support (Receipt Images)
- ✅ Interactive Charts & Analytics (Pie, Doughnut, Line, Bar)
- ✅ Responsive Design (Mobile-Friendly)
- ✅ Search & Filter Functionality
- ✅ Calendar View for Leave Management
- ✅ CSV Export Capabilities
- ✅ SPA with Client-Side Routing

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [React 19.2.4](https://react.dev) - UI library
- **Build Tool**: [Vite 7.3.1](https://vitejs.dev) - Next-generation build tool
- **Routing**: [React Router DOM 7.13.1](https://reactrouter.com) - Client-side routing
- **HTTP Client**: [Axios 1.13.6](https://axios-http.com) - API requests
- **Charts**: [Chart.js 4.5.1](https://www.chartjs.org) + [React-ChartJS-2 5.3.1](https://react-chartjs-2.js.org) - Data visualization
- **Styling**: CSS3 with CSS Variables

### Development
- **Language**: JavaScript (ES6+)
- **Package Manager**: npm
- **Deployment**: Vercel
- **Type Support**: TypeScript (configured but using JavaScript)

---

## 📁 Project Structure

```
B2B-workBeta-app-Frontend/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Sidebar.jsx         # Navigation sidebar with role-based menu
│   │   ├── Topbar.jsx          # Header with notifications & user role
│   │   ├── ProtectedRoute.jsx  # Role-based route protection
│   │   └── NotificationPanel.jsx # Real-time notifications display
│   │
│   ├── context/                # React Context for global state
│   │   └── AuthContext.jsx     # Authentication & user state management
│   │
│   ├── pages/                  # Page components (one per route)
│   │   ├── Login.jsx           # Authentication login page
│   │   ├── Register.jsx        # User registration page
│   │   ├── Dashboard.jsx       # Main dashboard with analytics
│   │   ├── Attendance.jsx      # Attendance tracking & records
│   │   ├── Leaves.jsx          # Leave management with calendar
│   │   ├── Expenses.jsx        # Expense submission & approval
│   │   ├── Employees.jsx       # Employee directory & management
│   │   ├── Departments.jsx     # Department management (Admin)
│   │   ├── Memos.jsx           # Internal memos & announcements
│   │   └── Reports.jsx         # Detailed reporting (unused)
│   │
│   ├── utils/                  # Utility functions & helpers
│   │   └── api.js             # Axios instance with interceptors
│   │
│   ├── App.jsx                 # Main app component with routing
│   ├── App.css                 # Global styles & responsive design
│   └── main.jsx                # React DOM entry point
│
├── public/                     # Static assets
├── index.html                  # HTML entry point
├── vite.config.js             # Vite configuration
├── vercel.json                # Vercel deployment config
├── package.json               # Dependencies & scripts
├── package-lock.json          # Dependency lock file
└── README.md                  # This file
```

---

## 💻 Installation & Setup

### Prerequisites
- Node.js 16+ and npm 8+
- Backend server running (see API endpoint configuration)

### Step 1: Clone Repository
```bash
git clone https://github.com/igene-wa18/B2B-workBeta-app-Frontend.git
cd B2B-workBeta-app-Frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
Create a `.env.local` file in the project root:

```env
# API Configuration
VITE_API_URL=http://localhost:5001/api

# Optional: Add other environment variables as needed
```

### Step 4: Start Development Server
```bash
npm run dev
```

The application will open at `http://localhost:3000` with API proxy to `http://localhost:5001`

### Step 5: Build for Production
```bash
npm run build
```

### Step 6: Preview Production Build
```bash
npm run preview
```

---

## 🚀 Usage

### Access the Application

1. **Login Page** (`/login`)
   - Enter email and password
   - First-time users should register via `/register`

2. **Dashboard** (`/dashboard`)
   - View real-time statistics
   - Check-in/check-out for non-admin users
   - View analytics (Admin/Dept Head only)

3. **Navigation**
   - Use the sidebar to navigate between sections
   - Navigation items vary by user role
   - Logout via the sidebar user panel

### User Roles & Permissions

#### 👨‍💼 Employee
- ✓ View personal dashboard
- ✓ Check-in/check-out
- ✓ View personal attendance records
- ✓ Request leaves
- ✓ View personal memos

#### 👨‍✈️ Manager
- ✓ All Employee permissions
- ✓ View team attendance
- ✓ View team leave requests (approve/reject)
- ✓ Submit expenses
- ✓ View team memos

#### 🏢 Department Head
- ✓ All Manager permissions
- ✓ Manage department employees
- ✓ Approve/reject expenses
- ✓ View department analytics & reports

#### 🔑 Admin
- ✓ All permissions
- ✓ Manage all users and departments
- ✓ View system-wide analytics
- ✓ Create departments
- ✓ Manage all expenses

---

## 🏗 Architecture

### Authentication Flow

```
Login → API Call → Store Token → Set Auth Context → Redirect to Dashboard
```

The authentication context manages:
- User state (name, email, role, etc.)
- JWT token storage in localStorage
- Login/Logout handlers
- Auto-login on app reload

### State Management

**Global State (React Context):**
- `AuthContext`: User authentication, token, login/logout

**Local State (useState):**
- Component-specific data (forms, filters, UI states)

### API Communication

All API calls use the `api` utility which:
- Intercepts requests to add JWT token to headers
- Uses the configured `VITE_API_URL` base URL
- Handles error responses

**Request Pattern:**
```javascript
import api from '../utils/api';

// GET
api.get('/endpoint').then(res => { /* data */ })

// POST
api.post('/endpoint', data).then(res => { /* response */ })

// PATCH
api.patch('/endpoint/id/action').then(res => { /* response */ })
```

---

## 🧩 Key Components

### Sidebar Component
Displays role-based navigation menu with:
- Dynamic menu items based on user role
- User info & avatar
- Logout button

### Topbar Component
Header bar featuring:
- Page title
- Notification bell with unread count
- User role badge
- Notification panel toggle

### ProtectedRoute Component
Guards routes based on:
- Authentication status
- User role permissions
- Redirects unauthorized users to login or dashboard

### NotificationPanel Component
Shows:
- Real-time notifications
- Unread notification count
- Notification management

---

## 📄 Pages & Features

### 🔐 Login & Register (`/login`, `/register`)
- Email/password authentication
- Form validation
- Error messages
- Link to registration page

### 📊 Dashboard (`/dashboard`)
**Features:**
- Real-time statistics cards (Total Employees, Departments, Present Today, etc.)
- **For Employees/Managers:**
  - Today's attendance card with check-in/out buttons
  - Real-time attendance status
- **For Admin/Dept Head:**
  - Expense by category (Pie Chart)
  - Attendance status breakdown (Doughnut Chart)
  - Monthly expense trends (Line Chart)
  - Top performing employees (Bar Chart)

### 📋 Attendance (`/attendance`)
**Features:**
- **My Attendance Tab:**
  - View personal attendance records
  - Monthly statistics (Present, Late, Absent, Leave)
  - Attendance percentage
  - Search & filter by date range
- **Team View Tab** (Manager/Dept Head/Admin):
  - View all team member attendance
  - Search by employee name
  - Export to CSV
- **Controls:**
  - Month/Year selector
  - CSV export functionality

### 📅 Leaves (`/leaves`)
**Features:**
- **Request Leave:**
  - Date range picker
  - Reason textarea
  - Submit requests
- **View Leaves:**
  - List view with status badges
  - Calendar view with color-coded leaves
  - Filter by status (Pending, Approved, Rejected)
- **Approval** (Manager/Dept Head/Admin):
  - View pending requests
  - Approve/reject leaves
  - Search by employee name
- **Calendar Navigation:**
  - Month picker
  - Visual representation of leaves

### 💰 Expenses (`/expenses`)
**Features:**
- **Submit Expense:**
  - Amount input (in ₹)
  - Category selection (Office Supplies, Travel, Equipment, Software, Other)
  - Description
  - Receipt/Bill upload (optional)
- **View Expenses:**
  - Searchable table
  - Status filter (Pending, Approved, Rejected)
  - Receipt preview modal
- **Approval** (Dept Head/Admin):
  - Approve/reject with one-click actions
  - View receipt images
  - Detail panel
- **Export:**
  - Download filtered data to CSV

### 👥 Employees (`/employees`)
**Features:**
- Searchable employee directory
- Filter by department
- Employee details view
- Add/edit employee (Admin/Dept Head)
- Manage role assignments

### 🏢 Departments (`/departments`)
**Features (Admin Only):**
- View all departments
- Create new departments
- Assign employees to departments
- Department details management

### 📝 Memos (`/memos`)
**Features:**
- View internal memos
- Send memos (based on role)
- Read/unread status
- Timestamp tracking

---

## 🔐 Authentication & Authorization

### JWT Token Management
- Tokens stored in `localStorage` as `ws_token`
- Auto-attached to all API requests via interceptor
- Validated on app load
- Cleared on logout

### Role-Based Access Control
```javascript
// ProtectedRoute enforces role checking
<Route path="/expenses" 
  element={
    <ProtectedRoute roles={['manager', 'dept_head', 'admin']}>
      <Expenses />
    </ProtectedRoute>
  } 
/>
```

### Dynamic UI Rendering
```javascript
const canViewAnalytics = ['admin', 'dept_head'].includes(user?.role);

{canViewAnalytics && <AnalyticsSection />}
```

---

## 🔌 API Integration

### Base Configuration
```javascript
// src/utils/api.js
const api = axios.create({ 
    baseURL: import.meta.env.VITE_API_URL || '/api' 
});
```

### Proxy Configuration (Development)
```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:5001',
    changeOrigin: true,
    secure: false
  },
  '/uploads': {
    target: 'http://localhost:5001',
    changeOrigin: true
  }
}
```

### API Endpoints Used

**Authentication:**
- `POST /auth/login` - Login
- `POST /auth/signup` - Register
- `GET /auth/me` - Get current user

**Attendance:**
- `GET /attendance/my?month=X&year=Y` - Personal attendance
- `GET /attendance/today` - Today's attendance
- `GET /attendance/team` - Team attendance
- `GET /attendance/stats?month=X&year=Y` - Attendance statistics
- `POST /attendance/check-in` - Check-in
- `POST /attendance/check-out` - Check-out

**Leaves:**
- `GET /leaves/my` - Personal leave requests
- `GET /leaves/team` - Team leave requests
- `POST /leaves` - Submit leave request
- `PATCH /leaves/:id/approve` - Approve leave
- `PATCH /leaves/:id/reject` - Reject leave

**Expenses:**
- `GET /expenses` - Get all expenses
- `POST /expenses` - Submit expense (multipart/form-data)
- `PATCH /expenses/:id/approve` - Approve expense
- `PATCH /expenses/:id/reject` - Reject expense

**Dashboard:**
- `GET /stats/dashboard` - Dashboard statistics
- `GET /stats/reports` - Detailed analytics & reports

**Notifications:**
- `GET /notifications/unread` - Get unread notification count

---

## 🌍 Environment Variables

Create `.env.local` in project root:

```env
# API Configuration
VITE_API_URL=http://localhost:5001/api

# Optional: Deployment-specific variables
# Add as needed for your environment
```

### Available Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api` | Backend API base URL |

---

## 📦 Deployment

### Deploy to Vercel

The project is configured for Vercel deployment:

**Pre-configured:**
- `vercel.json` handles SPA routing
- Clean URLs enabled
- Rewrites all routes to `/index.html`

**Steps:**
1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

**Vercel Configuration:**
```json
{
  "cleanUrls": true,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Deploy to Other Platforms

**Netlify:**
```bash
# Build
npm run build

# Output: dist/ folder
# Deploy dist/ folder
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 🛠 Development

### Available Scripts

```bash
# Start dev server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Workflow

1. Create feature branch from `main`
2. Make changes
3. Test locally
4. Push to GitHub
5. Create Pull Request
6. After approval, merge to `main`

### Code Style

- Use functional components with Hooks
- Follow React best practices
- Keep components focused and reusable
- Use descriptive variable/function names

---

## 📱 Responsive Design

The application is fully responsive:
- **Mobile**: 320px and up
- **Tablet**: 768px and up
- **Desktop**: 1024px and up

CSS uses:
- CSS Grid for layouts
- Flexbox for component alignment
- CSS Variables for theming
- Mobile-first approach

---

## 🐛 Troubleshooting

### Common Issues

**Port 3000 already in use:**
```bash
npm run dev -- --port 3001
```

**API connection errors:**
- Verify backend is running on `http://localhost:5001`
- Check `VITE_API_URL` in `.env.local`
- Ensure CORS is enabled on backend

**Build errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Blank page after login:**
- Check browser console for errors
- Verify JWT token in localStorage
- Check API response in Network tab

---

## 📞 Support & Contact

For issues, questions, or contributions:
- **GitHub**: [B2B-workBeta-app-Frontend](https://github.com/igene-wa18/B2B-workBeta-app-Frontend)
- **Live Demo**: [https://b2-b-work-beta-app-frontend.vercel.app](https://b2-b-work-beta-app-frontend.vercel.app)

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev)
- Powered by [Vite](https://vitejs.dev)
- Charts by [Chart.js](https://www.chartjs.org)
- Deployed on [Vercel](https://vercel.com)

---

## 📈 Roadmap

- [ ] Dark mode toggle
- [ ] Biometric attendance (Mobile)
- [ ] Advanced reporting & analytics
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Mobile app (React Native)
- [ ] Multi-language support (i18n)
- [ ] Performance optimization
- [ ] Accessibility improvements (WCAG 2.1)
- [ ] Unit & integration tests

---

**Last Updated:** June 2026  
**Version:** 0.0.1 (Beta)

For more information about WORKFORCE PRO features and capabilities, please visit the [live demo](https://b2-b-work-beta-app-frontend.vercel.app).
