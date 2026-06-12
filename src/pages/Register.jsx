import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(form);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-screen">
            <div className="auth-bg"><div className="orb orb-1"></div><div className="orb orb-2"></div><div className="orb orb-3"></div></div>
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">✦</div>
WORKFORCE<span>PRO</span>
                    <p>Create your account</p>
                </div>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                    </div>
                    <div className="form-group">
                        <label>Role (for testing)</label>
                        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="form-control">
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                            <option value="dept_head">Dept Head</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary btn-full">Create Account</button>
                </form>
                <p className="auth-footer">Already have an account? <Link to="/login">Sign In</Link></p>
            </div>
        </div>
    );
}
