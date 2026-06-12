import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import NotificationPanel from './NotificationPanel';

export default function Topbar({ title }) {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [showPanel, setShowPanel] = useState(false);

    const fetchUnreadCount = async () => {
        try {
            const res = await api.get('/notifications/unread');
            setUnreadCount(res.data.count);
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 15000); // Poll every 15s
            return () => clearInterval(interval);
        }
    }, [user]);

    return (
        <header className="topbar">
            <h1 className="topbar-title">{title}</h1>
            <div className="topbar-actions">
                {user && (
                    <div className="bell-container" onClick={() => setShowPanel(true)}>
                        <span className="bell-icon">🔔</span>
                        {unreadCount > 0 && (
                            <span className="bell-badge">{unreadCount}</span>
                        )}
                    </div>
                )}
                <span className="role-badge">{user?.role?.replace('_', ' ').toUpperCase()}</span>
            </div>

            {showPanel && (
                <NotificationPanel 
                    onClose={() => setShowPanel(false)} 
                    onNotificationRead={fetchUnreadCount} 
                />
            )}
        </header>
    );
}

