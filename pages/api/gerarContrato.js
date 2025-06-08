import { promises as fs } from 'fs';
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

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('EMAIL_USER or EMAIL_PASS environment variable not set');
    return res.status(500).json({ error: 'Email configuration missing' });
  }

  // Map the received fields to the placeholders in the document
  const templateData = {
    Comprador: data.nome,
    EstadoCivil: data.estadoCivil,
    'Profissão': data.profissao,
  // Fix placeholders that Word may split across multiple runs
  xml = xml.replace(
    /<w:t>\[<\/w:t><\/w:r>\s*<w:r[^>]*>\s*(?:<w:rPr>.*?<\/w:rPr>)?\s*<w:t>([^<]*)<\/w:t><\/w:r>\s*<w:r[^>]*>\s*(?:<w:rPr>.*?<\/w:rPr>)?\s*<w:t>\]/g,
    '[$1]'
  );
    Emissor: data.orgaoRg,
    Endereço: data.endereco,
    Número: data.numero,
    Complemento: data.complemento,
    Bairro: data.bairro,
    Cidade: data.cidade,
    CEP: data.cep,
    Quadra: data.quadra,
    Lote: data.lote,
    Testemunha: data.testemunha1Nome,
    'CPF Test': data.testemunha1Cpf,
    Testemunha2: data.testemunha2Nome,
    'CPF Test2': data.testemunha2Cpf,
  };

  // Load and adjust the Word document
  const templatePath = path.join(process.cwd(), 'Contrato Vitorino.docx');
  const content = await fs.readFile(templatePath, 'binary');
  let zip = new PizZip(content);

  // Fix placeholders split by Word correction marks
  let xml = zip.file('word/document.xml').asText();
  xml = xml.replace(/<w:proofErr[^>]*\/>/g, '');
  const splitTag = /\[([A-Za-z0-9 \u00C0-\u00FF]+)<\/w:t><\/w:r>\s*<w:r[^>]*>\s*(?:<w:rPr>.*?<\/w:rPr>)?\s*<w:t>\]/g;
  xml = xml.replace(splitTag, '[$1]');
  zip.file('word/document.xml', xml);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: '[', end: ']' },
    parser: tag => ({ get: scope => scope[tag] }),
  });

  doc.setData(templateData);

  try {
    doc.render();
  } catch (err) {
    console.error('Erro ao preencher o contrato:', err);
    return res.status(500).json({ error: 'Erro ao preencher o contrato' });
  }

  const buffer = doc.getZip().generate({ type: 'nodebuffer' });
  const filename = 'Contrato Preenchido.docx';
  const outputPath = path.join(process.cwd(), filename);
  try {
    await fs.writeFile(outputPath, buffer);
  } catch (err) {
    console.error('Falha ao salvar contrato:', err);
    // continua mesmo se nao conseguir salvar o arquivo
  }
  await fs.writeFile(outputPath, buffer);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'rba1807@gmail.com',
      subject: 'Contrato preenchido',
      text: 'Segue o contrato preenchido em anexo.',
      attachments: [
        {
          filename,
          content: buffer,
        },
      ],
    });
  } catch (err) {
    console.error('Falha ao enviar email:', err);
    return res.status(500).json({
      error: 'Falha ao enviar email',
      details: err.message,
    });
    return res.status(500).json({ error: 'Falha ao enviar email' });
  }

  return res.status(200).json({ status: 'success' });
}
