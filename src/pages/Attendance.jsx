import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Topbar';

export default function Attendance() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const canViewTeam = ['manager', 'dept_head', 'admin'].includes(user?.role);

    const [records, setRecords] = useState([]);
    const [teamRecords, setTeamRecords] = useState([]);
    const [tab, setTab] = useState(canViewTeam ? 'team' : 'my');
    const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [stats, setStats] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isAdmin) { loadMyAttendance(); loadStats(); }
        if (canViewTeam) {
            loadTeam();
            // Real-time polling every 8 seconds for live attendance updates
            const interval = setInterval(loadTeam, 8000);
            return () => clearInterval(interval);
        }
    }, [month, year, tab]);

    const loadMyAttendance = () => {
        api.get(`/attendance/my?month=${month}&year=${year}`).then(r => setRecords(r.data)).catch(() => { });
    };
    const loadStats = () => {
        api.get(`/attendance/stats?month=${month}&year=${year}`).then(r => setStats(r.data)).catch(() => { });
    };
    const loadTeam = () => {
        api.get(`/attendance/team?month=${month}&year=${year}`).then(r => setTeamRecords(r.data)).catch(() => { });
    };

    const filteredTeam = teamRecords.filter(r =>
        (r.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportCSV = () => {
        const data = tab === 'team' ? filteredTeam : records;
        let csv = tab === 'team'
            ? 'Employee,Date,Check In,Check Out,Hours,Status\n'
            : 'Date,Check In,Check Out,Hours,Status\n';
        data.forEach(r => {
            if (tab === 'team') {
                const att = r.attendance || {};
                csv += `${r.user?.name || 'Unknown'},${att.date || '—'},${att.check_in ? new Date(att.check_in).toLocaleTimeString() : '—'},${att.check_out ? new Date(att.check_out).toLocaleTimeString() : '—'},${att.hours_worked || '—'},${att.status || '—'}\n`;
            } else {
                csv += `${r.date || '—'},${r.check_in ? new Date(r.check_in).toLocaleTimeString() : '—'},${r.check_out ? new Date(r.check_out).toLocaleTimeString() : '—'},${r.hours_worked || '—'},${r.status || '—'}\n`;
            }
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `attendance_${month}_${year}.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    const teamStats = tab === 'team' && teamRecords.length > 0 ? {
        present: teamRecords.filter(r => ['present', 'half_day'].includes(r.attendance?.status?.toLowerCase())).length,
        late: teamRecords.filter(r => r.attendance?.status?.toLowerCase() === 'late').length,
        absent: teamRecords.filter(r => r.attendance?.status?.toLowerCase() === 'absent').length,
        leave: teamRecords.filter(r => r.attendance?.status?.toLowerCase() === 'leave').length,
        total: teamRecords.length,
        percentage: Math.round(((teamRecords.filter(r => ['present', 'late', 'half_day'].includes(r.attendance?.status?.toLowerCase())).length) / teamRecords.length) * 100)
    } : null;

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
                            {['2024', '2025', '2026', '2027'].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        {canViewTeam && !isAdmin && (
                            <div className="tab-group">
                                <button className={`tab ${tab === 'team' ? 'active' : ''}`} onClick={() => setTab('team')}>Team View</button>
                                <button className={`tab ${tab === 'my' ? 'active' : ''}`} onClick={() => setTab('my')}>My Attendance</button>
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

                {/* Stats Summary for Personal View */}
                {stats && tab === 'my' && (
                    <div className="stats-grid stats-grid-sm">
                        <div className="stat-card stat-green"><div className="stat-value">{stats.present}</div><div className="stat-label">Present</div></div>
                        <div className="stat-card stat-yellow"><div className="stat-value">{stats.late}</div><div className="stat-label">Late</div></div>
                        <div className="stat-card stat-red"><div className="stat-value">{stats.absent}</div><div className="stat-label">Absent</div></div>
                        <div className="stat-card stat-blue"><div className="stat-value">{stats.leave}</div><div className="stat-label">Leave</div></div>
                        <div className="stat-card"><div className="stat-value">{stats.percentage}%</div><div className="stat-label">Attendance %</div></div>
                    </div>
                )}

                {/* Stats Summary for Team View */}
                {teamStats && tab === 'team' && (
                    <div className="stats-grid stats-grid-sm">
                        <div className="stat-card stat-green"><div className="stat-value">{teamStats.present}</div><div className="stat-label">Present Records</div></div>
                        <div className="stat-card stat-yellow"><div className="stat-value">{teamStats.late}</div><div className="stat-label">Late Records</div></div>
                        <div className="stat-card stat-red"><div className="stat-value">{teamStats.absent}</div><div className="stat-label">Absent Records</div></div>
                        <div className="stat-card stat-blue"><div className="stat-value">{teamStats.leave}</div><div className="stat-label">Leave Records</div></div>
                        <div className="stat-card"><div className="stat-value">{teamStats.percentage}%</div><div className="stat-label">Team Rate</div></div>
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
                            )) : filteredTeam.map((r, i) => {
                                const att = r.attendance || {};
                                return (
                                    <tr key={att._id || i}>
                                        <td>{r.user?.name || 'Unknown'}</td>
                                        <td>{att.date || '—'}</td>
                                        <td>{att.check_in ? new Date(att.check_in).toLocaleTimeString() : '—'}</td>
                                        <td>{att.check_out ? new Date(att.check_out).toLocaleTimeString() : '—'}</td>
                                        <td>{att.hours_worked || '—'}</td>
                                        <td><span className={`badge badge-${att.status || 'absent'}`}>{att.status || 'absent'}</span></td>
                                    </tr>
                                );
                            })}
                            {(tab === 'my' ? records : filteredTeam).length === 0 && <tr><td colSpan={tab === 'team' ? 6 : 5} className="text-center text-muted">No records found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
