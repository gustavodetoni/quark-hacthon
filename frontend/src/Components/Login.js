import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/LoginStyles.css'
import fotoprincipal from '../assets/fotoprincipal.png'; 

const Login = ({ setUserRole, setUsername }) => {
    const [usernameInput, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', { username: usernameInput, password });
            setUsername(usernameInput); 
            setUserRole(response.data.role); 

            localStorage.setItem('advisorName', response.data.advisorName); 

            if (response.data.role === 'admin') {
                navigate('/verify'); 
            } else if (response.data.role === 'trainee') {
                navigate('/trainee'); 
            } else if (response.data.role === 'assessor') {
                navigate('/assessor'); 
            }
        } catch (err) {
            setError(err.response.data.message || 'Erro durante o login');
        }
    };

    return (
        <div className="container-login">
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>Username:</label>
                <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className='button-login' type="submit">Login</button>
        </form>
        <img className="fotoprincipal" src={fotoprincipal} />
        </div>
    );
};

export default Login;
