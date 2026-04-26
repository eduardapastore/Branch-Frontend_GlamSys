import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Toaster, toast } from 'react-hot-toast';
import {
  XAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";

const Financeiro = () => {
  const now = new Date();
  
  const getMonthName = (date) =>
    date.toLocaleString("pt-BR", { month: "short" }).toUpperCase();

  // --- LÓGICA DE DATAS (6 MESES) ---
  const ultimos6Meses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      name: getMonthName(d),
    };
  });

  // --- DUMMY DATA ---
  const [contas_financeiras, setContasFinanceiras] = useState([
    { id: 1, nome: "Caixa Barba & Arte", saldo_atual: 1550.50 },
    { id: 2, nome: "Conta PJ - Nubank", saldo_atual: 4200.00 }
  ]);

  const [tipo_lancamento, setTipoLancamento] = useState([
    { id: 1, desc: "RECEITA" },
    { id: 2, desc: "DESPESA" },
    { id: 3, desc: "DESPESA FIXA" }
  ]);

  const [lancamento, setLancamento] = useState([
    { id: 1, descricao: "Corte + Barba (Cliente VIP)", valor: 85.00, tipo_lancamento_id: 1, data_lancamento: "25/04/2026" },
    { id: 2, descricao: "Pomada Efeito Matte", valor: 45.00, tipo_lancamento_id: 1, data_lancamento: "24/04/2026" },
    { id: 3, descricao: "Aluguel Salão", valor: 1200.00, tipo_lancamento_id: 3, data_lancamento: "05/04/2026" },
    { id: 4, descricao: "Conta de Luz", valor: 280.00, tipo_lancamento_id: 2, data_lancamento: "10/04/2026" },
    { id: 5, descricao: "Reposição de Shampoos", valor: 350.00, tipo_lancamento_id: 2, data_lancamento: "15/04/2026" },
  ]);

  // Estados do Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [conta_financeira_id, setContaFinanceiraId] = useState('');
  const [tipo_lancamento_id, setTipoLancamentoId] = useState('');

  // --- CÁLCULOS DO DASHBOARD ---
  const receitasTotais = lancamento
    .filter(l => l.tipo_lancamento_id === 1)
    .reduce((acc, l) => acc + Number(l.valor), 0);

  const despesasTotais = lancamento
    .filter(l => l.tipo_lancamento_id === 2 || l.tipo_lancamento_id === 3)
    .reduce((acc, l) => acc + Number(l.valor), 0);

  // Mapeia os 6 meses para os gráficos
  const dadosGraficoReceitas = ultimos6Meses.map((mes, i) => ({
    name: mes.name,
    valor: i === 5 ? receitasTotais : receitasTotais * (0.5 + Math.random() * 0.5)
  }));

  const dadosGraficoDespesas = ultimos6Meses.map((mes, i) => ({
    name: mes.name,
    valor: i === 5 ? despesasTotais : despesasTotais * (0.4 + Math.random() * 0.6)
  }));

  const salvarLancamentos = () => {
    if(!descricao || !valor || !tipo_lancamento_id) {
        return toast.error("Preencha os campos obrigatórios!");
    }
    const novo = {
      id: Math.random(),
      descricao,
      valor: parseFloat(valor.replace(',', '.')),
      tipo_lancamento_id: parseInt(tipo_lancamento_id),
      data_lancamento: new Date().toLocaleDateString('pt-BR'),
    };
    setLancamento([novo, ...lancamento]);
    toast.success("Lançamento salvo com sucesso!");
    setIsModalOpen(false);
    setDescricao(""); setValor("");
  };

  return (
    <main className='w-screen flex h-screen overflow-x-hidden bg-transparent'>
      <Navbar />
      <Toaster position="top-center" />
      
      <section className='p-6 w-full h-full flex flex-col'>
        <header className='flex justify-between items-center mb-6'>
          <div>
            <h2 className='font-bold text-3xl text-gray-800 tracking-tight'>Financeiro</h2>
            <p className='text-gray-500 text-sm'>Gestão de fluxo de caixa (6 meses)</p>
          </div>
          <button 
            className='flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-amber-600 text-white hover:bg-amber-700 shadow-md transition-all'
            onClick={() => setIsModalOpen(true)}
          >
            <i className="bi bi-plus-lg"></i> Novo Lançamento
          </button>
        </header>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4'>
          {/* SALDOS */}
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm lg:col-span-1">
            <h3 className="font-bold mb-4 text-gray-700 flex items-center gap-2">
              <i className="bi bi-wallet2 text-amber-600"></i> Saldos
            </h3>
            <div className='space-y-3'>
              {contas_financeiras.map((c) => (
                <div key={c.id} className="flex justify-between items-center p-3 bg-transparent rounded-xl border shadow-md border-amber-700">
                  <span className='text-gray-600 font-medium text-sm'>{c.nome}</span>
                  <span className="font-bold text-amber-900">R$ {Number(c.saldo_atual).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                </div>
              ))}
            </div>
          </div>

          {/* GRÁFICOS */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <h4 className='font-bold text-xs text-green-600 mb-4 uppercase'>Receitas (6 meses)</h4>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGraficoReceitas}>
                    <XAxis dataKey="name" hide />
                    <RechartsTooltip cursor={{fill: '#f0fdf4'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                    <Bar dataKey="valor" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <h4 className='font-bold text-xs text-red-600 mb-4 uppercase'>Despesas (6 meses)</h4>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGraficoDespesas}>
                    <XAxis dataKey="name" hide />
                    <RechartsTooltip cursor={{fill: '#fef2f2'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                    <Bar dataKey="valor" fill="#ef4444" opacity={0.8} radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* LISTA */}
        <section className='bg-amber-50 p-6 rounded-2xl border border-amber-100 flex-1 flex flex-col overflow-hidden'>
          <h3 className="font-bold text-xl text-gray-800 mb-4">Histórico Recente</h3>
          <div className='flex-1 overflow-y-auto space-y-3 pr-2'>
            {lancamento.map((item, index) => {
              const isReceita = item.tipo_lancamento_id === 1;
              return (
                <div key={index} className="p-4 bg-transparent rounded-xl flex justify-between items-center border border-amber-50 hover:border-amber-200 transition-all">
                  <div className='flex items-center gap-4'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isReceita ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      <i className={`bi ${isReceita ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.descricao}</p>
                      <p className="text-[10px] text-gray-400 uppercase">{item.data_lancamento}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-black ${isReceita ? 'text-green-600' : 'text-red-600'}`}>
                    {isReceita ? '+' : '-'} R$ {Number(item.valor).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </section>

      {/* MODAL SIMPLIFICADO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6">
            <div className='flex justify-between p-2 border-b border-gray-300 mb-3'>
              <h2 className='font-black text-gray-800 mb-2 text-lg'>NOVO LANÇAMENTO</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><i className="bi bi-x-lg"></i></button>
            </div>
            <div className=''>
              {/* TÍTULO DO LANÇAMENTO */}
              <label className='block text-xs font-bold text-gray-600 mb-1 uppercase'>título do lançamento</label>
              <input type="text" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none mb-3"  />

              {/* VALOR DO LANÇAMENTO */}
              <label className="className='block text-xs font-bold text-gray-600 mb-1 uppercase">valor do lançamento</label>
              <input type="text" placeholder="Valor R$" value={valor} onChange={e => setValor(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none mb-3" />

              {/* SELECIONAR TIPO */}
              <div className='flex justify-between gap-2 mb-3'>
                <div>
                  <label className="className='block text-xs font-bold text-gray-600 mb-1 uppercase">Tipo de despesa</label>
                  <select value={tipo_lancamento_id} onChange={e => setTipoLancamentoId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none">
                    <option value="">Tipo</option>
                    {tipo_lancamento.map(t => <option key={t.id} value={t.id}>{t.desc}</option>)}
                  </select>
                </div>
                <div>
                  <label className="className='block text-xs font-bold text-gray-600 mb-1 uppercase">Conta relacionada</label>
                  <select value={tipo_lancamento_id} onChange={e => setTipoLancamentoId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none">
                    <option value="">Conta Relacionada</option>
                    {tipo_lancamento.map(t => <option key={t.id} value={t.id}>{t.desc}</option>)}
                  </select>
                </div>
              </div>

              {/* SALVAR */}
              <div className='pt-4 border-t border-gray-300'>
                <button onClick={salvarLancamentos} className="w-full flex gap-2 justify-center text-xl bg-green-600 text-white py-3 rounded-md font-bold hover:bg-green-700">
                  <i className="bi bi-check2-circle"></i>
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Financeiro;