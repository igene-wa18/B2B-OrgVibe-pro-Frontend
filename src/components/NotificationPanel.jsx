import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function NotificationPanel({ onClose, onNotificationRead }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleNotificationClick = async (notif) => {
        try {
            if (!notif.isRead) {
                await api.patch(`/notifications/${notif._id}/read`);
                if (onNotificationRead) onNotificationRead();
            }
            onClose();
            navigate(notif.link);
        } catch (err) {
            console.error('Error handling notification click:', err);
            // Fallback: navigate anyway
            onClose();
            navigate(notif.link);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            if (onNotificationRead) onNotificationRead();
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'leave': return '📅';
            case 'expense': return '💰';
            case 'memo': return '📢';
            default: return '🔔';
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content notification-panel-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>🔔 Notifications</h2>
                    <div className="modal-header-actions">
                        {notifications.some(n => !n.isRead) && (
                            <button className="btn btn-sm btn-link" onClick={handleMarkAllRead}>
                                Mark all read
                            </button>
                        )}
                        <button className="btn btn-sm btn-danger" onClick={onClose}>✕</button>
                    </div>
                </div>

                <div className="modal-body notification-list">
                    {loading ? (
                        <div className="loading-spinner">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                        <div className="empty-notifications">
                            <span className="empty-icon">🎉</span>
                            <p>You're all caught up! No notifications yet.</p>
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div
                                key={n._id}
                                className={`notification-item ${n.isRead ? 'read' : 'unread'}`}
                                onClick={() => handleNotificationClick(n)}
                            >
                                <span className="notification-icon">{getTypeIcon(n.type)}</span>
                                <div className="notification-details">
                                    <h4 className="notification-title">{n.title}</h4>
                                    <p className="notification-msg">{n.message}</p>
                                    <span className="notification-time">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                {!n.isRead && <span className="unread-dot"></span>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
