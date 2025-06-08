const nodemailer = require('nodemailer');
require('dotenv').config(); // Certifique-se de que o .env está na raiz do projeto

(async () => {
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'OK' : 'FALTANDO');

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'rba1807@gmail.com',
      subject: 'Teste simples de envio de e-mail',
      text: 'Se você recebeu esse e-mail, o Gmail está funcionando!',
    });

    console.log('✅ E-mail enviado:', info.response);
  } catch (err) {
    console.error('❌ Erro ao enviar e-mail:', err.message);
  }
})();
