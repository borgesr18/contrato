import { promises as fs } from 'fs';
import fs from 'fs';
import path from 'path';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const data = req.body;

  // Carrega o documento do contrato modelo
  const templatePath = path.join(process.cwd(), 'Contrato Vitorino.docx');
  const content = await fs.readFile(templatePath, 'binary');
  const content = fs.readFileSync(templatePath, 'binary');

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  doc.setData(data);

  try {
    doc.render();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao preencher o contrato' });
  }

  const buf = doc.getZip().generate({ type: 'nodebuffer' });
  const filename = 'Contrato Preenchido.docx';

  // Salva o contrato preenchido na raiz do projeto
  const outputPath = path.join(process.cwd(), filename);
  await fs.writeFile(outputPath, buf);
  const filename = 'ContratoPreenchido.docx';

  // Configuração do Nodemailer (use variáveis de ambiente para credenciais reais)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'user@example.com',
      pass: process.env.SMTP_PASS || 'password',
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'contrato@example.com',
      to: 'meuemail@exemplo.com',
      to: process.env.TO_EMAIL || 'destino@example.com',
      subject: 'Contrato preenchido',
      text: 'Segue o contrato preenchido em anexo.',
      attachments: [
        {
          filename,
          content: buf,
        },
      ],
    });
  } catch (error) {
    return res.status(500).json({ error: 'Falha ao enviar email' });
  }

  return res.status(200).json({ status: 'success' });
export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    // Aqui, você pode processar os dados recebidos conforme necessário
    return res.status(200).json({ message: 'Dados recebidos', data });
  }
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
