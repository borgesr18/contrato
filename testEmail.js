const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' }); // Garante carregamento do .env

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'rba1807@gmail.com',
      subject: 'Teste de envio de e-mail',
      text: 'Este é um e-mail de teste enviado com nodemailer diretamente via Node.js',
    });

    console.log('✅ E-mail enviado com sucesso:', info.response);
  } catch (err) {
    console.error('❌ Falha ao enviar e-mail:', err.message);
    console.error(err);
  }
}

sendTestEmail();
