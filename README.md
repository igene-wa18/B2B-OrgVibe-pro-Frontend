# 🌀 OrgVibe Pro — Frontend

> **Enterprise-grade HR & Workforce Management Platform** built with React, Vite, and Chart.js.

OrgVibe Pro is a modern, role-based B2B organization management application that empowers companies to manage attendance, leaves, expenses, employees, departments, and internal communications — all from a single, beautiful dark-themed dashboard.

**🔗 Live Demo:** [https://b2-b-work-beta-app-frontend.vercel.app](https://b2-b-work-beta-app-frontend.vercel.app)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Demo Credentials](#-demo-credentials)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Usage Guide](#-usage-guide)
- [User Roles & Permissions](#-user-roles--permissions)
- [Architecture](#-architecture)
- [Key Components](#-key-components)
- [API Integration](#-api-integration)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🎯 Overview

**OrgVibe Pro** is an enterprise HR management platform designed to streamline every aspect of workforce operations. It provides a comprehensive suite of tools:

| Module | What it Does |
|--------|-------------|
| 📊 **Dashboard** | Real-time analytics, KPI cards, and visual charts |
| 📋 **Attendance** | Check-in/out tracking, monthly records, team overviews |
| 📅 **Leave Management** | Request, approve, and visualize leaves on a calendar |
| 💰 **Expense Tracking** | Submit expenses with receipt uploads and approval workflow |
| 👥 **Employee Directory** | Searchable database with role and department info |
| 🏢 **Department Management** | Create departments and assign employees |
| 📝 **Memos & Announcements** | Internal communication with real-time notifications |

The platform supports **4 role-based access levels** — Admin, Department Head, Manager, and Employee — with granular permission controls so every user sees exactly what they need.

---

## 📸 Screenshots

### Dashboard — Analytics & KPIs
The Admin dashboard displays live KPI cards (Total Employees, Departments, Present Today, Pending Leaves, Pending Expenses) alongside interactive pie charts and doughnut charts for quick decision-making.

![Dashboard — Admin View](./screenshots/Screenshot%202026-06-24%20132934.png)

---

### Departments — Management View
Admins can view all departments, expand a department to see its members (name, email, role, joined date), create new departments, and delete existing ones.

![Departments Page](./screenshots/Screenshot%202026-06-24%20133017.png)

---

### Employees — Directory & Detail Panel
A searchable employee table lists all users with their role badge, department, status, and join date. Clicking any employee opens a detailed side panel showing their full profile.

![Employees Page](./screenshots/Screenshot%202026-06-24%20133058.png)

---

### Employees — Add New Employee Form
Admins can add a new employee inline by filling in Name, Email, Password, Role, and Department — then clicking **Add**.

![Add Employee Form](./screenshots/Screenshot%202026-06-24%20133121.png)

---

### Attendance — Team Overview
View monthly attendance records for all employees. Filter by month/year, search by name, and export the table to CSV with a single click.

![Attendance Page](./screenshots/Screenshot%202026-06-24%20133157.png)

---

### Leave Requests — List View with Approval
Managers and Admins see all pending leave requests in a table. Clicking a request opens its detail panel with **Approve** and **Reject** buttons.

![Leave Requests — List View](./screenshots/Screenshot%202026-06-24%20133231.png)

---

### Leave Requests — Calendar View
Switch to the calendar view to visualize approved and pending leaves across the entire month. Color-coded entries make it easy to spot scheduling conflicts.

![Leave Requests — Calendar View](./screenshots/Screenshot%202026-06-24%20133403.png)

---

### Expenses — Submission & Approval
Employees submit expenses with a category, amount, description, and optional receipt image. Managers and Admins can view the receipt and approve or reject with one click.

![Expenses Page](./screenshots/Screenshot%202026-06-24%20133436.png)

---

### Memos & Announcements
Post internal memos or company-wide announcements. All users receive real-time notifications when a new memo is published.

![Memos Page](./screenshots/Screenshot%202026-06-24%20133500.png)

---

### Notifications Panel
A bell icon in the top bar shows the unread count. Clicking it opens the notification panel with timestamped alerts for new memos, approvals, and rejections.

![Notifications Panel](./screenshots/Screenshot%202026-06-24%20133524.png)

---

## 🔑 Demo Credentials

Use the following accounts to explore OrgVibe Pro on the live demo without registering:

> **Live Demo URL:** [https://b2-b-work-beta-app-frontend.vercel.app](https://b2-b-work-beta-app-frontend.vercel.app)

### 👑 Admin Account
Has full access to all modules, including Departments, all Employees, all Expenses, and system-wide analytics.

| Field | Value |
|-------|-------|
| **Email** | `hr@smartops.com` |
| **Password** | `Hr@123` |

---

### 👔 Manager Account
Can view and manage their team's attendance, approve/reject leaves, submit expenses, and send memos.

| Field | Value |
|-------|-------|
| **Email** | `manager.tech@smartops.com` |
| **Password** | `Manager@123` |

---

### 👤 Employee Account
Can check in/out, view personal attendance records, submit leave requests, and read memos.

| Field | Value |
|-------|-------|
| **Email** | `sneha@smartops.com` |
| **Password** | `Emp@123` |

> **Tip:** Start with the Admin account to explore every feature. Then log in as Employee to see how the UI adapts — menus, dashboard widgets, and action buttons all change based on the role.

---

## ✨ Features

### Core Modules

| Feature | Description | Access Level |
|---------|-------------|--------------|
| **Dashboard** | KPI cards, expense pie chart, attendance doughnut, monthly trends | All Roles |
| **Attendance Tracking** | Check-in/out, monthly records, attendance stats, CSV export | All Roles |
| **Leave Management** | Request leaves, list/calendar views, approve/reject workflow | All Roles |
| **Expense Tracking** | Submit expenses, upload receipts, approval workflow, CSV export | Manager+ |
| **Employee Management** | View/add/deactivate employees, role assignment | Admin / Dept Head / Manager |
| **Department Management** | Create/delete departments, view member lists | Admin Only |
| **Memos & Announcements** | Post and read internal communications | All Roles |
| **Notifications** | Real-time notification panel with unread count badge | All Roles |

### Technical Highlights

- ✅ **Role-Based Access Control (RBAC)** — menus, routes, and UI elements adapt per role
- ✅ **JWT Authentication** — tokens stored in `localStorage`, auto-attached to all API requests
- ✅ **Protected Routes** — unauthorized access redirects gracefully
- ✅ **Real-time Notifications** — polling every 15 seconds for new alerts
- ✅ **Receipt Uploads** — multipart form upload with cloud storage (Cloudinary)
- ✅ **Interactive Charts** — Pie, Doughnut, Line, Bar via Chart.js
- ✅ **CSV Export** — attendance and expense tables exportable in one click
- ✅ **Responsive Design** — works on mobile, tablet, and desktop
- ✅ **Calendar View** — visual month-based leave overview
- ✅ **Search & Filter** — across employees, attendance, expenses, and leaves

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **UI Framework** | [React](https://react.dev) | 19.2.4 |
| **Build Tool** | [Vite](https://vitejs.dev) | 7.3.1 |
| **Routing** | [React Router DOM](https://reactrouter.com) | 7.13.1 |
| **HTTP Client** | [Axios](https://axios-http.com) | 1.13.6 |
| **Charts** | [Chart.js](https://www.chartjs.org) + [react-chartjs-2](https://react-chartjs-2.js.org) | 4.5.1 / 5.3.1 |
| **Styling** | Vanilla CSS3 with CSS Variables | — |
| **Language** | JavaScript (ES6+) | — |
| **Package Manager** | npm | — |
| **Hosting** | [Vercel](https://vercel.com) | — |

---

## 📁 Project Structure

```
client/
├── public/
│   ├── logo.png                    # OrgVibe Pro brand logo
│   └── vite.svg                    # Vite default icon
│
├── screenshots/                    # App screenshots for README
│
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── Sidebar.jsx             # Role-based navigation sidebar with logo
│   │   ├── Topbar.jsx              # Header — notifications bell + role badge
│   │   ├── ProtectedRoute.jsx      # Role-gated route wrapper
│   │   └── NotificationPanel.jsx   # Slide-out notifications panel
│   │
│   ├── context/
│   │   └── AuthContext.jsx         # Global auth state — login, logout, user
│   │
│   ├── pages/
│   │   ├── Login.jsx               # Sign-in screen with brand logo
│   │   ├── Register.jsx            # Account creation screen
│   │   ├── Dashboard.jsx           # KPI cards + analytics charts
│   │   ├── Attendance.jsx          # Attendance tracking & records
│   │   ├── Leaves.jsx              # Leave requests — list + calendar
│   │   ├── Expenses.jsx            # Expense submission & approval
│   │   ├── Employees.jsx           # Employee directory & management
│   │   ├── Departments.jsx         # Department management (Admin)
│   │   └── Memos.jsx               # Internal memos & announcements
│   │
│   ├── utils/
│   │   └── api.js                  # Axios instance with JWT interceptor
│   │
│   ├── App.jsx                     # Root component — router setup
│   ├── App.css                     # Global dark glassmorphism design system
│   └── main.jsx                    # React DOM entry point
│
├── index.html                      # HTML shell — title, favicon, root div
├── vite.config.js                  # Vite config — dev proxy, React plugin
├── vercel.json                     # Vercel SPA routing config
├── package.json                    # Scripts & dependencies
└── README.md                       # This file
```

---

## 💻 Installation & Setup

Follow these steps to run OrgVibe Pro locally. You will need both the **frontend** (this repo) and the **backend server** running simultaneously.

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** v16 or higher — [Download](https://nodejs.org)
- **npm** v8 or higher (comes with Node.js)
- **Git** — [Download](https://git-scm.com)
- The **OrgVibe Pro backend server** running on `http://localhost:5001`

---

### Step 1 — Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/igene-wa18/B2B-workBeta-app-Frontend.git
cd B2B-workBeta-app-Frontend
```

---

### Step 2 — Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install React, Vite, Axios, React Router, Chart.js, and all other dependencies listed in `package.json`.

---

### Step 3 — Configure Environment Variables

Create a `.env.local` file in the **project root** (same folder as `package.json`):

```bash
# Create the file (Windows)
echo. > .env.local

# Or on macOS/Linux
touch .env.local
```

Then open `.env.local` and add:

```env
# Backend API URL — update if your server runs on a different port
VITE_API_URL=http://localhost:5001/api
```

> **Note:** The Vite dev server automatically proxies `/api` requests to `http://localhost:5001`, so you may not need this variable unless you are connecting to a remote backend.

---

### Step 4 — Start the Development Server

```bash
npm run dev
```

Vite will start the app and print the local URL:

```
  VITE v7.3.1  ready in 300 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will hot-reload automatically whenever you save a file.

---

### Step 5 — Log In

Navigate to [http://localhost:3000/login](http://localhost:3000/login) and sign in using any of the [Demo Credentials](#-demo-credentials) listed above, or register a new account at `/register`.

---

### Step 6 — Build for Production (Optional)

When you're ready to deploy, create an optimized production build:

```bash
npm run build
```

The output is placed in the `dist/` folder. You can preview it locally with:

```bash
npm run preview
```

---

## 🚀 Usage Guide

### Logging In

1. Go to `/login`
2. Enter your **Email** and **Password**
3. Click **Sign In** — you will be redirected to your Dashboard

> First time? Go to `/register` to create a new account. Select your role from the dropdown (for testing purposes).

---

### Navigating the App

- The **sidebar** on the left contains all navigation links. The links shown depend on your role — Admins see everything; Employees see a simplified menu.
- The **top bar** shows the current page title, your role badge, and a notification bell.
- Click the **bell icon** to open the Notifications panel.
- Your **name and avatar** appear at the bottom of the sidebar. Click the power icon (⏻) to log out.

---

### Dashboard

After logging in, you land on the Dashboard:

- **KPI Cards** at the top show: Total Employees, Departments, Present Today, Pending Leaves, Pending Expenses
- **Employees / Managers** see a "Today's Attendance" card with **Check In** and **Check Out** buttons
- **Admins / Dept Heads** see interactive analytics charts:
  - Expenses by Category (Pie Chart)
  - Attendance Status Breakdown (Doughnut Chart)
  - Monthly Expense Trends (Line Chart)
  - Top Performing Employees (Bar Chart)

---

### Attendance

Navigate to **Attendance** from the sidebar:

1. Use the **month/year dropdowns** to select the time period
2. View the table showing each employee's check-in, check-out, hours worked, and status
3. Use the **search bar** to filter by employee name
4. Click **Export CSV** to download the records as a spreadsheet

---

### Leave Requests

Navigate to **Leave Requests**:

1. **Employees** can submit a new leave request by filling in start date, end date, and reason
2. Toggle between **List View** (table of all requests with status badges) and **Calendar View** (visual monthly overview)
3. **Managers / Admins** see a detail panel when clicking a request — click **Approve** or **Reject**
4. Use the **status filter** dropdown to view only Pending, Approved, or Rejected requests

---

### Expenses

Navigate to **Expenses**:

1. Click **+ Submit Expense** and fill in: Amount (₹), Category, Description, and optionally attach a Receipt image
2. The table shows all expenses with their status (Pending / Approved / Rejected)
3. Click any row to expand the detail panel; click **View Receipt / Bill** to preview the uploaded image
4. **Admins / Dept Heads** see **Approve** and **Reject** buttons in the detail panel
5. Click **Export CSV** to download the expense list

---

### Memos

Navigate to **Memos**:

1. Click **+ New Memo** and enter a title and body to post an announcement
2. All users can read memos in reverse-chronological order
3. Admins and the memo author can **Delete** memos
4. New memos trigger a **real-time notification** for all users

---

### ✅ ToDo List & Team Task Tracker *(New Feature)*

OrgVibe Pro now includes a powerful daily task management system that connects managers directly to their team through structured task assignments and real-time progress tracking.

#### 📌 How It Works

**For Managers / Admins:**
- Click the **🗒 Today's Work** button in the top navigation bar to open the task creation modal.
- Choose between two modes:
  - **Self ToDo** — Create a private personal checklist for your own daily work.
  - **Assign to Team** — Create a task with a title, due date, due time, and notes/instructions, then select specific employees to assign it to.
- Assigned tasks appear instantly in the selected employees' **ToDo List** page.

**For Employees:**
- Open the **ToDo List** page from the sidebar to see all tasks assigned to you.
- Each task shows the title, due date/time, and any notes from the manager.
- Tick the checkbox when a task is done — the manager sees the completion update **in real time** (auto-refreshes every 8 seconds).

#### 🗂 Task Sections

| Section | Description |
|---------|-------------|
| **🔥 Today's Work** | Active tasks assigned or scheduled for today |
| **⚠️ Delayed** | Tasks from previous days that were not completed (auto-rolled over) |
| **✅ Today's Completed** | Tasks ticked as done today |
| **📁 History** | All completed tasks from previous days — deletable individually or in bulk |

#### 🔄 Auto-Rollover & History Cleanup
- Any task not completed by end of day **automatically rolls over** into the **Delayed** section the next day, so nothing is ever lost.
- Completed tasks move to **History** and are automatically deleted after **30 days** to keep the workspace clean.
- History can also be manually cleared at any time using the **Clear All History** button.

#### 📊 Team Task Tracker (Manager View)

Managers see a **Team Task Tracker** panel with a live progress bar showing how many employees have completed their assigned tasks. Each employee's completion status is visible in real time with assignee pills and checkmarks.

---

## 👥 User Roles & Permissions

OrgVibe Pro uses **Role-Based Access Control (RBAC)**. Each role unlocks progressively more functionality:

### 👤 Employee
| Permission | Access |
|-----------|--------|
| View personal Dashboard | ✅ |
| Check In / Check Out | ✅ |
| View own Attendance records | ✅ |
| Submit Leave Requests | ✅ |
| View own Leave status | ✅ |
| Read Memos | ✅ |
| View Expenses | ❌ |
| Approve/Reject leaves | ❌ |

---

### 👔 Manager
| Permission | Access |
|-----------|--------|
| All Employee permissions | ✅ |
| View team Attendance | ✅ |
| Approve/Reject team Leave Requests | ✅ |
| Submit Expenses | ✅ |
| View team Memos | ✅ |
| View Employee Directory | ✅ |

---

### 🏢 Department Head
| Permission | Access |
|-----------|--------|
| All Manager permissions | ✅ |
| Manage department Employees | ✅ |
| Approve/Reject Expenses | ✅ |
| View department Analytics | ✅ |

---

### 👑 Admin
| Permission | Access |
|-----------|--------|
| All permissions | ✅ |
| Manage all Employees (add/deactivate) | ✅ |
| Manage all Departments (create/delete) | ✅ |
| View system-wide Analytics & Reports | ✅ |
| Approve/Reject all Expenses and Leaves | ✅ |
| Post and Delete Memos | ✅ |

---

## 🏗 Architecture

### Authentication Flow

```
User enters credentials
        ↓
POST /auth/login → Backend validates → Returns JWT token
        ↓
Token stored in localStorage as "ws_token"
        ↓
AuthContext stores user object (name, email, role, etc.)
        ↓
ProtectedRoute checks token + role → Renders page or redirects
        ↓
Logout clears token + resets AuthContext → Redirects to /login
```

### State Management

| Type | Tool | Used For |
|------|------|----------|
| **Global** | React Context (`AuthContext`) | Auth state — user, token, login, logout |
| **Local** | `useState` | Forms, filters, UI toggles, fetched data |
| **Side Effects** | `useEffect` | API calls on mount, polling for notifications |

### API Communication

All API calls go through `src/utils/api.js`, a pre-configured Axios instance that:

- Automatically attaches the JWT token from `localStorage` to every request header
- Uses `VITE_API_URL` as the base URL (falls back to `/api` for the dev proxy)
- Returns clean error responses for error handling

```javascript
// src/utils/api.js
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api'
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('ws_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
```

---

## 🧩 Key Components

### `Sidebar.jsx`
- Displays the **OrgVibe Pro logo** and brand name
- Renders a **role-specific navigation menu** — different links for Admin vs Employee
- Shows the logged-in user's avatar, name, and role at the bottom
- Provides a **Logout** button (⏻ icon)

### `Topbar.jsx`
- Shows the **current page title**
- Displays a **notification bell** with a red unread-count badge
- Shows the user's **role badge** (e.g., ADMIN, MANAGER)
- Toggles the `NotificationPanel` on click

### `ProtectedRoute.jsx`
- Wraps sensitive routes and checks:
  1. Is the user authenticated?
  2. Does the user's role match the allowed roles list?
- Redirects unauthorized users to `/login` or `/dashboard`

```jsx
// Example usage in App.jsx
<Route path="/departments" element={
    <ProtectedRoute roles={['admin']}>
        <Departments />
    </ProtectedRoute>
} />
```

### `NotificationPanel.jsx`
- Slides in from the top-right corner
- Fetches unread notifications every 15 seconds
- Displays notification type, message, and timestamp
- Closes on the X button or outside click

### `AuthContext.jsx`
- Provides `user`, `loading`, `login()`, `logout()`, and `signup()` to the entire app
- On app load, reads the JWT from `localStorage` and calls `GET /auth/me` to restore the session
- All child components access auth state via the `useAuth()` hook

---

## 🔌 API Integration

### Core Endpoints

**Authentication**
```
POST /auth/login          — Sign in, returns JWT token
POST /auth/signup         — Register new account
GET  /auth/me             — Get current user from token
```

**Dashboard & Reports**
```
GET /stats/dashboard      — KPI cards data
GET /stats/reports        — Charts data (expenses, attendance trends)
```

**Attendance**
```
GET  /attendance/my       — Personal attendance (query: month, year)
GET  /attendance/today    — Today's attendance for all employees
GET  /attendance/team     — Team attendance (Manager+)
GET  /attendance/stats    — Monthly stats (present %, absent, late)
POST /attendance/check-in — Record check-in
POST /attendance/check-out — Record check-out
```

**Leave Requests**
```
GET   /leaves/my              — Personal leaves
GET   /leaves/team            — All team leaves (Manager+)
POST  /leaves                 — Submit new leave request
PATCH /leaves/:id/approve     — Approve a leave
PATCH /leaves/:id/reject      — Reject a leave
```

**Expenses**
```
GET   /expenses               — All expenses (filtered by role)
POST  /expenses               — Submit expense (multipart/form-data for receipt)
PATCH /expenses/:id/approve   — Approve expense
PATCH /expenses/:id/reject    — Reject expense
```

**Employees & Departments**
```
GET  /employees               — Employee directory
POST /employees               — Add new employee (Admin)
GET  /departments             — All departments with member lists
POST /departments             — Create department (Admin)
```

**Notifications**
```
GET /notifications/unread     — Unread notification count + list
```

### Vite Dev Proxy

The `vite.config.js` proxies all `/api` and `/uploads` requests to the backend, so you never need to worry about CORS in development:

```javascript
// vite.config.js
server: {
    port: 3000,
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
}
```

---

## 🌍 Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API base URL (required if backend is not on localhost:5001)
VITE_API_URL=http://localhost:5001/api
```

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api` | Full URL to the backend API. Overrides the Vite proxy in production. |

> **Important:** All Vite environment variables must be prefixed with `VITE_` to be accessible in the browser.

---

## 📦 Deployment

### Deploy to Vercel (Recommended)

OrgVibe Pro is pre-configured for zero-config Vercel deployment:

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Add the environment variable in the Vercel dashboard:
   - `VITE_API_URL` = `https://your-backend-url.com/api`
4. Click **Deploy** — Vercel handles the build automatically

The `vercel.json` ensures all routes are served by `index.html` (required for React SPA routing):

```json
{
  "cleanUrls": true,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### Deploy to Netlify

```bash
# 1. Build the app
npm run build

# 2. Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# 3. Deploy the dist/ folder
netlify deploy --prod --dir=dist
```

Create a `_redirects` file in the `public/` folder for SPA routing:
```
/*    /index.html   200
```

---

### Deploy with Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🐛 Troubleshooting

### App won't start — "Port 3000 already in use"
```bash
# Run on a different port
npm run dev -- --port 3001
```

---

### API calls failing — Network Error or 404
1. Make sure the backend server is running on `http://localhost:5001`
2. Check your `.env.local` file has the correct `VITE_API_URL`
3. Verify CORS is enabled on the backend
4. Open browser DevTools → **Network** tab → inspect the failing request

---

### Blank page after login
1. Open **DevTools Console** — look for JavaScript errors
2. Check **DevTools → Application → Local Storage** for a `ws_token` entry
3. Try logging out and back in — the token may have expired
4. Clear browser cache and reload

---

### Build errors — missing modules
```bash
# Clear cache and reinstall all dependencies
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

### Charts not rendering
- Make sure `Chart.js` and `react-chartjs-2` are installed: `npm install chart.js react-chartjs-2`
- Verify the backend `/stats/reports` endpoint is returning data

---

## 📈 Roadmap

- [ ] Dark/Light mode toggle
- [ ] Biometric attendance support (Mobile)
- [ ] Advanced reporting & custom date ranges
- [ ] Push notifications (Web Push API)
- [ ] SMS alerts integration
- [ ] Mobile app (React Native)
- [ ] Multi-language support (i18n)
- [ ] Accessibility improvements (WCAG 2.1)
- [ ] Unit & integration tests (Vitest + Testing Library)
- [ ] Two-factor authentication (2FA)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- UI built with [React](https://react.dev)
- Blazing-fast builds by [Vite](https://vitejs.dev)
- Beautiful charts by [Chart.js](https://www.chartjs.org)
- Deployed effortlessly on [Vercel](https://vercel.com)

---

**Last Updated:** June 2026 &nbsp;|&nbsp; **Version:** 1.0.0 &nbsp;|&nbsp; **Brand:** OrgVibe Pro

For questions, bug reports, or feature requests, open an issue on the [GitHub repository](https://github.com/igene-wa18/B2B-workBeta-app-Frontend).
