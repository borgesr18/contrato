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

  // Mapeia os campos recebidos para os placeholders do documento
  const templateData = {
    Comprador: data.nome,
    CPF: data.cpf,
    RG: data.rg,
    Emissor: data.orgaoRg,
    'Endereço': data.endereco,
    'Número': data.numero,
    Complemento: data.complemento,
    Bairro: data.bairro,
    Cidade: data.cidade,
    CEP: data.cep,
    Quadra: data.quadra,
    Lote: data.lote,
    Testemunha: `${data.testemunha1Nome} e ${data.testemunha2Nome}`,
    'CPF Test': `${data.testemunha1Cpf} e ${data.testemunha2Cpf}`,
  };

  // Carrega o documento do contrato modelo
  const templatePath = path.join(process.cwd(), 'Contrato Vitorino.docx');
  const content = await fs.readFile(templatePath, 'binary');

  let zip = new PizZip(content);

  // Remove marcadores de correção que quebram os placeholders
  let xml = zip.file('word/document.xml').asText();
  xml = xml.replace(/<w:proofErr[^>]*\/>/g, '');
  const splitTag = /\[([A-Za-z0-9 \u00C0-\u00FF]+)<\/w:t><\/w:r>\s*<w:r[^>]*>\s*(?:<w:rPr>.*?<\/w:rPr>)?\s*<w:t>\]/g;
  xml = xml.replace(splitTag, '[$1]');
  zip.file('word/document.xml', xml);

  const parser = (tag) => ({ get: (scope) => scope[tag] });
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: '[', end: ']' },
    parser,
  });
  doc.setData(templateData);

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
}
