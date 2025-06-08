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

  // Mapeamento de campos do formulário para o template
  const templateData = {
    Comprador: data.nome,
    EstadoCivil: data.estadoCivil,
    'Profissão': data.profissao,
  const zip = new PizZip(content);
  const xmlPath = 'word/document.xml';
  let xml = zip.file(xmlPath).asText();
  zip.file(xmlPath, xml);
    Profissao: data.profissao,
    CPF: data.cpf,
    RG: data.rg,
    Emissor: data.orgaoRg,
    Endereco: data.endereco,
    Numero: data.numero,
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

  // Fix placeholders possibly split across multiple tags
  let xml = zip.file('word/document.xml').asText();
  xml = xml.replace(/<w:proofErr[^>]*\/>/g, '');
  xml = xml.replace(/\[(?:[^\]]|<[^>]+>)*\]/g, (m) => m.replace(/<[^>]+>/g, ''));
  // Fix placeholders that Word may split across multiple runs
  // Fix placeholders split by Word correction marks
  let xml = zip.file('word/document.xml').asText();
  xml = xml.replace(/<w:proofErr[^>]*\/>/g, '');
  xml = xml.replace(
    /<w:t>\[<\/w:t><\/w:r>\s*<w:r[^>]*>\s*(?:<w:rPr>.*?<\/w:rPr>)?\s*<w:t>([^<]*)<\/w:t><\/w:r>\s*<w:r[^>]*>\s*(?:<w:rPr>.*?<\/w:rPr>)?\s*<w:t>\]/g,
    '[$1]'
  );
  zip.file('word/document.xml', xml);
  try {
    // Carrega o template .docx
    const templatePath = path.join(process.cwd(), 'Contrato Vitorino.docx');
    const content = await fs.readFile(templatePath);

    // Corrige problemas causados por marcas do Word
    let zip = new PizZip(content);
    let xml = zip.file('word/document.xml').asText();
    xml = xml.replace(/<w:proofErr[^>]*\/>/g, '');
    xml = xml.replace(
      /<w:t>\[<\/w:t><\/w:r>\s*<w:r[^>]*>\s*(?:<w:rPr>.*?<\/w:rPr>)?\s*<w:t>([^<]*)<\/w:t><\/w:r>\s*<w:r[^>]*>\s*(?:<w:rPr>.*?<\/w:rPr>)?\s*<w:t>\]/g,
      '[$1]'
    );
    zip.file('word/document.xml', xml);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: '[', end: ']' },
      parser: tag => ({ get: scope => scope[tag] }),
    });

    // Preenche os dados no contrato
    doc.setData(templateData);
    doc.render();

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    // Configura transporte de e-mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Envia o e-mail com o contrato anexado
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'rba1807@gmail.com',
      subject: 'Contrato preenchido',
      text: 'Segue o contrato preenchido em anexo.',
      attachments: [
        {
          filename: 'Contrato Preenchido.docx',
          content: buffer,
        },
      ],
    });

    return res.status(200).json({ status: 'success' });

  } catch (err) {
    console.error('Falha ao gerar ou enviar o contrato:', err);
    return res.status(500).json({
      error: 'Falha ao gerar ou enviar o contrato',
      details: err.message,
    });
  }
}
