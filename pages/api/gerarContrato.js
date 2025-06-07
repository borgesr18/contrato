import { promises as fs } from 'fs';
import path from 'path';
import path from 'path';
import fs from 'fs';
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

  // Configuração do Nodemailer utilizando a conta do Gmail fornecida
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'contratovitorino@gmail.com',
      pass: 'pwwf mnxs hmcs dwec',
    },
  });

  try {
    await transporter.sendMail({
      from: 'contratovitorino@gmail.com',
      to: 'meuemail@exemplo.com',
  try {
    const data = req.body;

    // Carregar template do contrato
    const templatePath = path.join(process.cwd(), 'Contrato Vitorino.docx');
    const content = fs.readFileSync(templatePath, 'binary');

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.setData(data);

    try {
      doc.render();
    } catch (error) {
      console.error('Erro ao preencher o contrato:', error);
      return res.status(500).json({ error: 'Erro ao preencher o contrato' });
    }

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    // Configuração do Nodemailer com Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'contratodovitorino@gmail.com',
        pass: 'pwwf mnxs hmcs dwec',
      },
    });

    await transporter.sendMail({
      from: 'contratodovitorino@gmail.com',
      to: 'rba1807@gmail.com',
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
          filename: 'Contrato Preenchido.docx',
          content: buffer,
        },
      ],
    });

    return res.status(200).json({ status: 'success' });

  } catch (err) {
    console.error('Erro inesperado:', err);
    return res.status(500).json({ error: 'Erro inesperado' });
  }
}
