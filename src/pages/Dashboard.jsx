import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Pie, Doughnut, Line, Bar } from 'react-chartjs-2';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Topbar';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [todayAtt, setTodayAtt] = useState(null);
    const [reportsData, setReportsData] = useState(null);

    const canViewAnalytics = ['admin', 'dept_head'].includes(user?.role);

    useEffect(() => {
        api.get('/stats/dashboard').then(r => setStats(r.data)).catch(() => { });
        if (user?.role !== 'admin') {
            api.get('/attendance/today').then(r => setTodayAtt(r.data)).catch(() => { });
        }
        if (canViewAnalytics) {
            api.get('/stats/reports').then(r => setReportsData(r.data)).catch(() => { });
        }
    }, [user]);

    const checkIn = async () => {
        try {
            const res = await api.post('/attendance/check-in');
            setTodayAtt(res.data);
        } catch (err) { alert(err.response?.data?.message || 'Check-in failed'); }
    };
    const checkOut = async () => {
        try {
            const res = await api.post('/attendance/check-out');
            setTodayAtt(res.data);
        } catch (err) { alert(err.response?.data?.message || 'Check-out failed'); }
    };

    // Charts Config
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#e8e8f0', font: { family: 'Inter' } } },
        },
        scales: {
            y: { ticks: { color: '#8888aa' }, grid: { color: 'rgba(99, 102, 241, 0.1)' } },
            x: { ticks: { color: '#8888aa' }, grid: { display: false } }
        }
    };

    const pieOnlyOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#e8e8f0', font: { family: 'Inter' } } },
        }
    };

    const expensePieData = reportsData ? {
        labels: reportsData.expensesByCategory.map(item => item._id),
        datasets: [{
            data: reportsData.expensesByCategory.map(item => item.total),
            backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e'],
            borderWidth: 0,
        }]
    } : null;

    const attendanceDoughnutData = reportsData ? {
        labels: reportsData.attendanceStats.map(item => item._id.toUpperCase()),
        datasets: [{
            data: reportsData.attendanceStats.map(item => item.count),
            backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6'],
            borderWidth: 0,
            cutout: '70%',
        }]
    } : null;

    const expenseLineData = reportsData ? {
        labels: reportsData.monthlyExpenses.map(item => `${item._id.month}/${item._id.year}`),
        datasets: [{
            label: 'Monthly Approved Expenses',
            data: reportsData.monthlyExpenses.map(item => item.total),
            borderColor: '#6366f1',
            tension: 0.4,
            fill: false,
        }]
    } : null;

    const performanceBarData = reportsData ? {
        labels: reportsData.topPerformers.map(item => item.name),
        datasets: [{
            label: 'Days Present',
            data: reportsData.topPerformers.map(item => item.count),
            backgroundColor: '#8b5cf6',
            borderRadius: 8,
        }]
    } : null;

    return (
        <div className="page">
            <Topbar title="Dashboard" />
            <div className="page-body">
                {/* Attendance Card for non-admin */}
                {user?.role !== 'admin' && (
                    <div className="card attendance-card">
                        <h3>Today's Attendance</h3>
                        {!todayAtt || !todayAtt.check_in ? (
                            <button className="btn btn-success btn-lg" onClick={checkIn}> Check In</button>
                        ) : !todayAtt.check_out ? (
                            <div>
                                <p className="text-success">Checked in at {new Date(todayAtt.check_in).toLocaleTimeString()}</p>
                                <button className="btn btn-warning btn-lg" onClick={checkOut}>Check Out</button>
                            </div>
                        ) : (
                            <div>
                                <p className="text-success">Checked in: {new Date(todayAtt.check_in).toLocaleTimeString()}</p>
                                <p className="text-muted">Checked out: {new Date(todayAtt.check_out).toLocaleTimeString()}</p>
                                <p className="text-info">⏱ Hours: {todayAtt.hours_worked}h</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Stats Cards */}
                {stats && (
                    <div className="stats-grid">
                        <div className="stat-card"><div className="stat-icon"></div><div className="stat-value">{stats.totalUsers}</div><div className="stat-label">Total Employees</div></div>
                        <div className="stat-card"><div className="stat-icon"></div><div className="stat-value">{stats.totalDepts}</div><div className="stat-label">Departments</div></div>
                        <div className="stat-card"><div className="stat-icon"></div><div className="stat-value">{stats.presentToday}</div><div className="stat-label">Present Today</div></div>
                        <div className="stat-card"><div className="stat-icon"></div><div className="stat-value">{stats.pendingLeaves}</div><div className="stat-label">Pending Leaves</div></div>
                        <div className="stat-card"><div className="stat-icon"></div><div className="stat-value">{stats.pendingExpenses}</div><div className="stat-label">Pending Expenses</div></div>
                    </div>
                )}

                {/* Analytics Section — Admin & Dept Head only */}
                {canViewAnalytics && reportsData && (
                    <div className="analytics-section">
                        <h2 className="section-title">📈 Analytics & Reports</h2>
                        <div className="stats-grid">
                            <div className="card report-card">
                                <h3>Expenses by Category</h3>
                                <div className="chart-container">
                                    {expensePieData && <Pie data={expensePieData} options={pieOnlyOptions} />}
                                </div>
                            </div>
                            <div className="card report-card">
                                <h3>Attendance Status Breakdown</h3>
                                <div className="chart-container">
                                    {attendanceDoughnutData && <Doughnut data={attendanceDoughnutData} options={pieOnlyOptions} />}
                                </div>
                            </div>
                        </div>

                        <div className="card report-card">
                            <h3>Monthly Expense Trend</h3>
                            <div className="chart-container-large">
                                {expenseLineData && <Line data={expenseLineData} options={chartOptions} />}
                            </div>
                        </div>

                        <div className="card report-card">
                            <h3>Top Performing Employees (Attendance)</h3>
                            <div className="chart-container-large">
                                {performanceBarData && <Bar data={performanceBarData} options={chartOptions} />}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
