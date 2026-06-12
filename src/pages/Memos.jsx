import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Topbar';

export default function Memos() {
    const { user } = useAuth();
    const [memos, setMemos] = useState([]);
    const [form, setForm] = useState({ title: '', content: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { loadMemos(); }, []);
    const loadMemos = () => api.get('/memos').then(r => setMemos(r.data));

    const submit = async (e) => {
        e.preventDefault();
        await api.post('/memos', form);
        setForm({ title: '', content: '' });
        setShowForm(false);
        loadMemos();
    };

    const deleteMemo = async (id) => {
        await api.delete(`/memos/${id}`);
        loadMemos();
    };

    return (
        <div className="page">
            <Topbar title="Memos & Announcements" />
            <div className="page-body">
                <div className="page-header">
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ New Memo</button>
                </div>
                {showForm && (
                    <div className="card">
                        <form onSubmit={submit}>
                            <div className="form-group"><label>Title</label><input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
                            <div className="form-group"><label>Content</label><textarea rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required /></div>
                            <button type="submit" className="btn btn-success">Post Memo</button>
                        </form>
                    </div>
                )}
                <div className="memo-list">
                    {memos.map(m => (
                        <div key={m._id} className="card memo-card">
                            <div className="memo-header">
                                <h3>{m.title}</h3>
                                <span className="memo-meta">by {m.created_by?.name} ({m.created_by?.role?.replace('_', ' ')}) • {new Date(m.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p>{m.content}</p>
                            {(m.created_by?._id === user?._id || user?.role === 'admin') && (
                                <button className="btn btn-sm btn-danger" onClick={() => deleteMemo(m._id)}>Delete</button>
                            )}
                        </div>
                    ))}
                    {memos.length === 0 && <p className="text-muted text-center">No memos yet. Be the first to post!</p>}
                </div>
            </div>
        </div>
    );
}
