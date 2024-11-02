import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import '../Styles/AssessorStyles.css';

const Assessor = () => {
    const [updates, setUpdates] = useState([]); 
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState({
        advisor: '',
        code: '',
        name: ''
    });

    useEffect(() => {
        fetchUpdates();
    }, []);

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
                <div><button className="logout-button" onClick={handleLogout}>
                Logout
            </button></div>
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
                <h2>Atualizações</h2>
                {filteredUpdates.length > 0 ? (
                    <div className="erp-updates-grid">
                        {filteredUpdates.map((update, index) => (
                            <div key={index} className="erp-update-card">
                                <div className="erp-update-header">
                                    <h3>Registro {index + 1}</h3>
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
    );
};

export default Assessor;
