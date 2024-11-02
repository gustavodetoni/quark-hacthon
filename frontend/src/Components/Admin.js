import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/AdminStyles.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [updates, setUpdates] = useState([]); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('trainee');
    const [editingUserId, setEditingUserId] = useState(null);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState({
        advisor: '',
        code: '',
        name: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchUpdates();
    }, []);


    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchTerm(prev => ({ ...prev, [name]: value }));
    };

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

    const fetchUpdates = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/updates/clientes'); 
            setUpdates(response.data);
        } catch (error) {
            console.error('Erro ao buscar atualizações:', error);
            setError('Erro ao buscar atualizações');
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

    
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const handleEdit = (user) => {
        setEditingUserId(user.id);
        setUsername(user.username);
        setRole(user.role);
    };

    
    const filteredUpdates = updates.filter(update => {
        return (
            (update.advisor && update.advisor.toLowerCase().includes(searchTerm.advisor.toLowerCase())) &&
            (update.code && update.code.toLowerCase().includes(searchTerm.code.toLowerCase())) &&
            (update.name && update.name.toLowerCase().includes(searchTerm.name.toLowerCase()))
        );
    });

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
        <div className="erp-admin-container">
        <div className="erp-header">
            <h1>Painel do Administrador</h1>
            <div>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
        
        <div className="erp-main-grid">
            <div>
                <div className="erp-user-list">
                    <h2>Lista de Usuários</h2>
                    <ul className="erp-user-list-container">
                        {users.map((user) => (
                            <li className="erp-user-list-item" key={user.id}>
                                {user.username} - {user.role}
                                <div>
                                    <button className="erp-button" onClick={() => handleEdit(user)}>Editar</button>
                                    <button className="erp-button" onClick={() => handleDelete(user.id)}>Excluir</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className='filters'>
                    <div className="erp-filters">
                        <input
                            type="text"
                            name="advisor"
                            placeholder="Filtrar por Advisor"
                            value={searchTerm.advisor}
                            onChange={handleSearchChange}
                        />
                        <input
                            type="text"
                            name="code"
                            placeholder="Filtrar por Código"
                            value={searchTerm.code}
                            onChange={handleSearchChange}
                        />
                        <input
                            type="text"
                            name="name"
                            placeholder="Filtrar por Nome"
                            value={searchTerm.name}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className="erp-updates">
                    <h2>Clientes</h2>
                    {filteredUpdates.length > 0 ? (
                        <div className="erp-updates-grid">
                            {filteredUpdates.map((update, index) => (
                                <div key={index} className="erp-update-card">
                                    <div className="erp-update-header">
                                        <h3>Cliente {index + 1}</h3>
                                        <span className="erp-update-badge-verde">Vincular</span>
                                        <span className="erp-update-badge">Excluir</span>
                                    </div>
                                    <div className="erp-update-content">
                                        <div className="erp-update-item">
                                            <strong>Advisor:</strong> <span>{update.advisor}</span>
                                        </div>
                                        <div className="erp-update-item">
                                            <strong>Código:</strong> <span>{update.code}</span>
                                        </div>
                                        <div className="erp-update-item">
                                            <strong>Nome:</strong> <span>{update.name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="erp-updates-empty">
                            <p>Nenhuma atualização disponível.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Coluna da direita */}
            <div className="erp-create-user">
                <form className="erp-form" onSubmit={handleSubmit}>
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
                    <button type="submit" className="erp-button">{editingUserId ? 'Atualizar Usuário' : 'Criar Usuário'}</button>
                </form>
            </div>
        </div>
    </div>
    );
};

export default Admin;
