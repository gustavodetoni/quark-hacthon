import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/AssessorStyles.css';

const Assessor = () => {
    const [updates, setUpdates] = useState([]);
    const [operations, setOperations] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState({
        advisor: '',
        code: '',
        name: ''
    });

    useEffect(() => {
        fetchUpdates();
        fetchOperations();
    }, []);

    const fetchOperations = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/updates/operacoes');
            setOperations(response.data);
        } catch (error) {
            console.error('Erro ao buscar operações:', error);
            setError('Erro ao buscar operações');
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

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchTerm(prev => ({ ...prev, [name]: value }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const filteredUpdates = updates.filter(update => {
        return (
            (update.advisor && update.advisor.toLowerCase().includes(searchTerm.advisor.toLowerCase())) &&
            (update.code && update.code.toLowerCase().includes(searchTerm.code.toLowerCase())) &&
            (update.name && update.name.toLowerCase().includes(searchTerm.name.toLowerCase()))
        );
    });

    return (
        <div className='erp-admin-container'>
            <div className="erp-header">
                <h2>Bem-vindo, Assessor!</h2>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
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
                                
                                <div><strong>Advisor:</strong> {update.advisor}</div>
                                <div><strong>Código:</strong> {update.code}</div>
                                <div><strong>Nome:</strong> {update.name}</div>
                            </div>
                        ))}
                    </div>
                ) : <p>Nenhuma atualização disponível.</p>}
            </div>

            <div className="erp-operations">
                <h2>Operações</h2>
                {operations.length > 0 ? (
                    <table className="erp-operations-table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Fixing</th>
                                <th>ID Cotação</th>
                                <th>Cliente</th>
                                <th>Estrutura</th>
                                <th>Spot Entrada</th>
                                <th>Quantidade</th>
                                <th>Strike</th>
                                <th>Barreira</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {operations.map((operation, index) => (
                                <tr key={index}>
                                    <td>{operation.data}</td>
                                    <td>{operation.fixing}</td>
                                    <td>{operation.idCotacao}</td>
                                    <td>{operation.cliente}</td>
                                    <td>{operation.estrutura}</td>
                                    <td>{operation.spotEntrada}</td>
                                    <td>{operation.quantidade}</td>
                                    <td>{operation.strike}</td>
                                    <td>{operation.barreira}</td>
                                    <td>{operation.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>Nenhuma operação disponível.</p>}
            </div>
        </div>
    );
};

export default Assessor;
