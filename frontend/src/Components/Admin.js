import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/AdminStyles.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('trainee');
    const [editingUserId, setEditingUserId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token'); 
        try {
            const adminUsers = await axios.get('http://localhost:3000/api/users/admins', {
                headers: { Authorization: `Bearer ${token}` } 
            });
            const traineeUsers = await axios.get('http://localhost:3000/api/users/trainees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const assessorUsers = await axios.get('http://localhost:3000/api/users/assessors', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setUsers([...adminUsers.data, ...traineeUsers.data, ...assessorUsers.data]); 
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            setError('Erro ao buscar usuários');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const token = localStorage.getItem('token'); 

        try {
            if (editingUserId) {
                // Editando usuário
                await axios.put(`http://localhost:3000/api/users/${editingUserId}/edit`, 
                    { username, password, role }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setEditingUserId(null);
            } else {
                // Criando novo usuário
                await axios.post('http://localhost:3000/api/users/create', 
                    { username, password, role },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            fetchUsers(); 
            setUsername('');
            setPassword('');
            setRole('trainee');
        } catch (err) {
            setError(err.response.data.message || 'Erro ao salvar usuário');
        }
    };

    const handleEdit = (user) => {
        setEditingUserId(user.id);
        setUsername(user.username);
        setRole(user.role);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Você tem certeza que deseja excluir este usuário?')) {
            const token = localStorage.getItem('token'); 
            try {
                await axios.delete(`http://localhost:3000/api/users/${id}/delete`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchUsers(); 
            } catch (error) {
                setError(error.response.data.message || 'Erro ao excluir usuário');
            }
        }
    };

    return (
        <div className='container-admin'>
            <h1>Painel do Administrador</h1>
            <p>Bem-vindo ao painel de administração!</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <h2>{editingUserId ? 'Editar Usuário' : 'Criar Novo Usuário'}</h2>
                <div>
                    <label>Nome de Usuário:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Senha:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Função:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="trainee">Trainee</option>
                        <option value="assessor">Assessor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit">{editingUserId ? 'Atualizar Usuário' : 'Criar Usuário'}</button>
            </form>

            <h2>Lista de Usuários</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.username} - {user.role}
                        <button onClick={() => handleEdit(user)}>Editar</button>
                        <button onClick={() => handleDelete(user.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Admin;
