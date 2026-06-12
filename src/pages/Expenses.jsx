import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Topbar';

export default function Expenses() {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState({ amount: '', category: '', description: '', receipt: null });
    const [showForm, setShowForm] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const canSubmit = ['manager', 'employee'].includes(user?.role);
    const canApprove = ['dept_head', 'admin'].includes(user?.role);
    const canViewDetail = ['manager', 'dept_head', 'admin'].includes(user?.role);

    useEffect(() => { loadExpenses(); }, []);
    const loadExpenses = () => api.get('/expenses').then(r => setExpenses(r.data));

    const submitExpense = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('amount', Number(form.amount));
        formData.append('category', form.category);
        formData.append('description', form.description);
        if (form.receipt) {
            formData.append('receipt', form.receipt);
        }

        await api.post('/expenses', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        setShowForm(false);
        setForm({ amount: '', category: '', description: '', receipt: null });
        loadExpenses();
    };

    const handleAction = async (id, action) => {
        await api.patch(`/expenses/${id}/${action}`);
        setSelectedExpense(null);
        loadExpenses();
    };

    const filtered = expenses
        .filter(e => statusFilter === 'all' || e.status === statusFilter)
        .filter(e =>
            (e.manager_id?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (e.description || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

    const exportCSV = () => {
        let csv = 'Submitted By,Amount,Category,Description,Status\n';
        filtered.forEach(e => {
            csv += `${e.manager_id?.name || '—'},${e.amount},${e.category},"${e.description}",${e.status}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'expenses_export.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="page">
            <Topbar title="Expenses" />
            <div className="page-body">
                <div className="page-header">
                    {canSubmit && <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Submit Expense</button>}
                    <button className="btn btn-sm btn-primary" onClick={exportCSV}>📥 Export CSV</button>
                </div>

                {showForm && (
                    <div className="card">
                        <form onSubmit={submitExpense} className="form-row">
                            <div className="form-group"><label>Amount (₹)</label><input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required /></div>
                            <div className="form-group"><label>Category</label>
                                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                                    <option value="">Select</option><option>Office Supplies</option><option>Travel</option><option>Equipment</option><option>Software</option><option>Other</option>
                                </select>
                            </div>
                            <div className="form-group form-group-wide"><label>Description</label><input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
                            <div className="form-group form-group-wide">
                                <label>Bill / Receipt (Optional)</label>
                                <input type="file" onChange={e => setForm({ ...form, receipt: e.target.files[0] })} />
                            </div>
                            <button type="submit" className="btn btn-success">Submit</button>
                        </form>
                    </div>
                )}

                {/* Search & Filter */}
                <div className="search-filter-row">
                    <input type="text" className="search-input" placeholder="🔍 Search by name or description..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Selected Expense Detail Panel */}
                {selectedExpense && (
                    <div className="card detail-panel">
                        <div className="detail-panel-header">
                            <div>
                                <h3>💰 Expense Request — {selectedExpense.manager_id?.name || 'Employee'}</h3>
                                <p className="text-muted">Category: {selectedExpense.category} · Amount: ₹{selectedExpense.amount}</p>
                            </div>
                            <button className="btn btn-sm btn-danger" onClick={() => setSelectedExpense(null)}>✕ Close</button>
                        </div>
                        <div className="detail-panel-body">
                            <div className="detail-reason">
                                <label className="detail-label">Description</label>
                                <p className="detail-text">{selectedExpense.description}</p>
                            </div>
                            {selectedExpense.receipt_url && (
                                <div style={{marginTop: '12px'}}>
                                    <a href={selectedExpense.receipt_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">📎 View Receipt / Bill</a>
                                </div>
                            )}
                            <div className="detail-meta">
                                <span className={`badge badge-${selectedExpense.status}`}>{selectedExpense.status}</span>
                            </div>
                        </div>
                        {selectedExpense.status === 'pending' && (
                            <div className="detail-panel-actions">
                                <button className="btn btn-success" onClick={() => handleAction(selectedExpense._id, 'approve')}>✓ Approve</button>
                                <button className="btn btn-danger" onClick={() => handleAction(selectedExpense._id, 'reject')}>✗ Reject</button>
                            </div>
                        )}
                    </div>
                )}

                <div className="card">
                    <table className="data-table">
                        <thead><tr><th>Submitted By</th><th>Amount</th><th>Category</th><th>Description</th><th>Status</th>{canApprove && <th>Actions</th>}</tr></thead>
                        <tbody>
                            {filtered.map(e => (
                                <tr key={e._id} className={`${e.status === 'pending' ? 'row-pending' : ''} ${canViewDetail ? 'row-clickable' : ''}`}
                                    onClick={() => { if (canViewDetail) setSelectedExpense(e); }}>
                                    <td>{e.manager_id?.name || '—'}</td><td>₹{e.amount}</td><td>{e.category}</td>
                                    <td>
                                        <div>{e.description.length > 50 ? e.description.substring(0, 50) + '...' : e.description}</div>
                                        {e.receipt_url && (
                                            <a href={e.receipt_url} target="_blank" rel="noreferrer" className="text-primary text-sm font-semibold" style={{display: 'inline-block', marginTop: '4px'}} onClick={ev => ev.stopPropagation()}>
                                                📎 View Bill
                                            </a>
                                        )}
                                    </td>
                                    <td><span className={`badge badge-${e.status}`}>{e.status}</span></td>
                                    {canApprove && <td>
                                        {e.status === 'pending' && <>
                                            <button className="btn btn-sm btn-success" onClick={(ev) => { ev.stopPropagation(); handleAction(e._id, 'approve'); }}>✓</button>
                                            <button className="btn btn-sm btn-danger" onClick={(ev) => { ev.stopPropagation(); handleAction(e._id, 'reject'); }}>✗</button>
                                        </>}
                                    </td>}
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan={6} className="text-center text-muted">No expenses</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
