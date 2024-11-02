require('dotenv').config();
const app = require('./app');
const pool = require('./api/database/db');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

pool.getConnection()
    .then(connection => {
        console.log('Conexão ao banco de dados bem-sucedida!');
        connection.release();
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });
