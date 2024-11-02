const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const app = express();

const bcrypt = require('bcryptjs');

//async function generateHashedPassword(password) {
//    const hashedPassword = await bcrypt.hash(password, 10);
//    console.log(hashedPassword);
//}

//console.log(generateHashedPassword('senha_admin'));


app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

