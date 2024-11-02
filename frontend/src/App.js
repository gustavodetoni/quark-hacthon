import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import VerifyCode from './Components/Verify';
import AdminDashboard from './Components/Admin';
import Trainee from './Components/Trainee'; 
import Assessor from './Components/Assessor'; 

function App() {
    const [userRole, setUserRole] = useState('');
    const [username, setUsername] = useState('');

    return (
        <Router>
            <Routes>
                <Route path="/admin" element={userRole === 'admin' ? <AdminDashboard /> : <Login setUserRole={setUserRole} setUsername={setUsername} />} />
                <Route path="/verify" element={<VerifyCode username={username} setUserRole={setUserRole} />} />
                <Route path="/trainee" element={userRole === 'trainee' ? <Trainee /> : <Login setUserRole={setUserRole} setUsername={setUsername} />} /> {/* Página do Trainee */}
                <Route path="/assessor" element={userRole === 'assessor' ? <Assessor /> : <Login setUserRole={setUserRole} setUsername={setUsername} />} /> {/* Página do Assessor */}
                <Route path="/" element={<Login setUserRole={setUserRole} setUsername={setUsername} />} />
            </Routes>
        </Router>
    );
}

export default App;
