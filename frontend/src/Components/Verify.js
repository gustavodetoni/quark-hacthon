import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/VerifyStyles.css';

const VerifyCode = ({ username, setUserRole }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [role, setRole] = useState('admin'); 
    const navigate = useNavigate(); 

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/api/auth/verify', {
                username,
                code,
            });
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            setRole(response.data.role);
            setUserRole(response.data.role); 

            if (response.data.role === 'admin') {
                navigate('/admin');
            } else {
                alert('Verificação bem-sucedida!');
            }
        } catch (err) {
            console.error('Erro de verificação:', err.response ? err.response.data : err);
            setError(err.response ? err.response.data.message : 'Erro desconhecido');
        }
    };

    return (
        <div className='container-verify' >
            
            <form onSubmit={handleVerify}>
                <div>
                <h2>Verificação de Código</h2>
                    <label htmlFor="code">Digite o codigo enviado por email</label>
                    <input
                        type="text"
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                </div>
                <button className='botton-verify' type="submit">Verificar</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default VerifyCode;
