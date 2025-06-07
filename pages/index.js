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
      if (res.ok) setStatus('Enviado com sucesso!');
      else setStatus('Falha ao enviar.');
    } catch (err) {
      setStatus('Erro ao enviar.');
    }
  };

  const input = (label, name, type = 'text') => (
    <div className="mb-4">
      <label className="block font-medium mb-1" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contrato</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
            Enviar
          </button>
        </div>
        {status && <p className="mt-4 text-center">{status}</p>}
      </form>
    </div>
  );
}
