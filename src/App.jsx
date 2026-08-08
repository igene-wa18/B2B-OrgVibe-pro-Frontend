import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Expenses from './pages/Expenses';
import Departments from './pages/Departments';
import Employees from './pages/Employees';
import Memos from './pages/Memos';
import Todos from './pages/Todos';

import './App.css';

function AppLayout() {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
    if (!user) return <Navigate to="/login" />;
    return (
        <div className="app-shell">
            <Sidebar />
            <main className="main-content">
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/todos" element={<Todos />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/leaves" element={<Leaves />} />
                    <Route path="/expenses" element={<ProtectedRoute roles={['manager', 'dept_head', 'admin']}><Expenses /></ProtectedRoute>} />
                    <Route path="/departments" element={<ProtectedRoute roles={['admin']}><Departments /></ProtectedRoute>} />
                    <Route path="/employees" element={<ProtectedRoute roles={['admin', 'dept_head', 'manager']}><Employees /></ProtectedRoute>} />
                    <Route path="/memos" element={<Memos />} />

                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/*" element={<AppLayout />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
