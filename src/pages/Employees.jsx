import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Topbar';

export default function Employees() {
    const { user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [depts, setDepts] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee', department_id: '', manager_id: '' });
    const [showForm, setShowForm] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const canAdd = ['admin', 'dept_head', 'manager'].includes(user?.role);

    useEffect(() => { loadAll(); }, []);
    const loadAll = () => {
        api.get('/users').then(r => setEmployees(r.data));
        api.get('/departments').then(r => setDepts(r.data)).catch(() => { });
    };

    const submit = async (e) => {
        e.preventDefault();
        await api.post('/users', form);
        setForm({ name: '', email: '', password: '', role: 'employee', department_id: '', manager_id: '' });
        setShowForm(false);
        loadAll();
    };

    const deactivate = async (id) => {
        if (confirm('Deactivate this user?')) {
            await api.delete(`/users/${id}`);
            if (selectedEmployee?._id === id) setSelectedEmployee(null);
            loadAll();
        }
    };

    const roleLabel = { admin: 'Admin', dept_head: 'Dept Head', manager: 'Manager', employee: 'Employee' };

    const filtered = employees.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.department_id?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page">
            <Topbar title={user?.role === 'manager' ? 'My Team' : 'Employees'} />
            <div className="page-body">
                <div className="page-header">
                    {canAdd && <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Employee</button>}
                </div>
                {showForm && (
                    <div className="card">
                        <form onSubmit={submit} className="form-row">
                            <div className="form-group"><label>Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
                            <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} /></div>
                            <div className="form-group"><label>Role</label>
                                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                    <option value="employee">Employee</option><option value="manager">Manager</option>
                                    {user?.role === 'admin' && <option value="dept_head">Dept Head</option>}
                                </select>
                            </div>
                            <div className="form-group"><label>Department</label>
                                <select value={form.department_id} onChange={e => setForm({ ...form, department_id: e.target.value })}>
                                    <option value="">None</option>
                                    {depts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-success">Add</button>
                        </form>
                    </div>
                )}

                {/* Search Bar */}
                <div className="search-bar-container">
                    <input type="text" className="search-input" placeholder="🔍 Search by name, email, or department..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>

                {/* Employee Profile Card */}
                {selectedEmployee && (
                    <div className="card detail-panel employee-profile-panel">
                        <div className="detail-panel-header">
                            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                                <div className="profile-avatar-lg">{selectedEmployee.name?.charAt(0).toUpperCase()}</div>
                                <div>
                                    <h3>{selectedEmployee.name}</h3>
                                    <p className="text-muted">{selectedEmployee.email}</p>
                                </div>
                            </div>
                            <button className="btn btn-sm btn-danger" onClick={() => setSelectedEmployee(null)}>✕ Close</button>
                        </div>
                        <div className="profile-details-grid">
                            <div className="profile-detail-item">
                                <span className="detail-label">Role</span>
                                <span className={`badge badge-role-${selectedEmployee.role}`}>{roleLabel[selectedEmployee.role]}</span>
                            </div>
                            <div className="profile-detail-item">
                                <span className="detail-label">Department</span>
                                <span>{selectedEmployee.department_id?.name || 'Not assigned'}</span>
                            </div>
                            <div className="profile-detail-item">
                                <span className="detail-label">Status</span>
                                <span className={`badge ${selectedEmployee.isActive ? 'badge-present' : 'badge-absent'}`}>{selectedEmployee.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                            <div className="profile-detail-item">
                                <span className="detail-label">Joined</span>
                                <span>{selectedEmployee.joinDate ? new Date(selectedEmployee.joinDate).toLocaleDateString() : '—'}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="card">
                    <table className="data-table">
                        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filtered.map(e => (
                                <tr key={e._id} className="row-clickable" onClick={() => setSelectedEmployee(e)}>
                                    <td>{e.name}</td><td>{e.email}</td>
                                    <td><span className={`badge badge-role-${e.role}`}>{roleLabel[e.role]}</span></td>
                                    <td>{e.department_id?.name || '—'}</td>
                                    <td><span className={`badge ${e.isActive ? 'badge-present' : 'badge-absent'}`}>{e.isActive ? 'Active' : 'Inactive'}</span></td>
                                    <td>{e.isActive && e.role !== 'admin' && <button className="btn btn-sm btn-danger" onClick={(ev) => { ev.stopPropagation(); deactivate(e._id); }}>Deactivate</button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
