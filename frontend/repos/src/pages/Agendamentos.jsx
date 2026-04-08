import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import toast, { Toaster } from 'react-hot-toast';
import InputMask from "react-input-mask";
import axios from 'axios';


const Agendamentos = () => {

  // Crebi os agendamentos eu chamei de eventos e é aqui que vc vai puxar os dados do bd pra exibir
  // o id é importante pra que ele exiba os agendamentos de maneira correta :D
  const [eventos, setEventos] = useState([
    {
      id: '1',
      title: 'Corutney',
      start: '2025-11-12T09:30:00',
      observacao: 'Corte - Tape Fade',
      colaborador: 'Nome do Colaborador',
      cliente: 'Nome do Cliente',
      telefone: '5575999036694'
    },
  ]);
  const [cliente_id, setClienteId] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [servico_id, setServicoId] = useState('');
  const [colaboradores_id, setColaboradoresId] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [modalCliente, setModalCliente] = useState(false);
  const [documento, setDocumento] = useState('');
  const [nomeRazao, setNomeRazao] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');


  const [servicos, setServicos] = useState([]);
  const [colaboradores, setColaborador] = useState([]);
  useEffect(() => {

    //servico
    axios.get('http://localhost:3000/servicos')
      .then((response) => {
        setServicos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar serviços:", error);
        toast.error("Erro ao carregar os serviços!");
      });
    //colab
    axios.get('http://localhost:3000/colaboradores')
      .then((response) => {
        setColaborador(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar colaboradores:", error);
        toast.error("Erro ao carregar os colaboradores!");
      });

    axios.get('http://localhost:3000/agendamentos/detalhes')
      .then((response) => {
        const eventosBD = response.data.map((ag) => ({
          id: ag.id,
          title: ag.cliente_nome || "Sem nome",
          start: `${ag.data}T${ag.hora}`,
          observacao: ag.servico_nome || '',
          colaborador: ag.colaborador_nome || '',
          cliente: ag.cliente_nome || '',
          telefone: ag.telefone || ''
        }));
        setEventos(eventosBD);
      })
      .catch(() => toast.error("Erro ao carregar agendamentos!"));

  }, []);


  const salvarAgendamento = () => {
    console.log({ cliente_id, observacoes, servico_id, colaboradores_id, data, hora });
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
        // Atualizar o calendário
        setEventos([...eventos, {
          id: new Date().getTime().toString(),
          title: cliente_id, // é o ID, não objeto
          start: `${data}T${hora}`,
          observacao: observacoes,
          colaborador: colaboradores.find(c => c.id == colaboradores_id)?.nome || "",
          cliente: clientes?.find(c => c.id == cliente_id)?.nome_razao || cliente_id,
          telefone: clientes?.find(c => c.id == cliente_id)?.telefone || ""

        }]);
        setModalAberto(false);
      })
      .catch(() => toast.error('Erro ao salvar agendamento'));
  };

  const salvarCliente = async () => {
      axios.post('http://localhost:3000/cliente', {
        documento,
        nome_razao: nomeRazao,
        email,
        telefone
      })
      .then(() => {
        toast.success('cliente salvo!');
        alert("Cliente cadastrado com sucesso!");
        setModalAberto(false);
      })

  };


  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  // Adicionar evento
  const [modalAberto, setModalAberto] = useState(false);


  // 🔹 Clique em uma data (sem evento)
  const handleDateClick = (info) => {
    const evento = eventos.find((e) => e.start.startsWith(info.dateStr));
    if (evento) {
      setEventoSelecionado(evento);
    } else {
      toast('Nenhum agendamento nesta data!', {
        icon: '📅',
        style: {
          borderRadius: '8px',
          background: '#fff',
          color: '#333',
        },
      });
    }
  };

  // 🔹 Clique em um evento do calendário
  const handleEventClick = (info) => {
    console.log("Evento clicado:", info.event.title);
    const eventoClicado = {
      title: info.event.title,
      start: info.event.startStr,
      ...info.event.extendedProps,
    };
    setEventoSelecionado(eventoClicado);
  };


  return (
    <main className='flex w-screen h-screen overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-orange-600'>
      <Navbar />

      <Toaster position="top-center" />

      <div className="p-6 w-screen">
        <div id='filtros e info'>
          <h2 className='font-bold'>Agendamentos</h2>
          <div className='flex mb-3 mt-3 justify-end font-semibold'>
            <div className='flex gap-2 text-sm'>
              <button className='bg-orange-600 flex gap-2 text-gray-50 p-2 rounded-md hover:bg-orange-700'
                onClick={() => setModalCliente(true)}
              >
                <i className="bi bi-plus"></i>Novo Cliente
              </button>
              <button className='bg-orange-600 flex gap-2 text-gray-50 p-2 rounded-md hover:bg-orange-700'
                onClick={() => setModalAberto(true)}
              >
                <i className="bi bi-plus"></i>Novo Agendamento
              </button>
            </div>
          </div>
        </div>

        {/* Calendário */}
        <div className='h-[70vh] relative z-10'>
          <FullCalendar
            locale={ptBrLocale}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "timeGridDay,dayGridMonth",
            }}
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
              day: 'Dia'
            }}
            height="100%"
            fixedWeekCount={false}
            selectable={true}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDidMount={(info) => {
              info.el.style.cursor = "pointer";
            }}
            events={eventos}

            // edição do evento no calendário
            eventContent={(arg) => (
              <div className="p-1">
                <p className="font-bold text-xs text-orange-700">{arg.event.title}</p>
                <p className="text-[11px] text-gray-700">{arg.event.extendedProps.observacao}</p>
              </div>
            )}
          />
        </div>

        {/* Modal de Novo Agendamento */}
        {modalAberto && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-[480px]'>

              {/* Título e Botão de Saída */}
              <div className='flex justify-between mb-2'>
                <h2 className='font-bold text-xl'>Novo Agendamento</h2>
                <button onClick={() => setModalAberto(null)}>
                  <i className="bi bi-x-circle-fill text-orange-600 text-xl"></i>
                </button>
              </div>

              {/* Dados do Cliente */}
              <div className='border border-gray-400 border-md p-2 mb-2 rounded-md'>
                <h3 className='font-bold text-gray-600'>Insira o Código do Cliente</h3>
                {/* Input */}
                <input
                  type='text'
                  placeholder='Cliente'
                  value={cliente_id}
                  onChange={e => setClienteId(e.target.value)}
                  className="border w-full border-gray-400 rounded-md p-2 text-xs focus:outline-none focus:border-orange-600"
                />
              </div>



              <div className='border border-gray-400 border-md p-2 mb-2 rounded-md'>
                <h3 className='font-bold text-gray-600'>Data e Horário</h3>
                {/* Input */}
                <input
                  type='date'
                  placeholder='__/__/_____'
                  value={data}
                  onChange={e => setData(e.target.value)}
                  className="border mb-1 w-full border-gray-400 rounded-md p-2 text-xs focus:outline-none focus:border-orange-600"
                />
                {/* Input */}
                <input
                  type='time'
                  placeholder='00:00'
                  value={hora}
                  onChange={e => setHora(e.target.value)}
                  className='border w-full border-gray-400 rounded-md p-2 text-xs focus:outline-none focus:border-orange-600'
                />
              </div>

              {/* Procedimento */}
              <div className='border border-gray-400 border-md p-2 mb-2 rounded-md'>
                <h3 className='font-bold text-gray-600'>Serviço</h3>
                {/* Input */}
                <select
                  name='servico_id'
                  value={servico_id}
                  onChange={e => setServicoId(e.target.value)}
                  className="border w-full border-gray-400 rounded-md p-2 text-xs focus:outline-none focus:border-orange-600"
                  defaultValue=""
                  required
                >
                  <option value="">Selecione um serviço</option>
                  {
                    servicos.map((s) =>
                    (
                      <option key={s.id} value={s.id}>
                        {s.descricao}
                      </option>
                    )
                    )
                  }

                </select>
              </div>

              <div className='border border-gray-400 border-md p-2 mb-2 rounded-md'>
                <h3 className='font-bold text-gray-600'>Cabelereiro</h3>
                {/* Input */}
                <select
                  name='colaboradores_id'
                  value={colaboradores_id}
                  onChange={e => setColaboradoresId(e.target.value)}
                  className="border w-full border-gray-400 rounded-md p-2 text-xs focus:outline-none focus:border-orange-600"
                  defaultValue=""
                  required
                >
                  <option value="">Selecione um colabordador</option>
                  {
                    colaboradores.map((c) =>
                    (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    )
                    )
                  }

                </select>
              </div>
              {/* obs */}
              <div className='border border-gray-400 border-md p-2 mb-2 rounded-md'>
                <h3 className='font-bold text-gray-600'>Insira alguma observação</h3>
                {/* Input */}
                <input
                  type='text'
                  placeholder='OBS'
                  value={observacoes}
                  onChange={e => setObservacoes(e.target.value)}
                  className="border w-full border-gray-400 rounded-md p-2 text-xs focus:outline-none focus:border-orange-600"
                />
              </div>

              {/* Salvar */}
              <div className='flex items-center justify-center'>
                <button onClick={salvarAgendamento} className='rounded-md bg-green-600 p-2 flex text-orange-50 hover:bg-green-700' >
                  <i className="bi bi-floppy"></i>
                  Salvar Agendamento
                </button>
              </div>
            </div>
          </div>
        )}

        {modalCliente && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-[480px]'>

              {/* Título e Botão de Saída */}
              <div className='flex justify-between mb-2'>
                <h2 className='font-bold text-xl'>Novo Cliente</h2>
                <button onClick={() => setModalCliente(null)}>
                  <i className="bi bi-x-circle-fill text-orange-600 text-xl"></i>
                </button>
              </div>

              {/* Documento */}
              <div className='border border-gray-400 border-md p-2 mb-2 rounded-md'>
                <h3 className='font-bold text-gray-600'>Documento</h3>
                <InputMask
                  mask="999.999.999-99"
                  placeholder="CPF"
                  value={documento}
                  onChange={e => setDocumento(e.target.value)}
                  className="border w-full border-gray-400 rounded-md p-2 text-xs focus:outline-none focus:border-orange-600"
                />
              </div>

              {/* Nome / Razão Social */}
              <div className='border border-gray-400 border-md p-2 mb-2 rounded-md'>
                <h3 className='font-bold text-gray-600'>Nome</h3>
                <input
                  type='text'
                  placeholder='Digite o nome'
                  value={nomeRazao}
                  onChange={e => setNomeRazao(e.target.value)}
                  className="border w-full border-gray-400 rounded-md p-2 text-xs focus:outline-none focus:border-orange-600"
                />
              </div>

              {/* Email */}
              <div className='border border-gray-400 border-md p-2 mb-2 rounded-md'>
                <h3 className='font-bold text-gray-600'>Email</h3>
                <input
                  type='email'
                  placeholder='exemplo@email.com'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="border w-full border-gray-400 rounded-md p-2 text-xs focus:outline-none focus:border-orange-600"
                />
              </div>

              {/* Telefone */}
              <div className='border border-gray-400 border-md p-2 mb-2 rounded-md'>
                <h3 className='font-bold text-gray-600'>Telefone</h3>
                <InputMask
                  mask={"(99)\\99999-9999"}
                  placeholder='Telefone'
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                  className="border w-full border-gray-400 rounded-md p-2 text-xs focus:outline-none focus:border-orange-600"
                />
              </div>

              {/* Botão Salvar */}
              <div className='flex items-center justify-center'>
                <button
                  onClick={salvarCliente}
                  className='rounded-md bg-green-600 p-2 flex text-orange-50 hover:bg-green-700'
                >
                  <i className="bi bi-floppy"></i>
                  Salvar Cliente
                </button>
              </div>

            </div>
          </div>
        )}




        {/* Modal de Visualização de Agendamento que já existe */}
        {eventoSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[480px]">

              {/* Título Cliente */}
              <div className='flex justify-between mb-4'>
                <div className='flex gap-3'>
                  <img src='/src/imgs/pfp4.png' width='48px' alt='Profile' />
                  <h2 className="text-xl font-bold text-black">{eventoSelecionado.cliente}</h2>
                </div>
                <button onClick={() => setEventoSelecionado(null)}>
                  <i className="bi bi-x-circle-fill text-orange-600 text-xl"></i>
                </button>
              </div>

              {/* Data e Horário */}
              <div className='border border-gray-500 mb-2 p-2 rounded-md'>
                <h3 className='font-bold'>Data e Horário</h3>
                <p className='mb-2 text-gray-700 text-sm'>
                  {new Date(eventoSelecionado.start).toLocaleDateString('pt-BR')}
                </p>
                <p className='text-gray-700 text-sm'>
                  {new Date(eventoSelecionado.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Informações do Procedimento */}
              <div className='border border-gray-500 mb-2 p-2 rounded-md'>
                <h3 className='font-bold'>Procedimento</h3>
                <p className='text-gray-700 text-sm'>{eventoSelecionado.observacao}</p>
              </div>

              {/* Informações do Colaborador */}
              <div className='border border-gray-500 mb-2 p-2 rounded-md'>
                <h3 className='font-bold'>Colaborador Responsável</h3>
                <p className="text-sm text-gray-500 mt-1">👤 {eventoSelecionado.colaborador}</p>
              </div>

              {/* Botões de Ação */}
              <div className='flex justify-between'>
                <button className='flex gap-2 text-sm p-3 rounded-md bg-orange-600 text-orange-50 hover:bg-orange-700'
                  onClick={() => {
                    const numero = eventoSelecionado.telefone; // 👈 vem do BD
                    const msg = `Olá, ${eventoSelecionado.cliente}! Seu agendamento de ${eventoSelecionado.observacao} está marcado para ${new Date(eventoSelecionado.start).toLocaleDateString('pt-BR')} às ${new Date(eventoSelecionado.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. ✅`;
                    const link = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
                    window.open(link, '_blank');
                  }}
                >
                  <i className="bi bi-whatsapp"></i>
                  Enviar Mensagem
                </button>
                <button className='flex gap-2 text-sm p-3 rounded-md border-2 border-gray-700'>
                  <i className="bi bi-three-dots-vertical"></i>
                  Editar Informações
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