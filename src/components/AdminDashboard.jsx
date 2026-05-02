import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDashboard() {
    const [newProjectName, setNewProjectName] = useState('');
    const [taskName, setTaskName] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [projectId, setProjectId] = useState('');
    const [dueDate, setDueDate] = useState('');

    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [dashboardCounts, setDashboardCounts] = useState({ Total: 0, Pending: 0, Completed: 0, Overdue: 0 });

    const API_URL = 'https://tasktracker-backend-production.up.railway.app/api';;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [userRes, projectRes, dashRes, taskRes] = await Promise.all([
                axios.get(`${API_URL}/users`),
                axios.get(`${API_URL}/projects`),
                axios.get(`${API_URL}/dashboard`),
                axios.get(`${API_URL}/tasks?role=Admin`)
            ]);
            setUsers(userRes.data);
            setProjects(projectRes.data);
            setDashboardCounts(dashRes.data);
            setTasks(taskRes.data);
        } catch (err) {
            console.error("Data Fetch Error:", err);
        }
    };

    const handleCreateProject = async () => {
        try {
        // MUST use localhost:5000 for your demo video
            const res = await axios.post('http://localhost:5000/api/projects', { projectName });
            if (res.data.success) {
                alert("Project Created!");
            }
        } catch (err) {
            console.error("Create Error:", err);
        }
    };  

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/tasks`, {
                taskName, assignedTo, projectId, dueDate
            });
            if (response.data.success) {
                setTaskName(''); setAssignedTo(''); setProjectId(''); setDueDate('');
                fetchData();
            }
        } catch (err) {
            console.error("Task Error:", err);
        }
    };

    return (
        <div style={styles.mainWrapper}>
            <div className="container-fluid w-100 m-0 p-0">
                {/* Header with Logout */}
                <div className="w-100 px-4 py-4 d-flex justify-content-between align-items-center mb-4" style={styles.headerBorder}>
                    <div className="d-flex align-items-center">
                        <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow me-3" style={{width: '55px', height: '55px', fontSize: '1.2rem'}}>AU</div>
                        <h1 className="h2 fw-bold text-white m-0">Admin Dashboard</h1>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-light btn-sm fw-bold px-3" onClick={() => window.location.reload()}>REFRESH</button>
                        <button className="btn btn-danger btn-sm fw-bold px-3 shadow" onClick={() => { localStorage.clear(); window.location.href = '/'; }}>LOGOUT</button>
                    </div>
                </div>

                <div className="row g-4 m-0 px-3 pb-5">
                    {/* Stat Cards */}
                    <div className="col-12 mb-2">
                        <div className="row g-3">
                            <StatCard title="TOTAL TASKS" count={dashboardCounts.Total} color="#ffffff" icon="list-task" />
                            <StatCard title="PENDING" count={dashboardCounts.Pending} color="#ffc107" icon="clock" />
                            <StatCard title="COMPLETED" count={dashboardCounts.Completed} color="#198754" icon="check-circle" />
                            <StatCard title="OVERDUE" count={dashboardCounts.Overdue} color="#dc3545" icon="exclamation-triangle" />
                        </div>
                    </div>

                    {/* Step 1 & 2 Forms */}
                    <div className="col-xl-4 col-lg-5">
                        <div className="card border-0 shadow-lg mb-4" style={styles.darkCard}>
                            <div className="card-body p-4 text-center">
                                <h4 className="text-white fw-bold mb-3">1. Create Project</h4>
                                <form onSubmit={handleCreateProject} className="d-flex gap-2">
                                    <input type="text" className="form-control bg-dark text-white border-secondary text-center shadow-none" placeholder="Project Name..." value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} required />
                                    <button type="submit" className="btn btn-primary fw-bold px-3">CREATE</button>
                                </form>
                            </div>
                        </div>

                        <div className="card border-0 shadow-lg" style={styles.darkCard}>
                            <div className="card-body p-4">
                                <h4 className="text-white fw-bold mb-4 text-center">2. Assign Task</h4>
                                <form onSubmit={handleCreateTask}>
                                    <div className="mb-3">
                                        <label className="text-white fw-bold small mb-2 opacity-75 d-block text-center">TASK DESCRIPTION</label>
                                        <input type="text" className="form-control bg-dark text-white border-secondary text-center shadow-none" value={taskName} onChange={(e) => setTaskName(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-white fw-bold small mb-2 opacity-75 d-block text-center">ASSIGN TO MEMBER</label>
                                        <select className="form-select bg-dark text-white border-secondary text-center shadow-none" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
                                            <option value="">Select Member...</option>
                                            {users.map(u => <option key={u.UserId} value={u.UserId}>{u.EmpName}</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-white fw-bold small mb-2 opacity-75 d-block text-center">LINK TO PROJECT</label>
                                        <select className="form-select bg-dark text-white border-secondary text-center shadow-none" value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
                                            <option value="">Select Project...</option>
                                            {projects.map(p => <option key={p.ProjectId} value={p.ProjectId}>{p.ProjectName}</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-white fw-bold small mb-2 opacity-75 d-block text-center">DUE DATE</label>
                                        <input type="date" className="form-control bg-dark text-white border-secondary text-center shadow-none" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                                    </div>
                                    <button type="submit" className="btn btn-success btn-lg w-100 fw-bold py-3 shadow-lg">ASSIGN TASK</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Task Table */}
                    <div className="col-xl-8 col-lg-7">
                        <div className="card border-0 shadow-lg h-100 overflow-hidden" style={styles.darkCard}>
                            <div className="table-responsive">
                                <table className="table table-dark table-hover m-0 w-100">
                                    <thead className="table-light">
                                        <tr className="text-dark fw-bold border-0 text-center">
                                            <th className="py-3">ID</th>
                                            <th className="py-3">DESCRIPTION</th>
                                            <th className="py-3">PROJECT</th>
                                            <th className="py-3">ASSIGNEE</th>
                                            <th className="py-3">DUE DATE</th>
                                            <th className="py-3">STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map(task => (
                                            <tr key={task.TaskId} className="border-secondary align-middle text-center">
                                                <td className="py-3 text-secondary">#{task.TaskId}</td>
                                                <td className="py-3 text-white fw-bold">{task.TaskName}</td>
                                                <td className="py-3 text-secondary">{task.ProjectName}</td>
                                                <td className="py-3 text-white">{task.AssignedToName}</td>
                                                <td className="py-3 text-white">{new Date(task.DueDate).toLocaleDateString()}</td>
                                                <td className="py-3">
                                                    <span className={`badge bg-${task.Status === 'Completed' ? 'success' : 'warning text-dark'} px-3 py-2 fw-bold`}>
                                                        {task.Status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, count, color, icon }) {
    return (
        <div className="col-lg-3 col-sm-6">
            <div className="card border-0 p-4 shadow-lg h-100 d-flex flex-row align-items-center justify-content-between" style={{backgroundColor: '#161925', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)'}}>
                <div>
                    <div className="fw-bold mb-1" style={{color: color, fontSize: '0.85rem', letterSpacing: '1.5px'}}>{title}</div>
                    <div className="display-6 fw-bold text-white mb-0">{count}</div>
                </div>
                <i className={`bi bi-${icon} h2 mb-0`} style={{color: color, opacity: '0.8'}}></i>
            </div>
        </div>
    );
}

const styles = {
    mainWrapper: { backgroundColor: '#0a0d17', minHeight: '100vh', width: '100vw' },
    headerBorder: { borderBottom: '1px solid rgba(255,255,255,0.1)' },
    darkCard: { backgroundColor: '#161925', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }
};

export default AdminDashboard;