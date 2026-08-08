import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = {
    admin: [
        { path: '/dashboard', label: 'Dashboard', },
        { path: '/todos', label: 'ToDo List' },
        { path: '/departments', label: 'Departments' },
        { path: '/employees', label: 'Employees' },
        { path: '/attendance', label: 'Attendance' },
        { path: '/leaves', label: 'Leave Requests' },
        { path: '/expenses', label: 'Expenses' },
        { path: '/memos', label: 'Memos'},

    ],
    dept_head: [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/todos', label: 'ToDo List' },
        { path: '/employees', label: 'Employees' },
        { path: '/attendance', label: 'Attendance' },
        { path: '/leaves', label: 'Leave Requests'},
        { path: '/expenses', label: 'Expenses'},
        { path: '/memos', label: 'Memos'},

    ],
    manager: [
        { path: '/dashboard', label: 'Dashboard'},
        { path: '/todos', label: 'ToDo List' },
        { path: '/employees', label: 'My Team'},
        { path: '/attendance', label: 'Attendance' },
        { path: '/leaves', label: 'Leave Requests'},
        { path: '/expenses', label: 'Expenses' },
        { path: '/memos', label: 'Memos' },
    ],
    employee: [
        { path: '/dashboard', label: 'Dashboard'},
        { path: '/todos', label: 'ToDo List' },
        { path: '/attendance', label: 'Attendance'},
        { path: '/leaves', label: 'Leave Requests'},
        { path: '/memos', label: 'Memos'},
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
