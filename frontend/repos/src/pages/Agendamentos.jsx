import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // Alterado para o plugin de grade de dias
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import toast, { Toaster } from 'react-hot-toast';
import InputMask from "react-input-mask";
import axios from 'axios';

const Agendamentos = () => {
  const [eventos, setEventos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [colaboradores, setColaborador] = useState([]);
  const [clientes, setClientes] = useState([]); // Adicionado estado para clientes

  // Estados dos Modais e Formulários
  const [modalAberto, setModalAberto] = useState(false);
  const [modalCliente, setModalCliente] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  // Estados dos Inputs
  const [cliente_id, setClienteId] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [servico_id, setServicoId] = useState('');
  const [colaboradores_id, setColaboradoresId] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');

  const [documento, setDocumento] = useState('');
  const [nomeRazao, setNomeRazao] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    // Carregar Serviços
    axios.get('http://localhost:3000/servicos')
      .then(res => setServicos(res.data))
      .catch(() => toast.error("Erro ao carregar serviços"));

    // Carregar Colaboradores
    axios.get('http://localhost:3000/colaboradores')
      .then(res => setColaborador(res.data))
      .catch(() => toast.error("Erro ao carregar colaboradores"));

    // Carregar Detalhes dos Agendamentos
    axios.get('http://localhost:3000/agendamentos/detalhes')
      .then((response) => {
        const eventosBD = response.data.map((ag) => ({
          id: ag.id,
          title: ag.cliente_nome || "Sem nome",
          start: `${ag.data}T${ag.hora}`,
          extendedProps: {
            observacao: ag.servico_nome || '',
            colaborador: ag.colaborador_nome || '',
            cliente: ag.cliente_nome || '',
            telefone: ag.telefone || ''
          }
        }));
        setEventos(eventosBD);
      })
      .catch(() => toast.error("Erro ao carregar agendamentos!"));
  }, []);

  const salvarAgendamento = () => {
    if (!cliente_id || !data || !hora) return toast.error("Preencha os campos obrigatórios!");

    axios.post('http://localhost:3000/agendamentos', {
      cliente_id,
      observacoes,
      servico_id,
      colaboradores_id,
      data,
      hora
    })
      .then(() => {
        toast.success('Agendamento salvo!');
        setModalAberto(false);
        // Sugestão: Recarregue a lista de agendamentos aqui para atualizar o calendário
      })
      .catch(() => toast.error('Erro ao salvar agendamento'));
  };

  const salvarCliente = () => {
    axios.post('http://localhost:3000/cliente', {
      documento,
      nome_razao: nomeRazao,
      email,
      telefone
    })
      .then(() => {
        toast.success('Cliente salvo!');
        setModalCliente(false);
      })
      .catch(() => toast.error('Erro ao salvar cliente'));
  };

  const handleDateClick = (info) => {
    const evento = eventos.find((e) => e.start.startsWith(info.dateStr));
    if (evento) {
      setEventoSelecionado(evento.extendedProps ? evento : { ...evento, extendedProps: evento });
    } else {
      toast('Nenhum agendamento nesta data!', { icon: '📅' });
    }
  };

  const handleEventClick = (info) => {
    setEventoSelecionado({
      title: info.event.title,
      start: info.event.startStr,
      ...info.event.extendedProps,
    });
  };

  return (
    <main className='flex w-screen h-screen overflow-hidden'>
      <Navbar />
      <Toaster position="top-center" />

      <div className="p-6 flex-1 overflow-y-auto bg-transparent">
        <div className='flex justify-between items-center mb-6'>
          <h2 className='font-bold text-2xl text-gray-800'>Agendamentos</h2>
          <div className='flex gap-2'>
            <button onClick={() => setModalAberto(true)} className='bg-amber-600 font-semibold text-white px-4 py-2 rounded-md hover:bg-amber-700 flex items-center gap-2 text-sm transition-all'>
              <i className="bi bi-calendar-plus"></i> Novo Agendamento
            </button>
          </div>
        </div>

        {/* Calendário Mensal */}
        <div className='p-4 rounded-xl bg-transparent h-[80vh]'>
          <FullCalendar
            locale={ptBrLocale}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            height="100%"
            events={eventos}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventContent={(arg) => (
              <div className="p-1 truncate cursor-pointer">
                <span className="font-bold uppercase text-[10px] text-amber-900">• {arg.event.title}</span>
              </div>
            )}
          />
        </div>

        {/* Modal Novo Agendamento */}
        {modalAberto && (
          <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm'>
            <div className='bg-white rounded-xl shadow-2xl p-6 w-[450px] animate-in fade-in zoom-in duration-200'>
              <div className='flex justify-between items-center mb-6 border-b pb-2'>
                <h2 className='font-bold text-xl'>Agendar Horário</h2>
                <button onClick={() => setModalAberto(false)}><i className="bi bi-x-lg text-gray-500 hover:text-red-500"></i></button>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>CLIENTE</label>
                  <input type='text' value={cliente_id} onChange={e => setClienteId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder='Ex: 123' />
                </div>

                <div className='flex gap-4'>
                  <div className='flex-1'>
                    <label className='block text-xs font-bold text-gray-600 mb-1'>DATA</label>
                    <input type='date' value={data} onChange={e => setData(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                  </div>
                  <div className='flex-1'>
                    <label className='block text-xs font-bold text-gray-600 mb-1'>HORA</label>
                    <input type='time' value={hora} onChange={e => setHora(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>SERVIÇO</label>
                  <select value={servico_id} onChange={e => setServicoId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none">
                    <option value="">Selecione...</option>
                    {servicos.map(s => <option key={s.id} value={s.id}>{s.descricao}</option>)}
                  </select>
                </div>

                <div>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>COLABORADOR</label>
                  <select value={colaboradores_id} onChange={e => setColaboradoresId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none">
                    <option value="">Selecione...</option>
                    {colaboradores.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>

                <button onClick={salvarAgendamento} className='w-full bg-green-600 text-white font-bold py-3 rounded-lg mt-4 hover:bg-green-700 transition-colors flex items-center justify-center gap-2'>
                  <i className="bi bi-check2-circle"></i> Confirmar Agendamento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Agendamentos;