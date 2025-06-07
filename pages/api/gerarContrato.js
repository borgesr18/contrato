export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    // Apenas confirmamos o recebimento dos dados enviados pelo formulario
    return res.status(200).json({ status: 'success', data });
  }
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
