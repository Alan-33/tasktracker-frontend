import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function MemberDashboard() {
    const [tasks, setTasks] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const API_URL = 'https://tasktracker-backend-production.up.railway.app/api';

    useEffect(() => {
        if (user) fetchMyTasks();
    }, []);

    const fetchMyTasks = async () => {
        try {
            const res = await axios.get(`${API_URL}/tasks?userId=${user.UserId}&role=Member`);
            setTasks(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    const handleStatusChange = async (taskId, currentStatus) => {
        const nextStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
        try {
            await axios.put(`${API_URL}/tasks/${taskId}`, { status: nextStatus });
            fetchMyTasks();
        } catch (err) {
            console.error("Update Error:", err);
        }
    };

    return (
        <div style={{ backgroundColor: '#0a0d17', minHeight: '100vh', width: '100vw', color: 'white' }}>
            <div className="container-fluid p-0">
                {/* Header with Logout */}
                <div className="w-100 px-4 py-4 d-flex justify-content-between align-items-center border-bottom border-secondary mb-4">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow me-3" style={{width: '55px', height: '55px', fontSize: '1.2rem'}}>
                            {user?.EmpName?.charAt(0)}
                        </div>
                        <h1 className="h2 fw-bold m-0">My Assignments</h1>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        <span className="badge bg-primary px-3 py-2 d-none d-md-inline">MEMBER VIEW</span>
                        <button className="btn btn-outline-danger btn-sm fw-bold px-3" onClick={() => { localStorage.clear(); window.location.href = '/'; }}>LOGOUT</button>
                    </div>
                </div>

                <div className="px-4 pb-5">
                    <div className="card border-0 shadow-lg overflow-hidden" style={{ backgroundColor: '#161925', borderRadius: '20px' }}>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover m-0 w-100">
                                <thead className="table-light">
                                    <tr className="text-dark fw-bold text-center">
                                        <th className="py-3">TASK DESCRIPTION</th>
                                        <th className="py-3">PROJECT</th>
                                        <th className="py-3">DUE DATE</th>
                                        <th className="py-3">STATUS</th>
                                        <th className="py-3">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map(task => (
                                        <tr key={task.TaskId} className="text-center align-middle border-secondary">
                                            <td className="py-3 fw-bold">{task.TaskName}</td>
                                            <td className="py-3 text-secondary">{task.ProjectName}</td>
                                            <td className="py-3">{new Date(task.DueDate).toLocaleDateString()}</td>
                                            <td className="py-3">
                                                <span className={`badge bg-${task.Status === 'Completed' ? 'success' : 'warning text-dark'} px-3 py-2`}>
                                                    {task.Status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <button 
                                                    className={`btn btn-sm fw-bold ${task.Status === 'Completed' ? 'btn-outline-secondary' : 'btn-success'}`}
                                                    onClick={() => handleStatusChange(task.TaskId, task.Status)}
                                                >
                                                    {task.Status === 'Completed' ? 'REOPEN' : 'MARK DONE'}
                                                </button>
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
    );
}

export default MemberDashboard;