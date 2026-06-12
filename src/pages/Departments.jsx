import { useState, useEffect } from 'react';
import api from '../utils/api';
import Topbar from '../components/Topbar';

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: '', head_id: '' });
    const [showForm, setShowForm] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    useEffect(() => { loadDepts(); loadUsers(); }, []);
    const loadDepts = () => api.get('/departments').then(r => setDepartments(r.data));
    const loadUsers = () => api.get('/users').then(r => setUsers(r.data)).catch(() => { });

    const submit = async (e) => {
        e.preventDefault();
        await api.post('/departments', form);
        setForm({ name: '', head_id: '' });
        setShowForm(false);
        loadDepts();
    };

    const deleteDept = async (id) => {
        if (confirm('Delete this department?')) {
            await api.delete(`/departments/${id}`);
            if (selectedDept?._id === id) { setSelectedDept(null); setMembers([]); }
            loadDepts();
        }
    };

    const selectDept = async (dept) => {
        if (selectedDept?._id === dept._id) { setSelectedDept(null); setMembers([]); return; }
        setSelectedDept(dept);
        setLoadingMembers(true);
        try {
            const res = await api.get(`/departments/${dept._id}/members`);
            setMembers(res.data);
        } catch { setMembers([]); }
        setLoadingMembers(false);
    };

    const roleLabel = { admin: 'Admin', dept_head: 'Dept Head', manager: 'Manager', employee: 'Employee' };

    return (
        <div className="page">
            <Topbar title="Departments" />
            <div className="page-body">
                <div className="page-header">
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ New Department</button>
                </div>
                {showForm && (
                    <div className="card">
                        <form onSubmit={submit} className="form-row">
                            <div className="form-group"><label>Department Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                            <div className="form-group"><label>Department Head</label>
                                <select value={form.head_id} onChange={e => setForm({ ...form, head_id: e.target.value })}>
                                    <option value="">None</option>
                                    {users.filter(u => u.role !== 'admin').map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-success">Create</button>
                        </form>
                    </div>
                )}

                {/* Department Members Detail Panel */}
                {selectedDept && (
                    <div className="card detail-panel">
                        <div className="detail-panel-header">
                            <div>
                                <h3>🏢 {selectedDept.name}</h3>
                                <p className="text-muted">Head: {selectedDept.head_id?.name || 'Not assigned'}</p>
                            </div>
                            <button className="btn btn-sm btn-danger" onClick={() => { setSelectedDept(null); setMembers([]); }}>✕ Close</button>
                        </div>
                        {loadingMembers ? (
                            <div className="text-center text-muted" style={{padding: '20px'}}>Loading members...</div>
                        ) : members.length > 0 ? (
                            <table className="data-table">
                                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                                <tbody>
                                    {members.map(m => (
                                        <tr key={m._id}>
                                            <td>{m.name}</td>
                                            <td>{m.email}</td>
                                            <td><span className={`badge badge-role-${m.role}`}>{roleLabel[m.role] || m.role}</span></td>
                                            <td>{m.joinDate ? new Date(m.joinDate).toLocaleDateString() : '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-muted" style={{padding: '12px 0'}}>No members in this department yet.</p>
                        )}
                    </div>
                )}

                <div className="card-grid">
                    {departments.map(d => (
                        <div key={d._id} className={`card dept-card ${selectedDept?._id === d._id ? 'dept-card-active' : ''}`} onClick={() => selectDept(d)} style={{cursor: 'pointer'}}>
                            <h3>{d.name}</h3>
                            <p className="text-muted">Head: {d.head_id?.name || 'Not assigned'}</p>
                            <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); deleteDept(d._id); }}>Delete</button>
                        </div>
                    ))}
                    {departments.length === 0 && <p className="text-muted">No departments yet. Create one!</p>}
                </div>
            </div>
        </div>
    );
}
