import React from 'react'
import { useState } from 'react';
import { Toaster } from 'react-hot-toast'
import Navbar from '../../components/Navbar';
import { use } from 'react';

const Clientes = () => {

  // DUMMY DATA
  const dummyClientes = [
    { id: 1, nome: "Fulano de Tal", email: "fulano@email.com", proximoagendamento: "15/09", aniversario: "2000-05-20", telefone: "75999036694", status_fidelidade: "VIP", ticketmedio: 60.00, ultimoservico: "Corte de Cabelo", dataultimoservico: "10/09", observacoes: "Cliente frequente.", precaucoes: "Alergia a amônia.", curvatura: "1", cordofio: "Preto", tipodepele: "seca", tomdepele: "Claro" },
    { id: 2, nome: "Jojo Todynho", email: "jojo@email.com", proximoagendamento: "20/09", aniversario: "1997-08-15", telefone: "75988888888", status_fidelidade: "CLIENTE NOVO", ticketmedio: 35.00, ultimoservico: "Pintura de Unhas", dataultimoservico: "05/09", observacoes: "Interessada em tratamentos.", precaucoes: "Nenhuma.", curvatura: "4", cordofio: "Castanho", tipodepele: "oleosa", tomdepele: "Escuro" },
    { id: 3, nome: "Carla Silva", email: "maria@email.com", proximoagendamento: "25/09", aniversario: "1995-12-10", telefone: "75977777777", status_fidelidade: "EM RISCO", ticketmedio: 45.00, ultimoservico: "Massagem", dataultimoservico: "01/09", observacoes: "Cliente fiel.", precaucoes: "Nenhuma.", curvatura: "2", cordofio: "Loiro", tipodepele: "normal", tomdepele: "Claro" },
  ];

  // MODAL CLIENTES
  const [isModalClientes, setisModalClientes] = useState(false);
  const [isModalAddCliente, setisModalAddCliente] = useState(false);
  const [isModalEditCliente, setisModalEditCliente] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);

  // ESTADOS DOS CAMPOS DO FORMULÁRIO (Usados tanto para Add quanto Edit se preferir, ou apenas Edit)
  const [editNome, setEditNome] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAniversario, setEditAniversario] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editCurvatura, setEditCurvatura] = useState('');
  const [editCordofio, setEditCordofio] = useState('');
  const [editTipodepele, setEditTipodepele] = useState('');
  const [editTomdepele, setEditTomdepele] = useState('');

  // FUNÇÃO PARA ABRIR EDIÇÃO
  const abrirModalEdicao = (c) => {
    setItemEditando(c);
    setEditNome(c.nome || '');
    setEditEmail(c.email || '');
    setEditAniversario(c.aniversario || '');
    setEditTelefone(c.telefone || '');
    setEditCurvatura(c.curvatura || '');
    setEditCordofio(c.cordofio || '');
    setEditTipodepele(c.tipodepele || '');
    setEditTomdepele(c.tomdepele || '');
    setisModalEditCliente(true);
  };

  const salvarEdicao = async () => {
    const dadosAtualizados = { 
      nome: editNome, 
      email: editEmail, 
      aniversario: editAniversario, 
      telefone: editTelefone, 
      curvatura: editCurvatura, 
      cordofio: editCordofio, 
      tipodepele: editTipodepele, 
      tomdepele: editTomdepele 
    };

    try {
      // await axios.put(`http://localhost:3000/clientes/${itemEditando.id}`, dadosAtualizados);
      console.log("Enviando atualização:", dadosAtualizados);
      toast.success("Cliente atualizado com sucesso!");
      setisModalEditCliente(false);
      // carregarDados(); // Sua função de refresh
    } catch (error) { 
      toast.error("Erro ao atualizar!"); 
    }
  };

  // CLIENTE SELECIONADO
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  // ESTILOS
  const statusStyles = {
  "VIP": "bg-purple-100 text-purple-700 border-purple-200 shadow-sm font-black",
  "EM RISCO": "bg-orange-100 text-orange-700 animate-pulse",
  "FIDELIDADE ATIVA": "bg-green-100 text-green-700 border-green-200",
  "CLIENTE NOVO": "bg-amber-100 text-amber-700 border-amber-200",
};

// MENSAGENS PARA WHATSAPP
// MENSAGENS PARA WHATSAPP - Use CRASES (tecla ao lado da letra P no teclado ABNT)
const MENSAGENS_STATUS = {
  "VIP": (nome) => `Olá, ${nome}! Passando para agradecer por ser uma de nossas clientes mais especiais. 🌟 Preparamos um mimo exclusivo para sua próxima visita. Vamos agendar seu horário?`,
  
  "EM RISCO": (nome) => `Oi, ${nome}! Sentimos sua falta! 💔 Faz um tempinho que não cuidamos de você! Que tal um desconto de 15% para renovarmos seu visual esta semana?`,
  
  "FIDELIDADE ATIVA": (nome) => `Olá, ${nome}! Você está pontuando muito bem no nosso programa de fidelidade! Falta apenas mais uma visita para você ganhar seu brinde. Vamos completar? 🎁`,
  
  "CLIENTE NOVO": (nome) => `Seja bem-vinda(o), ${nome}! Ficamos muito felizes com sua primeira visita. 🌸 Como foi sua experiência? Adoraríamos receber seu feedback!`,
  
  "DEFAULT": (nome) => `Olá, ${nome}! Como você está? Passando para desejar um ótimo dia!`
};
const dispararWhatsApp = (cliente) => {
  // 1. Seleciona a mensagem baseada no status
  const template = MENSAGENS_STATUS[cliente.status_fidelidade] || MENSAGENS_STATUS["DEFAULT"];
  const mensagemTexto = template(cliente.nome);

  // 2. Limpa o telefone (deixa só números)
  // Se o número vier como "71999999999", ele apenas garante que não haja espaços ou parênteses
  const telefoneLimpo = cliente.telefone.replace(/\D/g, '');

  // 3. Montagem pra a URL
  const url = `https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(mensagemTexto)}`;

  // 4. Abre em numa aba nova
  window.open(url, '_blank');
};

  return (
    <main className="w-screen flex h-screen overflow-x-hidden">
      <Toaster />
      <Navbar />

      {/* CONTEÚDO */}
      <div className='p-6 w-screen h-full overflow-y-auto'>
          <div className='flex justify-between mb-3'>
            <h1 className='font-bold text-2xl text-gray-900' >Clientes</h1>
            <div className='flex gap-2'>
              <button className='p-2 rounded-md border border-gray-700 hover:bg-gray-700 hover:text-gray-50'>
                <i className="bi bi-clipboard2-data"></i>
                Relatório
              </button>
              <button onClick={() => setisModalAddCliente(true)}
                className='flex gap-2 p-2 font-bold text-xl items-center rounded-md align-middle bg-amber-600 text-gray-50 hover:bg-amber-700 shadow-md'>
                <i className="bi bi-plus-circle text-xs"></i>
                <span className='text-sm'>Adicionar Cliente</span>
              </button>
            </div>
          </div>

          {/* DASH DE CLIENTES */}
          <div className='flex justify-between gap-4 font-semibold text-amber-50'>
            <div className='flex gap-4 bg-slate-950 p-3 text-xs rounded-md items-center shadow-md'>
                <i class="bi bi-people text-3xl"></i>
                <div>
                  <p className='font-semibold'>Total de Clientes</p>
                  <p className='text-lg'>10</p>
                </div>
            </div>

            <div className='flex gap-4 bg-slate-950 p-3 text-xs rounded-md items-center shadow-md'>
                <i className="bi bi-person-add text-3xl"></i>
                <div>
                  <p className='font-semibold'>Clientes Novos no Mês</p>
                  <p className='text-lg'>10</p>
                </div>
            </div>

            <div className='flex gap-4 bg-slate-950 p-3 text-xs rounded-md items-center shadow-md'>
                <i class="bi bi-cake2 text-3xl"></i>
                <div>
                  <p className='font-semibold'>Aniversariantes do Dia</p>
                  <p className='text-lg'>9</p>
                </div>
            </div>

            <div className='flex gap-4 bg-slate-950 p-3 text-xs rounded-md items-center shadow-md'>
                <i class="bi bi-bag-heart text-3xl"></i>
                <div>
                  <p className='font-semibold'>Serviço Mais Contratado</p>
                  <p className='text-base font-light'>Tratamento de Hidratação</p>
                </div>
            </div>
          </div>

          {/* LISTA DE CLIENTES */}
          <div className='flex justify-between align-middle mt-6'>
            <h2 className="text-gray-500 font-semibold mb-2 uppercase mt-4">Listagem de Clientes</h2>
            <div className="flex gap-2 items-center">
              <input 
                type="text" placeholder=" Pesquisar..." 
                className="w-64 border p-2 rounded-md text-sm outline-none shadow-sm focus:border-amber-600"
              />
              <button className="p-1 w-8 h-8 items-center font-bold bg-amber-600 rounded-md text-white hover:bg-amber-700 transition-all">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {dummyClientes.length > 0 ? (
              dummyClientes.map(c => (
                <button>
                    <div key={c.id} className="p-4 flex justify-between items-center bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <button
                          onClick={() => {
                        setClienteSelecionado(c);
                        setisModalClientes(true);
                      }}
                          >
                      <div className="flex items-center gap-4">
                        {/* Avatar gerado por iniciais */}
                        <div className="w-10 h-10 bg-amber-100 text-amber-700 flex items-center justify-center rounded-full font-bold">
                          {c.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 leading-none">{c.nome}</p>
                          <p className="text-xs text-gray-400 mt-1">{c.descricao}</p>
                        </div>
                      </div>
                    </button>
                    
                    <div className="text-right flex gap-6 items-center">
                      <div className='flex gap-2'>
                        <button 
                        onClick={() => abrirModalEdicao(c)}
                        className="hover:scale-110 transition-transform">
                          <i className="bi bi-pencil-square text-xl text-amber-600"></i>
                        </button >
                        <button
                        onClick={(e) => {
                          dispararWhatsApp(c);
                        }}
                        className="hover:scale-110 transition-transform">
                          <i className="bi bi-whatsapp text-xl text-green-500"></i>
                        </button>
                      </div>
                    </div>
                </div>
                </button>
              ))
            ) : (
              <p className="text-gray-400 italic">Nenhum cliente encontrado.</p>
            )}
          </div>
      </div>

      {/* --- MODAIS --- */}
      {isModalClientes && (
        <div className="fixed inset-0 text-center bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
          {/* HEADER */}
          <div className='w-1/2 rounded-md shadow-lg bg-amber-50 justify-between p-6 border-b text-start'>
           <div className='flex justify-between mb-4'>
             <h2 className='font-bold text-gray-800 text-lg'>Dados do Cliente</h2>
              <button onClick={() => {
                setisModalClientes(false);
                setClienteSelecionado(null);
              }} className="text-gray-400 hover:text-red-500"><i className="bi bi-x-lg"></i></button>
           </div>

            {/* CONTEÚDO DO MODAL */}
            <div className='p-6 space-y-4'>
              {/* HEADER DO CLIENTE */}
              <div className='flex justify-between gap-8 w-full'>
                <div className="w-16 h-16 shrink-0 bg-amber-200 text-amber-800 flex items-center justify-center rounded-full font-bold text-3xl shadow-md">
                  {clienteSelecionado.nome.charAt(0)}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 w-full'>  
                  <div className="flex flex-col justify-center">
                    <p className='text-[10px] text-amber-600 uppercase font-black tracking-widest mb-1'>Nome Completo</p>
                    <p className='text-lg font-bold text-gray-900 leading-tight'>
                      {clienteSelecionado.nome}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className='text-[10px] text-gray-900 uppercase font-black tracking-widest mb-1'>PRÓXIMO AGENDAMENTO</p>
                    <p className='text-base text-gray-700 font-bold leading-snug'>
                      {clienteSelecionado.proximoagendamento || "Sem agendamento futuro."}
                    </p>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4 border-t pt-4'>
                <div>
                  <p className='text-xs text-gray-500 uppercase font-bold'>ANIVERSÁRIO</p>
                  <p className='text-base text-gray-800 font-bold leading-snug'>
                      {clienteSelecionado.aniversario || "Nenhuma observação registrada."}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 uppercase font-bold'>STATUS</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[clienteSelecionado.status_fidelidade] || "bg-gray-100 text-gray-800"}`}>
                    {clienteSelecionado.status_fidelidade}
                  </span>
                </div>
                <div>
                  <p className='text-xs text-gray-500 uppercase font-bold'>TICKET MÉDIO</p>
                  <p className='text-base text-gray-800 font-bold leading-snug'>
                      R$ {clienteSelecionado.ticketmedio || "Nenhuma observação registrada."}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 uppercase font-bold'>ÚLTIMO SERVIÇO</p>
                  <p className='text-base text-gray-800 font-bold leading-snug'>
                      {clienteSelecionado.ultimoservico || "Nenhuma observação registrada."}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 uppercase font-bold'>DATA DO ÚLTIMO SERVIÇO</p>
                  <p className='text-base text-gray-800 font-bold leading-snug'>
                      {clienteSelecionado.dataultimoservico || "Nenhuma observação registrada."}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 uppercase font-bold'>PRECAUÇÕES</p>
                  <p className='text-base text-gray-800 font-bold leading-snug'>
                      {clienteSelecionado.precaucoes || "Nenhuma observação registrada."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      )}

      {/* MODAL DE ADIÇÃO DE CLIENTE */}
      {isModalAddCliente && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className='w-full max-w-2xl max-h-[90vh] rounded-md shadow-lg bg-amber-50 flex flex-col p-0 border-b text-start overflow-hidden'>

          {/* HEADER */}
          <div className='flex justify-between p-6 mb-0'>
            <h2 className='font-bold text-gray-800 text-lg'>Adicionar Novo Cliente</h2>
            <button onClick={() => setisModalAddCliente(false)} className="text-gray-400 hover:text-red-500">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* CONTEÚDO */}
          <div className="flex-1 overflow-y-auto p-8 mt-0 flex flex-col gap-4">
            <div className='mb-0'>
              <label className="text-[10px] font-bold text-gray-500 uppercase">NOME</label>
              <input className="w-full border border-gray-300 p-2 rounded-md text-sm outline-none focus:border-amber-600" />
            </div>

            <div className='flex flex-col md:flex-row gap-3'>
              <div className='w-full'>
                <label className="text-[10px] font-bold text-gray-500 uppercase">EMAIL</label>
                <input className="w-full border border-gray-300 p-2 rounded-md text-sm outline-none focus:border-amber-600" />
              </div>
              <div className='w-full'>
                <label className="text-[10px] font-bold text-gray-500 uppercase">DATA DE NASCIMENTO</label>
                <input type='date' className="w-full border border-gray-300 p-2 rounded-md text-sm outline-none focus:border-amber-600" />
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-3'>
              <div className='w-full'>
                <label className="text-[10px] font-bold text-gray-500 uppercase">TELEFONE</label>
                <input className="w-full border border-gray-300 p-2 rounded-md text-sm outline-none focus:border-amber-600" />
              </div>
              <div className='w-full'>
                <label className="text-[10px] font-bold text-gray-500 uppercase">CPF</label>
                <input type='text' className="w-full border border-gray-300 p-2 rounded-md text-sm outline-none focus:border-amber-600" />
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-3'>
              <div className='w-full'>
                <label className="text-[10px] font-bold text-gray-500 uppercase">CURVATURA DO FIO</label>
                <select className="w-full border border-gray-300 p-2 rounded-md text-sm outline-none focus:border-amber-600" >
                  <option value="">Selecione</option>
                  <option value="1">1A, 1B, 1C</option>
                  <option value="2">2A, 2B, 2C</option>
                  <option value="3">3A, 3B, 3C</option>
                  <option value="4">4A, 4B, 4C</option>
                </select>                
              </div>
              <div className='w-full'>
                <label className="text-[10px] font-bold text-gray-500 uppercase">COR DO FIO (ATUALMENTE)</label>
                <input type='text' className="w-full border border-gray-300 p-2 rounded-md text-sm outline-none focus:border-amber-600" />
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-3'>
              <div className='w-full'>
                <label className="text-[10px] font-bold text-gray-500 uppercase">TIPO DE PELE</label>
                <select className="w-full border border-gray-300 p-2 rounded-md text-sm outline-none focus:border-amber-600" >
                  <option value="">Selecione</option>
                  <option value="seca">Seca</option>
                  <option value="mista">Mista</option>
                  <option value="oleosa">Oleosa</option>
                </select>
              </div>
              <div className='w-full'>
                <label className="text-[10px] font-bold text-gray-500 uppercase">TOM DE PELE</label>
                <input type='text' className="w-full border border-gray-300 p-2 rounded-md text-sm outline-none focus:border-amber-600" />
              </div>
            </div>
          </div>

          {/* FOOTER - Fica fixo na base do modal */}
          <div className="p-6 border-t bg-amber-50">
            <button className="w-full bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 shadow-md">
              Salvar Cliente
            </button>
          </div>
        </div>
      </div>
    )}

   {/* MODAL EDITAR CLIENTE (isModalEditCliente) */}
      {isModalEditCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className='w-full max-w-2xl max-h-[90vh] rounded-md shadow-lg bg-amber-50 flex flex-col overflow-hidden'>
            
            <div className='flex justify-between p-6 border-b'>
              <h2 className='font-bold text-gray-800 text-lg'>Editar Cliente - <span className="text-amber-600">{editNome}</span></h2>
              <button onClick={() => setisModalEditCliente(false)} className="text-gray-400 hover:text-red-500"><i className="bi bi-x-lg"></i></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Nome Completo</label>
                <input value={editNome} onChange={(e) => setEditNome(e.target.value)} className="w-full border p-2 rounded-md text-sm focus:border-amber-600 outline-none" />
              </div>

              <div className='flex flex-col md:flex-row gap-3'>
                <div className='w-full'>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Email</label>
                  <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full border p-2 rounded-md text-sm outline-none focus:border-amber-600" />
                </div>
                <div className='w-full'>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Data de Nascimento</label>
                  <input type='date' value={editAniversario} onChange={(e) => setEditAniversario(e.target.value)} className="w-full border p-2 rounded-md text-sm outline-none focus:border-amber-600" />
                </div>
              </div>

              <div className='flex flex-col md:flex-row gap-3'>
                <div className='w-full'>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Telefone</label>
                  <input value={editTelefone} onChange={(e) => setEditTelefone(e.target.value)} className="w-full border p-2 rounded-md text-sm outline-none focus:border-amber-600" />
                </div>
                <div className='w-full'>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Cor do Fio</label>
                  <input value={editCordofio} onChange={(e) => setEditCordofio(e.target.value)} className="w-full border p-2 rounded-md text-sm outline-none focus:border-amber-600" />
                </div>
              </div>

              <div className='flex flex-col md:flex-row gap-3'>
                <div className='w-full'>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Curvatura</label>
                  <select value={editCurvatura} onChange={(e) => setEditCurvatura(e.target.value)} className="w-full border p-2 rounded-md text-sm outline-none focus:border-amber-600">
                    <option value="1">1A-1C (Liso)</option>
                    <option value="2">2A-2C (Ondulado)</option>
                    <option value="3">3A-3C (Cacheado)</option>
                    <option value="4">4A-4C (Crespo)</option>
                  </select>
                </div>
                <div className='w-full'>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Tipo de Pele</label>
                  <select value={editTipodepele} onChange={(e) => setEditTipodepele(e.target.value)} className="w-full border p-2 rounded-md text-sm outline-none focus:border-amber-600">
                    <option value="seca">Seca</option>
                    <option value="mista">Mista</option>
                    <option value="oleosa">Oleosa</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-white">
              <button onClick={salvarEdicao} className="w-full bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 shadow-md transition-colors">
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Clientes