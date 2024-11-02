const express = require('express');
const cors = require('cors');
const routes = require('./api/routes/index');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
});

module.exports = app;
