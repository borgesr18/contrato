import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    rg: '',
    orgaoRg: '',
    estadoCivil: '',
    profissao: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    cep: '',
    quadra: '',
    lote: '',
    testemunha1Nome: '',
    testemunha1Cpf: '',
    testemunha2Nome: '',
    testemunha2Cpf: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Enviando...');
    try {
      const res = await fetch('/api/gerarContrato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('Enviado com sucesso!');
      } else {
        const errText = await res.text();
        console.error('Erro no envio:', errText);
        setStatus('Falha ao enviar.');
      }
    } catch (err) {
      console.error('Erro de rede:', err);
      setStatus('Erro ao enviar.');
    }
  };

  const input = (label, name, type = 'text') => (
    <div className="flex flex-col">
      <label className="mb-1 font-medium" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        required
        className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
      />
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-2xl font-bold text-center">Contrato</h1>
      <form onSubmit={handleSubmit} className="grid gap-4 bg-white p-6 shadow-md rounded-md sm:grid-cols-2">
        {input('Nome completo', 'nome')}
        {input('CPF', 'cpf')}
        {input('RG', 'rg')}
        {input('Órgão emissor do RG', 'orgaoRg')}
        {input('Estado civil', 'estadoCivil')}
        {input('Profissão', 'profissao')}
        {input('Endereço completo (rua)', 'endereco')}
        {input('Número', 'numero')}
        {input('Complemento', 'complemento')}
        {input('Bairro', 'bairro')}
        {input('Cidade', 'cidade')}
        {input('CEP', 'cep')}
        {input('Quadra do terreno', 'quadra')}
        {input('Número do lote', 'lote')}
        {input('Nome da Testemunha 1', 'testemunha1Nome')}
        {input('CPF da Testemunha 1', 'testemunha1Cpf')}
        {input('Nome da Testemunha 2', 'testemunha2Nome')}
        {input('CPF da Testemunha 2', 'testemunha2Cpf')}
        <div className="sm:col-span-2 flex justify-center mt-2">
          <button className="rounded bg-blue-500 px-6 py-2 font-bold text-white hover:bg-blue-700" type="submit">
            Enviar
          </button>
        </div>
        {status && <p className="sm:col-span-2 mt-2 text-center">{status}</p>}
      </form>
    </div>
  );
}
