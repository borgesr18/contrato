const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' }); // ou '.env' se seu arquivo for esse

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'rba1807@gmail.com',
  subject: 'Teste de E-mail',
  text: 'Este é um teste de envio de e-mail usando nodemailer com Gmail.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Erro ao enviar e-mail:', error);
  } else {
    console.log('E-mail enviado com sucesso:', info.response);
  }
});
