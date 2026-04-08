import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from "recharts";
import axios from 'axios';

const Dashboard = () => {
  const [itens, setItens] = useState([
    {
      id: 1,
      nome: "Evelyn Macedo",
      horario: "9:00 AM",
      procedimento: "Lavagem e Pintura",
      contato: 75999999999
    },
    {
      id: 2,
      nome: "Carlos Fausto",
      horario: "9:00 AM",
      procedimento: "Lavagem e Pintura",
      contato: 75999999999
    },
    {
      id: 3,
      nome: "Carlos Fausto",
      horario: "9:00 AM",
      procedimento: "Lavagem e Pintura",
      contato: 75999999999
    },
    {
      id: 4,
      nome: "Carlos Fausto",
      horario: "9:00 AM",
      procedimento: "Lavagem e Pintura",
      contato: 75999999999
    },
  ]);
  const [agendamentos, setAgendamentos] = useState([]);
  useEffect(() => {

    //agendamentos
    axios.get('http://localhost:3000/agendamentos/detalhes2')
      .then((response) => {
        setAgendamentos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar serviços:", error);
        toast.error("Erro ao carregar os serviços!");
      });

  }, []);

  // gráfico
  const getMonthName = (date) =>
    date.toLocaleString("pt-BR", { month: "short" }).toUpperCase();

  const now = new Date();

  const month0 = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const month1 = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const month2 = new Date(now.getFullYear(), now.getMonth(), 1);

  const contagemPorMes = {};

  agendamentos.forEach(item => {
    const mes = new Date(item.data).toLocaleString("pt-BR", { month: "short" }).toUpperCase();
    contagemPorMes[mes] = (contagemPorMes[mes] || 0) + 1;
  });

  const data = Object.keys(contagemPorMes).map(mes => ({
    name: mes,
    valor: contagemPorMes[mes]
  }));


  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarHora = (hora) => {
    
    return hora.slice(0, 5);
  };


  return (
    <div className='w-screen flex h-screen'>
      <Navbar />
      <main className='p-6 w-screen h-full'>
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <div className='flex justify-center gap-24 mb-3'>
          {/* gráfico 1 */}
          <div>
            <h3 className='font-bold text-xs'>Agendamentos</h3>
            <div className="bg-transparent p-2 rounded-2xl text-xs">
              <LineChart width={250} height={150} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="valor" stroke="#ea580c" strokeWidth={3} />
              </LineChart>
            </div>
          </div>

        </div>

        {/* tabela */}
        <div className="max-h-[40vh] w-full overflow-y-auto rounded-md border">
          <table className="min-w-full bg-orange-50">
            <thead>
              <tr className="bg-orange-100 text-orange-800 border-b">
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-left">Horário</th>
                <th className="p-3 text-left">Procedimento</th>
                <th className="p-3 text-left">Contato</th>
              </tr>
            </thead>

            <tbody>
              {agendamentos.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.cliente_nome}</td>
                  <td className="p-3">{formatarData(item.data)}</td>
                  <td className="p-3">{formatarHora(item.hora)}</td>
                  <td className="p-3">{item.servico_nome}</td>
                  <td className="p-3">{item.telefone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Dashboard