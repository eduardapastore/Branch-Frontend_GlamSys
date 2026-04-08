import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Toaster, toast } from 'react-hot-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from "recharts";
import Tooltip from '../../components/Tooltip';
import axios from "axios";


const Financeiro = () => {
  const getMonthName = (date) =>
    date.toLocaleString("pt-BR", { month: "short" }).toUpperCase();

  const now = new Date();

  const month0 = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const month1 = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const month2 = new Date(now.getFullYear(), now.getMonth(), 1);

  const data = [
    {
      name: getMonthName(month0),
      valor: Math.floor(Math.random() * 100),
    },
    {
      name: getMonthName(month1),
      valor: Math.floor(Math.random() * 100),
    },
    {
      name: getMonthName(month2),
      valor: Math.floor(Math.random() * 100),
    },
  ];

  const [lancamentos] = useState([
    {
      meio_pagamento_id: "PIX",
      descricao: "COMPRA SHAMPOO",
      data_lancamento: "20/11/2025",
      valor: "350,00",
      tipo_lancamento_id: "DESPESA"
    }
  ]);

  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');

  const [meio_pagamento_id, setMeioPagamentoId] = useState('');
  const [meio_pagamento, setMeioPagamento] = useState([]);

  const [conta_financeira_id, setContaFinanceiraId] = useState('');
  const [contas_financeiras, setContasFinanceiras] = useState([]);

  const [tipo_lancamento_id, setTipoLancamentoId] = useState('');
  const [tipo_lancamento, setTipoLancamento] = useState([]);

  const [lancamento, setLancamento] = useState([]);
  useEffect(() => {

    //meios_pagamento
    axios.get('http://localhost:3000/meios_pagamento')
      .then((response) => {
        setMeioPagamento(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar formas de pagamento:", error);
        toast.error("Erro ao carregar formas de pagamento!");
      });

    //Contas_financeiras
    axios.get('http://localhost:3000/contas_financeiras')
      .then((response) => {
        setContasFinanceiras(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar contas:", error);
        toast.error("Erro ao carregar contas!");
      });

    //tipo_lancamentos
    axios.get('http://localhost:3000/tipo_lancamento')
      .then((response) => {
        setTipoLancamento(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar tipo de lancamentos:", error);
        toast.error("Erro ao carregar tipo delancamentos!");
      });

    //lancamentos_financeiros
    axios.get('http://localhost:3000/lancamentos')
      .then((response) => {
        setLancamento(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar lancamentos:", error);
        toast.error("Erro ao carregar lancamentos!");
      });

  }, []);

  const limparCampos = () => {
    setDescricao("");
    setValor("");
    setTipoLancamentoId("");
    setMeioPagamentoId("");
    setContaFinanceiraId("");
  };
  
  const salvarLancamentos = () => {
    console.log({
      conta_financeira_id,
      valor,
      descricao,
      meio_pagamento_id,
      tipo_lancamento_id
    });
    axios.post("http://localhost:3000/lancamentos", {
      conta_financeira_id,
      valor,
      descricao,
      meio_pagamento_id,
      tipo_lancamento_id
    })
      .then(() => {
        toast.success("Lançamento salvo!");
  
        //busca novamente os lançamentos
        return axios.get("http://localhost:3000/lancamentos");
      })
      .then((response) => {
        setLancamento(response.data); //atualiza a lista
  
        //atualiza saldos das contas
        return axios.get("http://localhost:3000/contas_financeiras");
      })
      .then((responseContas) => {
        setContasFinanceiras(responseContas.data);
        limparCampos();
        setIsModalOpen(false);
      })
      .catch(() => toast.error("Erro ao salvar lançamento"));
  };
  
  

  // MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);

  // VALOR
  const [valor_base, setSalario] = useState("");

  const handleValorOnChange = (e) => {
    const valorDigitado = e.target.value;

    // Extrai somente números
    const somenteNumeros = valorDigitado.replace(/\D/g, "");

    // Atualiza o estado com o valor formatado
    setSalario(formatarParaReal(somenteNumeros));
  };


  const formatarParaReal = (valor) => {
    if (!valor) return "";
    const numero = Number(valor.replace(/\D/g, "")) / 100;
    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };

  // Agrupar receitas (ID = 1) e despesas (ID = 2 ou 3)
  const receitas = lancamento
    .filter(l => l.tipo_lancamento_id === 1)
    .reduce((acc, l) => acc + Number(l.valor), 0);

  const despesas = lancamento
    .filter(l => l.tipo_lancamento_id === 2 || l.tipo_lancamento_id === 3)
    .reduce((acc, l) => acc + Number(l.valor), 0);

  // Gráfico simulando últimos 3 meses com valores reais de receita/despesa
  const graficoReceitas = [
    { name: getMonthName(month0), valor: receitas },
    { name: getMonthName(month1), valor: receitas },
    { name: getMonthName(month2), valor: receitas },
  ];

  const graficoDespesas = [
    { name: getMonthName(month0), valor: despesas },
    { name: getMonthName(month1), valor: despesas },
    { name: getMonthName(month2), valor: despesas },
  ];


  return (
    <main className='w-screen flex h-screen overflow-x-hidden'>
      <Navbar />
      <Toaster position="top-center" />
      <section className='p-6 w-screen h-full'>

        <section >
          {/* titulo + botões */}
          <div className='flex justify-between mb-2'>
            <h2 className='font-semibold text-lg'>Financeiro</h2>
            <div className='flex gap-2 text-xs'>
              <button className='p-2 rounded-md border border-gray-700 hover:bg-gray-700 hover:text-gray-50'>
                <i className="bi bi-clipboard2-data"></i>
                Relatório
              </button>
              <button className='p-2 rounded-md font-semibold bg-orange-600 text-orange-50 hover:bg-orange-700'
                onClick={() => setIsModalOpen(true)}
              >
                <i className="bi bi-plus"></i>
                Adicionar Lançamento
              </button>
            </div>
          </div>

          {/* gráficos */}
          <div className='flex justify-center gap-32'>
            {/* RECEITAS */}
            <div>
              <h3 className='font-bold text-xs'>Receitas</h3>
              <div className="bg-transparent p-2 rounded-2xl text-xs">
                <LineChart width={250} height={150} data={graficoReceitas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="valor" stroke="#16a34a" strokeWidth={3} />
                </LineChart>
              </div>
            </div>

            {/* DESPESAS */}
            <div>
              <h3 className='font-bold text-xs'>Despesas</h3>
              <div className="bg-transparent p-2 rounded-2xl text-xs">
                <LineChart width={250} height={150} data={graficoDespesas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="valor" stroke="#dc2626" strokeWidth={3} />
                </LineChart>
              </div>
            </div>
          </div>

          {/* SALDO DAS CONTAS */}
          <div className="mt-6 p-4 bg-transparent rounded-lg w-full max-w-xl mx-auto">
            <h3 className="font-bold mb-2 text-sm">Saldo Atual das Contas</h3>

            {contas_financeiras.length > 0 ? (
              contas_financeiras.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between border-b py-1 text-sm"
                >
                  <span>{c.nome}</span>
                  <span className="font-semibold">
                    R$ {Number(c.saldo_atual).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Nenhuma conta carregada</p>
            )}
          </div>

        </section>

        {/* lista de entradas e saídas */}
        <section >
          <div className='flex gap-2 items-baseline'>
            <h3 className='font-semibold mb-3'>Últimos Lançamentos</h3>
            <Tooltip text="Essa lista contém apenas os últimos 10 lançamentos">
              <i className="bi bi-question-circle text-gray-600"></i>
            </Tooltip>
          </div>

          <div className='flex flex-col gap-3 max-h-[35vh] overflow-y-auto pr-2'>
            {lancamento.length > 0 ? (
              lancamento.map((item, index) => {

                // Definir cor conforme tipo
                const badgeColor =
                  item.tipo_lancamento_id === 1
                    ? "bg-green-200 text-green-700"
                    : item.tipo_lancamento_id === 2
                      ? "bg-red-200 text-red-700"
                      : "bg-orange-200 text-orange-700"; // DESPESAS FIXAS

                // Definir cor do valor
                const valorColor =
                  item.tipo_lancamento_id === 1
                    ? "text-green-500"
                    : item.tipo_lancamento_id === 2
                      ? "text-red-500"
                      : "text-orange-500"; // DESPESAS FIXAS

                // Sinal antes do valor
                const sinal =
                  item.tipo_lancamento_id === 1 ? "+" : "-";

                return (
                  <div
                    key={index}
                    className="p-3 bg-transparent border border-gray-600 rounded-md flex justify-between items-center text-gray-900"
                  >
                    {/* ESQUERDA */}
                    <div>
                      <p className="text-sm font-semibold">{item.descricao}</p>
                      <p className="text-xs text-gray-500">{item.data_lancamento}</p>

                      <span
                        className={`text-xs px-2 py-1 rounded-md mt-1 inline-block ${badgeColor}`}
                      >
                        {tipo_lancamento.find(t => t.id === item.tipo_lancamento_id)?.desc || "Desconhecido"}
                      </span>
                    </div>

                    {/* DIREITA */}
                    <p className={`text-md font-bold ${valorColor}`}>
                      {sinal} R$ {item.valor}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600">Nenhum lançamento encontrado</p>
            )}

          </div>
        </section>
      </section>

      {/* MODAL */}
      {/* OBS o modal precisa salvar a data pra a formatação ficar igual a das listas */}
      {/* Tem como adicionar um trigger pra pegar a data ao salvar? */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
            <div className='flex justify-between mb-2'>
              <h2>Lançamento Financeiro</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <input
              //DESCRICAO
              type="text"
              placeholder="Descrição do Lançamento"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              className="w-full mb-2 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600"
            />

            <div className='flex gap-2 w-full mb-2'>
              <input
                //VALOR
                type="text"
                placeholder="Valor"
                value={valor}
                onChange={e => setValor(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600"
              />

              <select
                name='tipo_lancamento_id'
                value={tipo_lancamento_id}
                onChange={e => setTipoLancamentoId(e.target.value)}
                className="border w-full border-gray-400 rounded-md p-2 text-xs focus:outline-none focus:border-orange-600"
                required
              >
                <option value="">Selecione a categoria</option>
                {
                  tipo_lancamento.map((t) =>
                  (
                    <option key={t.id} value={t.id}>
                      {t.desc}
                    </option>
                  )
                  )
                }

              </select>

            </div>
            <div>
              <select
                name='meio_pagamento_id'
                value={meio_pagamento_id}
                onChange={e => setMeioPagamentoId(e.target.value)}
                className="border w-full border-gray-400 rounded-md p-2 text-xs focus:outline-none focus:border-orange-600"
                required
              >
                <option value="">Selecione um tipo de pagamento</option>
                {
                  meio_pagamento.map((p) =>
                  (
                    <option key={p.id} value={p.id}>
                      {p.tipo}
                    </option>
                  )
                  )
                }

              </select>

              <select
                name='conta_financeira_id'
                value={conta_financeira_id}
                onChange={e => setContaFinanceiraId(e.target.value)}
                className="border w-full border-gray-400 rounded-md p-2 text-xs focus:outline-none focus:border-orange-600"
                required
              >
                <option value="">Selecione uma conta</option>
                {
                  contas_financeiras.map((c) =>
                  (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  )
                  )
                }

              </select>
            </div>
            <button
              onClick={salvarLancamentos}
              type="submit"
              className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700"
            >
              Salvar
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default Financeiro