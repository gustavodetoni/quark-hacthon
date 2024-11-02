const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const sendVerificationEmail = async (email, code) => {
    if (!email) throw new Error('Email não fornecido para envio');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Código de Verificação Admin',
        text: `Seu código de verificação é: ${code}`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, generateVerificationCode };
