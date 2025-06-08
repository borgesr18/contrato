import fs from 'fs';
import path from 'path';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import nodemailer from 'nodemailer';
import { promises as fsp } from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const data = req.body;

    // Mapeia os campos recebidos para os placeholders do documento
    const templateData = {
      Comprador: data.nome,
      CPF: data.cpf,
      RG: data.rg,
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
      'CPF Test2': data.testemunha2Cpf
    };

    // Carrega e ajusta o documento Word
    const templatePath = path.join(process.cwd(), 'Contrato Vitorino.docx');
    const content = await fsp.readFile(templatePath, 'binary');
    let zip = new PizZip(content);

    // Corrigir placeholders quebrados por marcações de correção do Word
    let xml = zip.file('word/document.xml').asText();
    xml = xml.replace(/<w:proofErr[^>]*\/>/g, '');
    const splitTag = /\[([A-Za-z0-9 \u00C0-\u00FF]+)<\/w:t><\/w:r>\s*<w:r[^>]*>\s*(?:<w:rPr>.*?<\/w:rPr>)?\s*<w:t>\]/g;
    xml = xml.replace(splitTag, '[$1]');
    zip.file('word/document.xml', xml);

    // Preparar e preencher o documento
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

    // Configuração segura do e-mail via variáveis de ambiente
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

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
    console.error('Erro inesperado:', err);
    return res.status(500).json({ error: 'Erro inesperado' });
  }
}
