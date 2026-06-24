import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = {
    admin: [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/departments', label: 'Departments', icon: '🏢' },
        { path: '/employees', label: 'Employees', icon: '👥' },
        { path: '/attendance', label: 'Attendance', icon: '📋' },
        { path: '/leaves', label: 'Leave Requests', icon: '📅' },
        { path: '/expenses', label: 'Expenses', icon: '💰' },
        { path: '/memos', label: 'Memos', icon: '📝' },

    ],
    dept_head: [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/employees', label: 'Employees', icon: '👥' },
        { path: '/attendance', label: 'Attendance', icon: '📋' },
        { path: '/leaves', label: 'Leave Requests', icon: '📅' },
        { path: '/expenses', label: 'Expenses', icon: '💰' },
        { path: '/memos', label: 'Memos', icon: '📝' },

    ],
    manager: [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/employees', label: 'My Team', icon: '👥' },
        { path: '/attendance', label: 'Attendance', icon: '📋' },
        { path: '/leaves', label: 'Leave Requests', icon: '📅' },
        { path: '/expenses', label: 'Expenses', icon: '💰' },
        { path: '/memos', label: 'Memos', icon: '📝' },
    ],
    employee: [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/attendance', label: 'Attendance', icon: '📋' },
        { path: '/leaves', label: 'Leave Requests', icon: '📅' },
        { path: '/memos', label: 'Memos', icon: '📝' },
    ],
};

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const items = navItems[user?.role] || [];

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <img src="/logo.png" alt="Logo" className="brand-logo" />
                ORGVIBE<span className="brand-pro">PRO</span>
            </div>
            <nav className="sidebar-nav">
                {items.map(item => (
                    <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="sidebar-user">
                <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                <div className="user-info">
                    <span className="user-name">{user?.name}</span>
                    <span className="user-role">{user?.role?.replace('_', ' ')}</span>
                </div>
                <button className="logout-btn" onClick={handleLogout} title="Logout">⏻</button>
            </div>
        </aside>
    );
}
