import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function TodoModal({ onClose }) {
    const { user } = useAuth();
    const canAssign = ['admin', 'dept_head', 'manager'].includes(user?.role);
    const [tab, setTab] = useState('self');

    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('');

    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (canAssign) {
            api.get('/users').then(res => setEmployees(res.data)).catch(() => {});
        }
    }, [canAssign]);

    const handleToggleEmployee = (id) => {
        setSelectedEmployees(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedEmployees.length === employees.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(employees.map(e => e._id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (tab === 'assigned' && selectedEmployees.length === 0) {
            alert('Please select at least one employee');
            return;
        }
        setLoading(true);
        try {
            await api.post('/todos', {
                title, note, date, time,
                type: tab,
                employee_ids: tab === 'assigned' ? selectedEmployees : []
            });
            onClose();
            window.dispatchEvent(new Event('todosUpdated'));
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="todo-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="todo-modal">
                {/* Header */}
                <div className="todo-modal-header">
                    <div className="todo-modal-header-left">
                        <div className="todo-modal-icon">📝</div>
                        <div>
                            <h2 className="todo-modal-title">Create Today's Work</h2>
                            <p className="todo-modal-subtitle">Organize tasks for yourself or assign to your team</p>
                        </div>
                    </div>
                    <button className="todo-modal-close" onClick={onClose}>✕</button>
                </div>

                {/* Tab Switcher */}
                {canAssign && (
                    <div className="todo-modal-tabs">
                        <button
                            className={`todo-modal-tab ${tab === 'self' ? 'active' : ''}`}
                            onClick={() => setTab('self')}
                        >
                            <span className="todo-tab-icon">👤</span>
                            Self ToDo
                        </button>
                        <button
                            className={`todo-modal-tab ${tab === 'assigned' ? 'active' : ''}`}
                            onClick={() => setTab('assigned')}
                        >
                            <span className="todo-tab-icon">👥</span>
                            Assign to Team
                            {selectedEmployees.length > 0 && (
                                <span className="todo-tab-badge">{selectedEmployees.length}</span>
                            )}
                        </button>
                    </div>
                )}

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="todo-modal-body">

                    {/* Task Title */}
                    <div className="todo-form-group">
                        <label className="todo-form-label">
                            <span className="todo-label-icon">✏️</span>
                            Task Title <span className="todo-required">*</span>
                        </label>
                        <input
                            type="text"
                            className="todo-form-input"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            placeholder="e.g., Review the Q3 sales report"
                        />
                    </div>

                    {/* Date & Time Row */}
                    <div className="todo-form-row">
                        <div className="todo-form-group">
                            <label className="todo-form-label">
                                <span className="todo-label-icon">📅</span>
                                Due Date <span className="todo-required">*</span>
                            </label>
                            <input
                                type="date"
                                className="todo-form-input"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="todo-form-group">
                            <label className="todo-form-label">
                                <span className="todo-label-icon">⏰</span>
                                Due Time
                            </label>
                            <input
                                type="time"
                                className="todo-form-input"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Note */}
                    <div className="todo-form-group">
                        <label className="todo-form-label">
                            <span className="todo-label-icon">📋</span>
                            Notes & Instructions
                        </label>
                        <textarea
                            className="todo-form-input todo-form-textarea"
                            rows="4"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder="Add additional context, links, or step-by-step instructions..."
                        ></textarea>
                    </div>

                    {/* Employee Assignment */}
                    {tab === 'assigned' && (
                        <div className="todo-form-group">
                            <div className="todo-assign-header">
                                <label className="todo-form-label">
                                    <span className="todo-label-icon">🎯</span>
                                    Assign To
                                    <span className="todo-assign-count">{selectedEmployees.length} of {employees.length} selected</span>
                                </label>
                                <button type="button" className="todo-select-all-btn" onClick={handleSelectAll}>
                                    {selectedEmployees.length === employees.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>
                            <div className="todo-employee-list">
                                {employees.length === 0 ? (
                                    <p className="todo-empty-msg">No team members found.</p>
                                ) : employees.map(emp => (
                                    <label
                                        key={emp._id}
                                        className={`todo-employee-item ${selectedEmployees.includes(emp._id) ? 'selected' : ''}`}
                                        htmlFor={`emp-${emp._id}`}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`emp-${emp._id}`}
                                            checked={selectedEmployees.includes(emp._id)}
                                            onChange={() => handleToggleEmployee(emp._id)}
                                            className="todo-emp-checkbox"
                                        />
                                        <div className="todo-emp-avatar">
                                            {emp.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="todo-emp-info">
                                            <span className="todo-emp-name">{emp.name}</span>
                                            <span className="todo-emp-role">{emp.role.replace('_', ' ')}</span>
                                        </div>
                                        {selectedEmployees.includes(emp._id) && (
                                            <span className="todo-emp-check">✓</span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="todo-modal-footer">
                        <button type="button" className="todo-btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="todo-btn-submit" disabled={loading}>
                            {loading ? (
                                <><span className="todo-btn-spinner"></span> Creating...</>
                            ) : (
                                <><span>✚</span> Create Task</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
