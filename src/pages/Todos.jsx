import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Topbar';

const POLL_INTERVAL = 8000;

export default function Todos() {
    const { user } = useAuth();
    const canAssign = ['admin', 'dept_head', 'manager'].includes(user?.role);
    const [view, setView] = useState('my');
    const [data, setData] = useState({ delayed: [], today: [], todayCompleted: [], history: [] });
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState({});
    const [clearingHistory, setClearingHistory] = useState(false);
    const pollRef = useRef(null);

    const fetchTodos = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await api.get(`/todos?view=${view}`);
            setData(res.data);
        } catch (err) {
            console.error('Error fetching todos:', err);
        } finally {
            if (!silent) setLoading(false);
        }
    }, [view]);

    useEffect(() => {
        fetchTodos();
        const handleTodosUpdated = () => fetchTodos();
        window.addEventListener('todosUpdated', handleTodosUpdated);
        if (view === 'created' && canAssign) {
            pollRef.current = setInterval(() => fetchTodos(true), POLL_INTERVAL);
        }
        return () => {
            window.removeEventListener('todosUpdated', handleTodosUpdated);
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [view, fetchTodos]);

    const toggleComplete = async (todoId) => {
        setToggling(prev => ({ ...prev, [todoId]: true }));
        try {
            await api.put(`/todos/${todoId}/complete`);
            await fetchTodos(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating task');
        } finally {
            setToggling(prev => ({ ...prev, [todoId]: false }));
        }
    };

    const deleteTodo = async (todoId) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await api.delete(`/todos/${todoId}`);
            fetchTodos(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting task');
        }
    };

    const clearAllHistory = async () => {
        if (!window.confirm('Clear all history? This cannot be undone.')) return;
        setClearingHistory(true);
        try {
            await api.delete('/todos/history/clear');
            fetchTodos(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Error clearing history');
        } finally {
            setClearingHistory(false);
        }
    };

    const getMyAssignment = (todo) =>
        todo.assigned_to?.find(a => a.employee_id && (
            a.employee_id._id?.toString() === user._id.toString() ||
            a.employee_id.toString() === user._id.toString()
        ));

    const completedCount = (todo) => todo.assigned_to?.filter(a => a.completed).length ?? 0;
    const totalCount = (todo) => todo.assigned_to?.length ?? 0;
    const progressPercent = (todo) => {
        const t = totalCount(todo);
        return t > 0 ? Math.round((completedCount(todo) / t) * 100) : 0;
    };

    // ── Employee Task Card ──────────────────────────────────────
    const EmployeeTaskCard = ({ todo, section }) => {
        const myAssignment = getMyAssignment(todo);
        const isDone = myAssignment?.completed ?? false;
        const isToggling = toggling[todo._id];
        const isDelayed = section === 'delayed';
        const isHistory = section === 'history';
        const isTodayCompleted = section === 'todayCompleted';

        return (
            <div className={`todo-task-card ${isDone ? 'todo-task-done' : ''} ${isDelayed ? 'todo-task-delayed' : ''}`}>
                <div className="todo-task-left">
                    {!isHistory ? (
                        <button
                            className={`todo-checkbox ${isDone ? 'checked' : ''} ${isToggling ? 'toggling' : ''}`}
                            onClick={() => !isToggling && toggleComplete(todo._id)}
                            disabled={isToggling}
                            aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                            {isToggling ? (
                                <span className="todo-checkbox-spinner" />
                            ) : isDone ? (
                                <svg viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            ) : null}
                        </button>
                    ) : (
                        <div className="todo-history-icon">✓</div>
                    )}
                </div>

                <div className="todo-task-content">
                    <div className="todo-task-header">
                        <h4 className={`todo-task-title ${isDone ? 'done' : ''}`}>{todo.title}</h4>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {isDelayed && <span className="todo-chip chip-delayed">⚠ Delayed</span>}
                            {(isTodayCompleted || isHistory) && <span className="todo-chip chip-done">✓ Done</span>}
                            {isHistory && (
                                <button className="todo-delete-btn" onClick={() => deleteTodo(todo._id)} title="Remove from history">✕</button>
                            )}
                        </div>
                    </div>

                    <div className="todo-task-meta">
                        <span className="todo-meta-item">📅 {todo.date}</span>
                        {todo.time && <span className="todo-meta-item">⏰ {todo.time}</span>}
                        {todo.creator_id?.name && <span className="todo-meta-item">👤 {todo.creator_id.name}</span>}
                        {myAssignment?.completedAt && (
                            <span className="todo-meta-item" style={{ color: '#22c55e' }}>
                                ✓ {new Date(myAssignment.completedAt).toLocaleString()}
                            </span>
                        )}
                    </div>

                    {todo.note && (
                        <div className="todo-task-note">
                            <span className="todo-note-label">📋 Note</span>
                            <p>{todo.note}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // ── Manager Task Card ──────────────────────────────────────
    const ManagerTaskCard = ({ todo, section }) => {
        const done = completedCount(todo);
        const total = totalCount(todo);
        const pct = progressPercent(todo);
        const allDone = done === total && total > 0;
        const isHistory = section === 'history';
        const isTodayCompleted = section === 'todayCompleted';

        return (
            <div className={`todo-task-card manager-view ${allDone ? 'todo-task-done' : ''}`}>
                <div className="todo-task-content" style={{ flex: 1 }}>
                    <div className="todo-task-header">
                        <h4 className={`todo-task-title ${allDone ? 'done' : ''}`}>{todo.title}</h4>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {(isTodayCompleted || isHistory) ? (
                                <span className="todo-chip chip-done">✓ All Done</span>
                            ) : (
                                <span className={`todo-chip ${allDone ? 'chip-done' : 'chip-pending'}`}>{done}/{total} Done</span>
                            )}
                            {(isHistory || (!isHistory && !isTodayCompleted)) && (
                                <button className="todo-delete-btn" onClick={() => deleteTodo(todo._id)} title="Delete task">✕</button>
                            )}
                        </div>
                    </div>

                    <div className="todo-task-meta">
                        <span className="todo-meta-item">📅 {todo.date}</span>
                        {todo.time && <span className="todo-meta-item">⏰ {todo.time}</span>}
                        <span className="todo-meta-item">{todo.type === 'self' ? '👤 Self' : `👥 ${total} Assignees`}</span>
                    </div>

                    {todo.note && (
                        <div className="todo-task-note">
                            <span className="todo-note-label">📋 Note</span>
                            <p>{todo.note}</p>
                        </div>
                    )}

                    {total > 0 && (
                        <div className="todo-progress-wrap">
                            <div className="todo-progress-bar">
                                <div className="todo-progress-fill" style={{ width: `${pct}%`, background: allDone ? '#22c55e' : '#6366f1' }} />
                            </div>
                            <span className="todo-progress-label">{pct}%</span>
                        </div>
                    )}

                    {todo.type === 'assigned' && todo.assigned_to?.length > 0 && (
                        <div className="todo-assignees">
                            {todo.assigned_to.map(a => {
                                const emp = a.employee_id;
                                if (!emp) return null;
                                return (
                                    <div key={emp._id || emp} className={`todo-assignee-pill ${a.completed ? 'pill-done' : 'pill-pending'}`}>
                                        <div className="pill-avatar">{(emp.name || '?').charAt(0)}</div>
                                        <span className="pill-name">{emp.name || 'User'}</span>
                                        {a.completed ? <span className="pill-status">✓</span> : <span className="pill-status pending">⏳</span>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // ── Section renderer ───────────────────────────────────────
    const Section = ({ title, color, icon, tasks, section, emptyMsg, headerRight }) => (
        <div className="todo-section-block">
            <div className="todo-section-header" style={{ '--section-color': color }}>
                <span className="todo-section-icon">{icon}</span>
                <h3 className="todo-section-title">{title}</h3>
                <span className="todo-section-count">{tasks.length}</span>
                {headerRight && <div style={{ marginLeft: 'auto' }}>{headerRight}</div>}
            </div>
            {tasks.length === 0 ? (
                <div className="todo-empty-section">{emptyMsg}</div>
            ) : (
                <div className="todo-section-list">
                    {tasks.map(t =>
                        view === 'my'
                            ? <EmployeeTaskCard key={t._id} todo={t} section={section} />
                            : <ManagerTaskCard key={t._id} todo={t} section={section} />
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="page">
            <Topbar title="ToDo List" />
            <div className="page-body">
                {/* Header */}
                <div className="todo-page-header">
                    <div>
                        <h2 className="todo-page-title">
                            {view === 'my' ? '📋 My Tasks' : '📊 Team Task Tracker'}
                        </h2>
                        <p className="todo-page-sub">
                            {view === 'my'
                                ? 'Tick tasks as you complete them. Your manager can see your progress live.'
                                : 'Live view of employee task completion. Auto-refreshes every 8 seconds.'}
                        </p>
                    </div>
                    {canAssign && (
                        <div className="tab-group">
                            <button className={`tab ${view === 'my' ? 'active' : ''}`} onClick={() => setView('my')}>
                                👤 My Tasks
                            </button>
                            <button className={`tab ${view === 'created' ? 'active' : ''}`} onClick={() => setView('created')}>
                                📊 Assigned Tasks
                                {view === 'created' && <span className="todo-live-dot" />}
                            </button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="todo-loading"><div className="spinner" /><p>Loading tasks...</p></div>
                ) : (
                    <div className="todo-sections">

                        {/* Delayed */}
                        {data.delayed.length > 0 && (
                            <Section title="Delayed" color="#ef4444" icon="⚠️" tasks={data.delayed} section="delayed" emptyMsg="No delayed tasks." />
                        )}

                        {/* Today's Work */}
                        <Section title="Today's Work" color="#6366f1" icon="🔥" tasks={data.today} section="today" emptyMsg="No tasks for today." />

                        {/* Today's Completed */}
                        <Section
                            title="Today's Completed"
                            color="#22c55e"
                            icon="✅"
                            tasks={data.todayCompleted || []}
                            section="todayCompleted"
                            emptyMsg="No tasks completed today yet."
                        />

                        {/* History */}
                        <Section
                            title="History"
                            color="#8b5cf6"
                            icon="📂"
                            tasks={data.history}
                            section="history"
                            emptyMsg="No history. Completed tasks from previous days will appear here."
                            headerRight={
                                data.history.length > 0 && (
                                    <button
                                        className="todo-clear-history-btn"
                                        onClick={clearAllHistory}
                                        disabled={clearingHistory}
                                    >
                                        {clearingHistory ? '⏳ Clearing...' : '🗑 Clear All History'}
                                    </button>
                                )
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
