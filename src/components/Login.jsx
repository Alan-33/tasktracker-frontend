import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // The live Railway backend URL
    const API_URL = 'https://tasktracker-backend-production.up.railway.app/api';

    const handleLogin = async (e) => {
        e.preventDefault(); 
        try {
            // UPDATED: Points to the live Railway API instead of localhost
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            });

            if (response.data.success) {
                const user = response.data.user;
                
                // Save user info to local storage
                localStorage.setItem('user', JSON.stringify(user));

                // Matches "Role" (uppercase) to your PostgreSQL column name
                if (user.Role && user.Role.toLowerCase() === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/member');
                }
            }
        } catch (err) {
            // Error handling for invalid credentials or connection issues
            setError('Invalid email or password');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: '400px' }}>
                <h2 className="text-center mb-4">TaskTracker</h2>
                
                {error && <div className="alert alert-danger">{error}</div>}
                
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>

                <div className="mt-4 text-center text-muted" style={{ fontSize: '0.85rem' }}>
                    <p className="mb-1"><strong>Recruiter Test Logins:</strong></p>
                    <p className="mb-0">Admin: admin@test.com / admin123</p>
                    <p>Member: member@test.com / member123</p>
                </div>
            </div>
        </div>
    );
}

export default Login;