import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Pie, Doughnut, Line, Bar } from 'react-chartjs-2';
import api from '../utils/api';
import Topbar from '../components/Topbar';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

export default function Reports() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/stats/reports')
            .then(res => setData(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

    // Charts Config
    const expensePieData = {
        labels: data?.expensesByCategory.map(item => item._id),
        datasets: [{
            data: data?.expensesByCategory.map(item => item.total),
            backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e'],
            borderWidth: 0,
        }]
    };

    const attendanceDoughnutData = {
        labels: data?.attendanceStats.map(item => item._id.toUpperCase()),
        datasets: [{
            data: data?.attendanceStats.map(item => item.count),
            backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6'],
            borderWidth: 0,
            cutout: '70%',
        }]
    };

    const expenseLineData = {
        labels: data?.monthlyExpenses.map(item => `${item._id.month}/${item._id.year}`),
        datasets: [{
            label: 'Monthly Approved Expenses',
            data: data?.monthlyExpenses.map(item => item.total),
            borderColor: '#6366f1',
            tension: 0.4,
            fill: false,
        }]
    };

    const performanceBarData = {
        labels: data?.topPerformers.map(item => item.name),
        datasets: [{
            label: 'Days Present',
            data: data?.topPerformers.map(item => item.count),
            backgroundColor: '#8b5cf6',
            borderRadius: 8,
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#e8e8f0', font: { family: 'Inter' } } },
        },
        scales: {
            y: { ticks: { color: '#8888aa' }, grid: { color: 'rgba(99, 102, 241, 0.1)' } },
            x: { ticks: { color: '#8888aa' }, grid: { display: false } }
        }
    };

    return (
        <div className="page">
            <Topbar title="Advanced Reports & Analytics" />
            <div className="page-body">
                <div className="stats-grid">
                    <div className="card report-card">
                        <h3>Expenses by Category</h3>
                        <div className="chart-container">
                            <Pie data={expensePieData} options={options} />
                        </div>
                    </div>
                    <div className="card report-card">
                        <h3>Attendance Status Breakdown</h3>
                        <div className="chart-container">
                            <Doughnut data={attendanceDoughnutData} options={options} />
                        </div>
                    </div>
                </div>

                <div className="card report-card">
                    <h3>Monthly Expense Trend</h3>
                    <div className="chart-container-large">
                        <Line data={expenseLineData} options={options} />
                    </div>
                </div>

                <div className="card report-card">
                    <h3>Top Performing Employees (Attendance)</h3>
                    <div className="chart-container-large">
                        <Bar data={performanceBarData} options={options} />
                    </div>
                </div>
            </div>
        </div>
    );
}
