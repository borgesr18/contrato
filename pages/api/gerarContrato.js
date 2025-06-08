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

    // Dados mapeados corretamente
    doc.setData({
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
    });

    try {
      doc.render();
    } catch (error) {
      console.error('Erro ao preencher o contrato:', error);
      return res.status(500).json({ error: 'Erro ao preencher o contrato' });
    }

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    // Configuração do Nodemailer
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

