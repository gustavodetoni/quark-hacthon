import React from 'react';
import '../Styles/TraineeStyles.css'

const Trainee = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };
    return (
        <div className='erp-admin-container'>
            <h2 className="erp-header">Bem-vindo, Trainee!</h2>
            <p>Em breve você terá acesso ao seu treinamento.</p>
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default Trainee;
