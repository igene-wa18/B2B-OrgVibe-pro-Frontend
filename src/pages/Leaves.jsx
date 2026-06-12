import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Topbar';

export default function Leaves() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [myLeaves, setMyLeaves] = useState([]);
    const [teamLeaves, setTeamLeaves] = useState([]);
    const [tab, setTab] = useState(isAdmin ? 'team' : 'my');
    const [form, setForm] = useState({ start_date: '', end_date: '', reason: '' });
    const [showForm, setShowForm] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewType, setViewType] = useState('list'); // 'list' | 'calendar'
    const [calendarDate, setCalendarDate] = useState(new Date());

    const canApprove = ['manager', 'dept_head', 'admin'].includes(user?.role);

    useEffect(() => {
        if (!isAdmin) loadMyLeaves();
        if (canApprove) loadTeamLeaves();
    }, []);

    const loadMyLeaves = () => api.get('/leaves/my').then(r => setMyLeaves(r.data));
    const loadTeamLeaves = () => api.get('/leaves/team').then(r => setTeamLeaves(r.data));

    const submitLeave = async (e) => {
        e.preventDefault();
        await api.post('/leaves', form);
        setShowForm(false);
        setForm({ start_date: '', end_date: '', reason: '' });
        loadMyLeaves();
    };

    const handleAction = async (id, action) => {
        await api.patch(`/leaves/${id}/${action}`);
        setSelectedLeave(null);
        loadTeamLeaves();
    };

    const filteredTeamLeaves = teamLeaves
        .filter(l => statusFilter === 'all' || l.status === statusFilter)
        .filter(l => l.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const renderCalendar = () => {
        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];

        // Empty padding cells for start of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Calendar day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const leavesOnDay = (tab === 'my' ? myLeaves : filteredTeamLeaves).filter(l => {
                const start = new Date(l.start_date + 'T00:00:00');
                const end = new Date(l.end_date + 'T00:00:00');
                const current = new Date(year, month, day);
                return current >= start && current <= end;
            });

            days.push(
                <div key={`day-${day}`} className="calendar-day">
                    <span className="day-number">{day}</span>
                    <div className="calendar-leaves-container">
                        {leavesOnDay.map(l => (
                            <div 
                                key={l._id} 
                                className={`calendar-leave-badge badge-${l.status}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (tab === 'team' && canApprove) {
                                        setSelectedLeave(l);
                                    }
                                }}
                                title={`${l.user_id?.name || 'My'} Leave: ${l.reason}`}
                            >
                                {tab === 'team' ? l.user_id?.name : 'Leave'}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        return (
            <div className="calendar-view-container card">
                <div className="calendar-header">
                    <button className="btn btn-sm btn-secondary" onClick={() => setCalendarDate(new Date(year, month - 1, 1))}>◀ Prev</button>
                    <h3>{monthNames[month]} {year}</h3>
                    <button className="btn btn-sm btn-secondary" onClick={() => setCalendarDate(new Date(year, month + 1, 1))}>Next ▶</button>
                </div>
                <div className="calendar-grid">
                    {weekdays.map(d => <div key={d} className="calendar-weekday">{d}</div>)}
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div className="page">
            <Topbar title="Leave Requests" />
            <div className="page-body">
                <div className="page-header">
                    <div className="header-left" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {canApprove && !isAdmin && (
                            <div className="tab-group">
                                <button className={`tab ${tab === 'my' ? 'active' : ''}`} onClick={() => { setTab('my'); setSelectedLeave(null); }}>My Leaves</button>
                                <button className={`tab ${tab === 'team' ? 'active' : ''}`} onClick={() => setTab('team')}>Team Requests</button>
                            </div>
                        )}
                        {tab === 'my' && !isAdmin && <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Request Leave</button>}
                    </div>
                    
                    <div className="tab-group">
                        <button className={`tab ${viewType === 'list' ? 'active' : ''}`} onClick={() => setViewType('list')}>📋 List</button>
                        <button className={`tab ${viewType === 'calendar' ? 'active' : ''}`} onClick={() => setViewType('calendar')}>📅 Calendar</button>
                    </div>
                </div>

                {showForm && (
                    <div className="card">
                        <form onSubmit={submitLeave}>
                            <div className="form-row">
                                <div className="form-group"><label>Start Date</label><input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} required /></div>
                                <div className="form-group"><label>End Date</label><input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} required /></div>
                            </div>
                            <div className="form-group" style={{marginTop: '8px'}}>
                                <label>Reason for Leave</label>
                                <textarea rows="6" className="leave-reason-textarea" placeholder="Please describe in detail why you are requesting leave. Include any relevant information your manager might need to know..." value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required />
                            </div>
                            <button type="submit" className="btn btn-success" style={{marginTop: '8px'}}>Submit Request</button>
                        </form>
                    </div>
                )}

                {/* Search & Filter for team view */}
                {tab === 'team' && (
                    <div className="search-filter-row">
                        <input type="text" className="search-input" placeholder="🔍 Search by employee name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                )}

                {/* Selected Leave Detail Panel */}
                {selectedLeave && (
                    <div className="card detail-panel">
                        <div className="detail-panel-header">
                            <div>
                                <h3>📋 Leave Request — {selectedLeave.user_id?.name || 'Employee'}</h3>
                                <p className="text-muted">{selectedLeave.start_date} → {selectedLeave.end_date}</p>
                            </div>
                            <button className="btn btn-sm btn-danger" onClick={() => setSelectedLeave(null)}>✕ Close</button>
                        </div>
                        <div className="detail-panel-body">
                            <div className="detail-reason">
                                <label className="detail-label">Reason</label>
                                <p className="detail-text">{selectedLeave.reason}</p>
                            </div>
                            <div className="detail-meta">
                                <span className={`badge badge-${selectedLeave.status}`}>{selectedLeave.status}</span>
                            </div>
                        </div>
                        {selectedLeave.status === 'pending' && (
                            <div className="detail-panel-actions">
                                <button className="btn btn-success" onClick={() => handleAction(selectedLeave._id, 'approve')}>✓ Approve</button>
                                <button className="btn btn-danger" onClick={() => handleAction(selectedLeave._id, 'reject')}>✗ Reject</button>
                            </div>
                        )}
                    </div>
                )}

                {viewType === 'list' ? (
                    <div className="card">
                        <table className="data-table">
                            <thead><tr>{tab === 'team' && <th>Employee</th>}<th>Start</th><th>End</th><th>Reason</th><th>Status</th>{tab === 'team' && <th>Actions</th>}</tr></thead>
                            <tbody>
                                {(tab === 'my' ? myLeaves : filteredTeamLeaves).map(l => (
                                    <tr key={l._id} className={`${l.status === 'pending' ? 'row-pending' : ''} ${tab === 'team' ? 'row-clickable' : ''}`}
                                        onClick={() => { if (tab === 'team' && canApprove) setSelectedLeave(l); }}>
                                        {tab === 'team' && <td>{l.user_id?.name || '—'}</td>}
                                        <td>{l.start_date}</td><td>{l.end_date}</td>
                                        <td className="reason-cell">{l.reason.length > 60 ? l.reason.substring(0, 60) + '...' : l.reason}</td>
                                        <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
                                        {tab === 'team' && <td>
                                            {l.status === 'pending' && <>
                                                <button className="btn btn-sm btn-success" onClick={(e) => { e.stopPropagation(); handleAction(l._id, 'approve'); }}>✓</button>
                                                <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleAction(l._id, 'reject'); }}>✗</button>
                                            </>}
                                        </td>}
                                    </tr>
                                ))}
                                {(tab === 'my' ? myLeaves : filteredTeamLeaves).length === 0 && <tr><td colSpan={6} className="text-center text-muted">No leave requests</td></tr>}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    renderCalendar()
                )}
            </div>
        </div>
    );
}
