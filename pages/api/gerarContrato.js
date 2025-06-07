export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    // Aqui, você pode processar os dados recebidos conforme necessário
    return res.status(200).json({ message: 'Dados recebidos', data });
  }
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
