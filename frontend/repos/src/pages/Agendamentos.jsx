import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import toast, { Toaster } from 'react-hot-toast';
import InputMask from "react-input-mask";
import axios from 'axios';

const Agendamentos = () => {
  // const [eventos, setEventos] = useState([]);
  const [eventos, setEventos] = useState([
    {
      id: 'dummy-1',
      title: 'Ana Silva (Corte e Escova)',
      start: '2026-04-24T09:00:00',
      extendedProps: {
        observacao: 'Corte e Escova',
        colaborador: 'Marcos Oliveira',
        cliente: 'Ana Silva',
        telefone: '(75) 99903-6694'
      }
    },
    {
      id: 'dummy-2',
      title: 'Bruno Souza (Barba e Hidratação)',
      start: '2026-04-24T10:30:00',
      extendedProps: {
        observacao: 'Barba e Hidratação',
        colaborador: 'Ricardo Santos',
        cliente: 'Bruno Souza',
        telefone: '(71) 97777-6666'
      }
    },
    {
      id: 'dummy-3',
      title: 'Carla Dias (Coloração)',
      start: '2026-04-24T14:00:00',
      extendedProps: {
        observacao: 'Coloração',
        colaborador: 'Marcos Oliveira',
        cliente: 'Carla Dias',
        telefone: '(71) 96666-5555'
      }
    },
    {
      id: 'dummy-4',
      title: 'Daniel Santos',
      start: '2026-04-25T08:00:00',
      extendedProps: {
        observacao: 'Barba e Hidratação',
        colaborador: 'Marcos Oliveira',
        cliente: 'Daniel Santos',
        telefone: '(71) 95555-4444'
      }
    }
  ]);

  // DUMMY DATA DA LISTA DE ESPERA
  const [listaEspera, setListaEspera] = useState([
  {
    id: 'wait-1',
    cliente: 'Mariana Costa',
    servico: 'Progressiva',
    telefone: '(71) 98888-1111',
    observacao: 'Horário Preferido: 15h'
  },
  {
    id: 'wait-2',
    cliente: 'João Pedro',
    servico: 'Corte Degradê',
    telefone: '(75) 97777-2222',
    observacao: 'Horário Preferido: 14h'
  }
]);

// DADOS
  const [servicos, setServicos] = useState([]);
  const [colaboradores, setColaborador] = useState([]);
  const [clientes, setClientes] = useState([]);

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

  // CALENDÁRIO
  const [viewMode, setViewMode] = useState('listDay'); 
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

  // const handleDateClick = (info) => {
  //   const evento = eventos.find((e) => e.start.startsWith(info.dateStr));
  //   if (evento) {
  //     setEventoSelecionado(evento.extendedProps ? evento : { ...evento, extendedProps: evento });
  //   } else {
  //     toast('Nenhum agendamento nesta data!', { icon: '📅' });
  //   }
  // };

// FUNÇÃO DO MODAL DED CLIQUE NA DATA :D
  const handleDateClick = (info) => {
    const eventoEncontrado = eventos.find((e) => e.start.startsWith(info.dateStr));
    if (eventoEncontrado) {
      // Normalizamos os dados para que o modal entenda tanto dummy quanto BD
      setEventoSelecionado({
        title: eventoEncontrado.title,
        start: eventoEncontrado.start,
        ...(eventoEncontrado.extendedProps || eventoEncontrado)
      });
    } else {
      toast('Nenhum agendamento nesta data!', { icon: '📅' });
    }
  };

// FUNÇÃO PRA ENVIO DE LINK DE PAGAMENTO VIA WHATSAPP
const enviarLinkPagamento = (evento) => {
  const dados = evento.extendedProps;

  // 1. Pega o telefone e limpa caracteres não numéricos
  const telefoneRaw = dados?.telefone || "";
  const telefone = telefoneRaw.replace(/\D/g, '');

  const nomeCompleto = dados?.cliente || evento.title || "Cliente";
  const nomeCliente = nomeCompleto.split('(')[0].trim();
  const servico = dados?.observacao || "seu procedimento";

  // Verificação de segurança
  if (!telefone || telefone.length < 10) {
    toast.error("Telefone inválido ou não cadastrado!");
    return;
  }

  // mensagem personalizada - não aguento maaaaaaaaaaaaaaaaais
 const mensagem = `Olá, ${nomeCliente}! \nTudo bem? Segue o link para o pagamento do seu agendamento de *${servico}*. Lembrando que o valor da taxa de No-Show já está incluso no serviço, e na falta sem motivos ou reagendamento - pelo menos 3h (três horas) antes - o estorno contará apenas com o valor do serviço que seria prestado. \nConfirmando o pagamento, sua vaga estará garantida!`;
  
  const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;

  // abre plmds
  const win = window.open(url, '_blank');
  
  if (win) {
    win.focus();
    toast.success("Aviso de pagamento enviado!");
  } else {
    // Se o window.open falhar (bloqueio de pop-up), o toast avisa
    toast.error("Pop-up bloqueado! Permita pop-ups para abrir o WhatsApp.");
  }
};

// FUNÇÃO DE PERSONALIZAÇÃO DO EVENTO NA AGENDA DO DIA
const renderEventContent = (eventInfo) => {
  return (
    <div className="flex justify-between w-full group items-center">
      <div className="flex flex-col items-center">
        <b className="text-amber-900 text-[10px] align-middle items-start">{eventInfo.timeText}</b>
        <span className="text-gray-800 font-medium text-base">{eventInfo.event.title}</span>
      </div>
      
      {/* Botões que aparecem no final da linha */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => {
            e.stopPropagation(); 
            // Passamos o objeto do evento do FullCalendar
            enviarLinkPagamento(eventInfo.event);
          }}
          className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all"
          title='Enviar Link de Pagamento'
        >
          <i className="bi bi-whatsapp"></i>
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toast.error("Agendamento cancelado");
          }}
          className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200"
          title="Cancelar"
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </div>
  );
}; 

// Função para clique no EVENTO (Lista ou Calendário)
  const handleEventClick = (info) => {
    setEventoSelecionado({
      title: info.event.title,
      start: info.event.startStr || info.event.start,
      ...info.event.extendedProps, 
    });
  };

  // FUNÇÃO DE MOVER A LISTA DE ESPERA PRA A AGENDA 
const moverParaAgendamentos = (item) => {
  const agora = new Date();
  const dataHoje = agora.toISOString().split('T')[0];
  const horaAgora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const novoEvento = {
    id: `moved-${Date.now()}`,
    title: `${item.cliente} (${item.servico})`,
    start: `${dataHoje}T${horaAgora}:00`,
    extendedProps: {
      cliente: item.cliente,
      observacao: item.servico,
      telefone: item.telefone,
      colaborador: 'A definir'
    }
  };

  setEventos(prev => [...prev, novoEvento]);
  setListaEspera(prev => prev.filter(i => i.id !== item.id));

  toast.success(`${item.cliente} movido para a agenda!`);
};

const avisarVagaDisponivel = (pessoaEspera) => {
  const telefone = pessoaEspera.telefone?.replace(/\D/g, '');
  
  if (!telefone) {
    return toast.error("Essa pessoa não tem telefone cadastrado!");
  }

  const mensagem = `Olá, ${pessoaEspera.cliente}! \nPassando para avisar que *acabou de surgir uma vaga* para hoje! \nComo você estava na nossa lista de espera para *${pessoaEspera.servico}*, imaginei que teria interesse. Gostaria de aproveitar esse horário? ✅`;

  const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
  
  const win = window.open(url, '_blank');

  if (win) {
    win.focus();
    toast("Convite enviado!", { icon: '📩' });
  } else {
    toast.error("Pop-up bloqueado!");
  }
};


  return (
    <main className='flex w-screen h-screen overflow-hidden'>
      <Navbar className="w-1/3"/>
      <Toaster position="top-center" />

      <div className="p-6 flex-1 overflow-y-auto bg-transparent">
        <div className='flex justify-between items-center mb-6'>
          <h2 className='font-bold text-2xl text-gray-800'>Agendamentos</h2>
          <div className='flex gap-2'>
            <button className='p-2 rounded-md border border-gray-700 hover:bg-gray-700 hover:text-gray-50'>
              <i className="bi bi-clipboard2-data"></i>
              Relatório
            </button>
            <button onClick={() => setModalAberto(true)} className='bg-amber-600 font-semibold text-white px-4 py-2 rounded-md hover:bg-amber-700 flex items-center gap-2 text-sm transition-all'>
              <i className="bi bi-calendar-plus"></i> Novo Agendamento
            </button>
          </div>
        </div>

        {/* Calendário Mensal */}
        <div className='flex flex-1 gap-2 bg-transparent h-full'>
          {/* COLUNA ESQUERDA: Agenda Estilo Tabela (Ocupa 70%) */}
          <div className='flex-[3] bg-amber-50 rounded-lg shadow-md border border-gray-200 flex flex-col'>
            {/* HEADER DO CARD COM O BOTÃO DE ALTERNÂNCIA */}
            <div className="p-2 border-b bg-transparent flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase">
                {viewMode === 'listDay' ? 'Agenda do Dia' : 'Agenda do Mês'}
              </span>

              {/* BOTÃO PARA TROCAR DE VISTA */}
              <button 
                onClick={() => setViewMode(viewMode === 'listDay' ? 'dayGridMonth' : 'listDay')}
                className="text-[10px] bg-amber-600 px-2 py-1 rounded hover:bg-amber-700 font-bold text-amber-50 flex items-center gap-1 transition-all"
              >
                <i className={`bi ${viewMode === 'listDay' ? 'bi-calendar3' : 'bi-list-ul'}`}></i>
                {viewMode === 'listDay' ? 'MÊS' : 'DIA'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 custom-calendar-compact">
              <FullCalendar
                key={viewMode} 
                locale={ptBrLocale}
                plugins={[listPlugin, dayGridPlugin, interactionPlugin]}
                initialView={viewMode}
                height="100%"
                events={eventos}
                headerToolbar={false}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                eventContent={renderEventContent}
                noEventsContent="Vazio"
              />
            </div>
          </div>

          {/* COLUNA DIREITA: LISTA DE ESPERA */}
          <div className='flex-1 flex flex-col gap-4 max-w-[500px]'>
            {/* Card de Informação Rápida */}
            <div className="bg-amber-50 border p-3 rounded-lg shadow-md">
              <h4 className="text-[10px] font-black text-gray-800 uppercase mb-2">Resumo</h4>
              <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-bold text-base uppercase">Agendamentos MENSAIS </span>
                  <span className="font-bold text-lg text-amber-700">{eventos.length}</span>
              </div>
            </div>

            <div className='bg-amber-50 rounded-lg border border-amber-200 p-2 shadow-md'>
              {/* LISTA DE ESPERA DINÂMICA */}
                <div className='bg-gray-50 p-1 border-b'>
                  <h3 className='uppercase text-xs font-bold text-amber-600 flex items-center gap-2'>
                    <i className="bi bi-hourglass-split"></i> Lista de espera ({listaEspera.length})
                  </h3>
                </div>
                
                <div className='p-2 flex flex-col gap-2 overflow-y-auto max-h-[500px] bg-transparent'>
                  {listaEspera.length === 0 ? (
                    <p className='text-center text-gray-400 text-xs py-10'>Ninguém na espera</p>
                  ) : (
                    listaEspera.map((item) => (
                      <div key={item.id} className='p-3 bg-amber-50/50 border border-amber-100 rounded-lg group hover:border-amber-400 transition-all'>
                        <div className='flex justify-between items-start'>
                          <div>
                            <p className='font-bold text-sm text-gray-800'>{item.cliente}</p>
                            <p className='text-[10px] text-amber-700 font-medium'>{item.servico}</p>
                            {item.observacao && <p className='text-[10px] text-gray-500 italic mt-1'>"{item.observacao}"</p>}
                          </div>
                          
                          <button 
                            type="button" // Garante que não dispare submit se estiver em um form
                            onClick={() => {
                              // Executa as funções em sequência
                              avisarVagaDisponivel(item); // primeiro abre o WhatsApp
                              setTimeout(() => moverParaAgendamentos(item), 100);
                              toast.success("Notificação enviada e cliente agendado!", { duration: 4000 });
                            }}
                            className='bg-white p-1.5 rounded-md shadow-sm border border-amber-200 text-amber-600 hover:bg-amber-600 hover:text-white transition-all focus:outline-none'
                            title='Agendar agora'
                          >
                            <i className="bi bi-calendar-check-fill text-sm"></i>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
            </div>
          </div>
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

        {/* Modal de Detalhes do Agendamento */}
        {eventoSelecionado && (
          <div className='fixed inset-0 bg-black/60 flex justify-center items-center z-[100] backdrop-blur-sm'>
            <div className='bg-white rounded-xl shadow-2xl p-6 w-[400px] border-t-4 border-amber-600 animate-in fade-in zoom-in duration-200'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='font-black text-lg text-gray-800 uppercase'>Detalhes do Horário</h3>
                <button onClick={() => setEventoSelecionado(null)}>
                  <i className="bi bi-x-lg text-gray-400 hover:text-red-500"></i>
                </button>
              </div>

              <div className='space-y-3'>
                <div className='flex flex-col'>
                  <span className='text-[10px] font-bold text-amber-700 uppercase'>Cliente</span>
                  <p className='text-sm font-semibold text-gray-900'>
                    {eventoSelecionado.cliente || eventoSelecionado.title}
                  </p>
                </div>

                <div className='flex gap-4'>
                  <div className='flex-1'>
                    <span className='text-[10px] font-bold text-amber-700 uppercase'>Data / Hora</span>
                    <p className='text-sm text-gray-700'>
                      {eventoSelecionado.start ? (
                        <>
                          {new Date(eventoSelecionado.start).toLocaleDateString('pt-BR')} às {' '}
                          {new Date(eventoSelecionado.start).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                        </>
                      ) : 'Horário não disponível'}
                    </p>
                  </div>
                </div>

                <div className='flex flex-col border-t pt-2'>
                  <span className='text-[10px] font-bold text-gray-500 uppercase'>Serviço</span>
                  <p className='text-sm text-gray-800'>{eventoSelecionado.observacao || 'Não informado'}</p>
                </div>

                <div className='flex flex-col'>
                  <span className='text-[10px] font-bold text-gray-500 uppercase'>Profissional</span>
                  <p className='text-sm text-gray-800'>{eventoSelecionado.colaborador || 'Não definido'}</p>
                </div>

                {eventoSelecionado.telefone && (
                  <div className='flex flex-col border-t pt-2'>
                    <span className='text-[10px] font-bold text-gray-500 uppercase'>Contato</span>
                    <p className='text-sm text-blue-600 font-medium underline'>{eventoSelecionado.telefone}</p>
                  </div>
                )}
              </div>

              <div className='mt-6 flex gap-2'>
                <button className='flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-bold hover:bg-red-100'>
                  CANCELAR
                </button>
                <button onClick={() => setEventoSelecionado(null)} className='flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-bold hover:bg-gray-200'>
                  FECHAR
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