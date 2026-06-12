import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Topbar';

export default function Attendance() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [records, setRecords] = useState([]);
    const [teamRecords, setTeamRecords] = useState([]);
    const [tab, setTab] = useState(isAdmin ? 'team' : 'my');
    const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [stats, setStats] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const canViewTeam = ['manager', 'dept_head', 'admin'].includes(user?.role);

    useEffect(() => {
        if (!isAdmin) { loadMyAttendance(); loadStats(); }
        if (canViewTeam) loadTeam();
    }, [month, year]);

    const loadMyAttendance = () => {
        api.get(`/attendance/my?month=${month}&year=${year}`).then(r => setRecords(r.data)).catch(() => { });
    };
    const loadStats = () => {
        api.get(`/attendance/stats?month=${month}&year=${year}`).then(r => setStats(r.data)).catch(() => { });
    };
    const loadTeam = () => {
        api.get('/attendance/team').then(r => setTeamRecords(r.data)).catch(() => { });
    };

    const filteredTeam = teamRecords.filter(r =>
        r.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportCSV = () => {
        const data = tab === 'team' ? filteredTeam : records;
        let csv = tab === 'team'
            ? 'Employee,Date,Check In,Check Out,Hours,Status\n'
            : 'Date,Check In,Check Out,Hours,Status\n';
        data.forEach(r => {
            if (tab === 'team') {
                csv += `${r.user.name},${r.attendance.date},${r.attendance.check_in ? new Date(r.attendance.check_in).toLocaleTimeString() : '—'},${r.attendance.check_out ? new Date(r.attendance.check_out).toLocaleTimeString() : '—'},${r.attendance.hours_worked || '—'},${r.attendance.status}\n`;
            } else {
                csv += `${r.date},${r.check_in ? new Date(r.check_in).toLocaleTimeString() : '—'},${r.check_out ? new Date(r.check_out).toLocaleTimeString() : '—'},${r.hours_worked || '—'},${r.status}\n`;
            }
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `attendance_${month}_${year}.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="page">
            <Topbar title="Attendance" />
            <div className="page-body">
                {/* Filters */}
                <div className="card filter-card">
                    <div className="filter-row">
                        <select value={month} onChange={e => setMonth(e.target.value)}>
                            {[...Array(12)].map((_, i) => <option key={i} value={i + 1}>{new Date(2026, i).toLocaleString('default', { month: 'long' })}</option>)}
                        </select>
                        <select value={year} onChange={e => setYear(e.target.value)}>
                            <option value="2025">2025</option><option value="2026">2026</option>
                        </select>
                        {canViewTeam && !isAdmin && (
                            <div className="tab-group">
                                <button className={`tab ${tab === 'my' ? 'active' : ''}`} onClick={() => setTab('my')}>My Attendance</button>
                                <button className={`tab ${tab === 'team' ? 'active' : ''}`} onClick={() => setTab('team')}>Team View</button>
                            </div>
                        )}
                        <button className="btn btn-sm btn-primary" onClick={exportCSV} title="Export CSV">📥 Export CSV</button>
                    </div>
                </div>

                {/* Search bar for team view */}
                {tab === 'team' && (
                    <div className="search-bar-container">
                        <input type="text" className="search-input" placeholder="🔍 Search employee by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                )}

                {/* Stats Summary */}
                {stats && tab === 'my' && (
                    <div className="stats-grid stats-grid-sm">
                        <div className="stat-card stat-green"><div className="stat-value">{stats.present}</div><div className="stat-label">Present</div></div>
                        <div className="stat-card stat-yellow"><div className="stat-value">{stats.late}</div><div className="stat-label">Late</div></div>
                        <div className="stat-card stat-red"><div className="stat-value">{stats.absent}</div><div className="stat-label">Absent</div></div>
                        <div className="stat-card stat-blue"><div className="stat-value">{stats.leave}</div><div className="stat-label">Leave</div></div>
                        <div className="stat-card"><div className="stat-value">{stats.percentage}%</div><div className="stat-label">Attendance %</div></div>
                    </div>
                )}

                {/* Records Table */}
                <div className="card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                {tab === 'team' && <th>Employee</th>}
                                <th>Date</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tab === 'my' ? records.map(r => (
                                <tr key={r._id}>
                                    <td>{r.date}</td>
                                    <td>{r.check_in ? new Date(r.check_in).toLocaleTimeString() : '—'}</td>
                                    <td>{r.check_out ? new Date(r.check_out).toLocaleTimeString() : '—'}</td>
                                    <td>{r.hours_worked || '—'}</td>
                                    <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                                </tr>
                            )) : filteredTeam.map((r, i) => (
                                <tr key={i}>
                                    <td>{r.user.name}</td>
                                    <td>{r.attendance.date}</td>
                                    <td>{r.attendance.check_in ? new Date(r.attendance.check_in).toLocaleTimeString() : '—'}</td>
                                    <td>{r.attendance.check_out ? new Date(r.attendance.check_out).toLocaleTimeString() : '—'}</td>
                                    <td>{r.attendance.hours_worked || '—'}</td>
                                    <td><span className={`badge badge-${r.attendance.status}`}>{r.attendance.status}</span></td>
                                </tr>
                            ))}
                            {(tab === 'my' ? records : filteredTeam).length === 0 && <tr><td colSpan={tab === 'team' ? 6 : 5} className="text-center text-muted">No records found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
