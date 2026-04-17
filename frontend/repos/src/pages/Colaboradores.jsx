import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const Colaboradores = () => {

  // states
  const [busca, setBusca] = useState('');
  const [colaboradores, setColaboradores] = useState([]);
  const [colaboradoresFiltrados, setColaboradoresFiltrados] = useState([]);
  const [quantidade, setQuantidade] = useState(0);
  const [viewMode, setViewMode] = useState("GRID");
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // GET colaboradores (mantido igual)
  useEffect(() => {
    axios.get('http://localhost:3000/colaboradores')
      .then(response => {
        setColaboradores(response.data);
        setColaboradoresFiltrados(response.data);
      })
      .catch(() => toast.error('Erro ao carregar colaboradores'));
  }, []);

  //axios
  useEffect(() => {
  axios.get('http://localhost:3000/colaboradores/quantidade')
    .then(response => {
      setQuantidade(response.data.total);
    })
    .catch(error => {
      console.log("Erro:", error);
    });
}, []);

  // busca
  const buscarColaborador = () => {
    if (!busca.trim()) {
      setColaboradoresFiltrados(colaboradores);
      return;
    }

    const filtrados = colaboradores.filter(c =>
      c.nome.toLowerCase().includes(busca.toLowerCase())
    );

    setColaboradoresFiltrados(filtrados);
  };

  //modal
  const abrirModal = (colaborador) => {
    setColaboradorSelecionado(colaborador);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setColaboradorSelecionado(null);
  };

  //dados de teste
  useEffect(() => {
  const dadosMock = [
    {
      id: 1,
      idnum: "ID-0000",
      nome: "Ana Beatriz",
      cargo: "Manicure",
      status: "Ativo",
      foto: "https://i.pravatar.cc/150?img=1",
      pontoentrada: "06/04/2026 08:02",
      pontosaida: "06/04/2026 17:30",
      datadeadmissao: "15/01/2022",
      salario: "R$ 2.500,00",
      email: "m.silva@empresa.com.br",
      telefone: "(11) 98765-4321",
    },
    {
      id: 2,
      idnum: "ID-0001",
      nome: "Carlos Henrique",
      cargo: "Barbeiro",
      status: "Ativo",
      foto: "https://i.pravatar.cc/150?img=1",
      pontoentrada: "06/04/2026 09:15",
      pontosaida: "06/04/2026 18:45",
      datadeadmissao: "03/03/2024",
      salario: "R$ 3.100,00",
      email: "carlos.henrique@tech.com.br",
      telefone: "(75) 99122-3344"
    },
    {
      id: 3,
      idnum: "ID-0000",
      nome: "Juliana Souza",
      cargo: "Esteticista",
      status: "Inativo",
      foto: "https://i.pravatar.cc/150?img=1",
      pontoentrada: "06/04/2026 07:50",
      pontosaida: "06/04/2026 17:05",
      datadeadmissao: "10/11/2020",
      salario: "R$ 5.850,00",
      email: "juliana.souza@servicos.net",
      telefone: "(11) 97744-5566"
    },
    {
      id: 4,
      idnum: "ID-0000",
      nome: "Marcos Paulo",
      cargo: "Cabeleireiro",
      status: "Ativo",
      foto: "https://i.pravatar.cc/150?img=1",
      pontoentrada: "06/04/2026 08:30",
      pontosaida: "06/04/2026 18:00",
      datadeadmissao: "22/07/2025",
      salario: "R$ 2.200,00",
      email: "beatriz.santos@loja.com",
      telefone: "(21) 96655-8899"
    },
    {
      id: 5,
      idnum: "ID-0000",
      nome: "Fernanda Lima",
      cargo: "Recepcionista",
      status: "Ativo",
      foto: "https://i.pravatar.cc/150?img=1",
      pontoentrada: "06/04/2026 13:00",
      pontosaida: "06/04/2026 22:15",
      datadeadmissao: "05/09/2023",
      salario: "R$ 7.400,00",
      email: "f.almeida@consultoria.org",
      telefone: "(31) 95566-1122"
    },
    {
      id: 6,
      idnum: "ID-0000",
      nome: "Lucas Santos",
      cargo: "Massoterapeuta",
      status: "Ativo",
      foto: "https://i.pravatar.cc/150?img=1",
      pontoentrada: "06/04/2026 08:00",
      pontosaida: "06/04/2026 12:00",
      datadeadmissao: "12/02/2019",
      salario: "R$ 11.200,00",
      email: "helena.v@diretoria.com.br",
      telefone: "(41) 94477-9900"
    },
  ];

  setColaboradores(dadosMock);
  setColaboradoresFiltrados(dadosMock);
  setQuantidade(dadosMock.length);
}, []);


  return (
    <div className='w-screen flex h-screen overflow-x-hidden overflow-y-auto'>
      <Navbar />

      <Toaster position="top-center" />

      <main className='p-6 w-screen h-full'>
        <h2 className='font-bold text-2xl text-gray-800 mb-3'>Colaboradores</h2>

        {/* STATUS */}
        <section className='flex gap-4 text-gray-100 mb-4 justify-between items-center'>
          <div className='flex gap-2 items-center'>

            <div className='flex gap-4 bg-gray-950 p-3 text-xs rounded-md items-center'>
              <i className="bi bi-people text-xl"></i>
              <div>
                <p className='font-semibold'>Total de Colaboradores</p>
                <p className='text-xs'>{quantidade}</p>
              </div>
            </div>

            <div className='flex gap-4 bg-amber-700 p-3 text-xs rounded-md items-center'>
              <i className="bi bi-person-add text-xl"></i>
              <div>
                <p className='font-semibold'>Colaboradores Contratados</p>
                <p className='text-xs'>{quantidade}</p>
              </div>
            </div>

          </div>

          <a href='/addcolaborador'>
            <button className='bg-amber-600 flex gap-2 text-sm font-bold text-white p-3 h-10 rounded-md hover:bg-amber-700 items-center'>
              <i className="bi bi-plus-circle text-xl"></i>
              Adicionar Colaborador
            </button>
          </a>
        </section>

        {/* BUSCA + TOGGLE */}
        <section className='flex justify-between mb-4'>
          <div className='flex gap-2'>

            <div className='flex p-2 w-80 text-xs rounded-md border border-gray-500 gap-3 items-center'>
              <i className="bi bi-search"></i>
              <input
                type='text'
                placeholder='Nome do Colaborador'
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className='bg-transparent focus:outline-none w-full'
              />
            </div>

            <button
              onClick={buscarColaborador}
              className='w-10 h-10 bg-amber-600 rounded-md hover:bg-amber-700'
            >
              <i className="bi bi-search text-white"></i>
            </button>

          </div>

          {/* TOGGLE GRID/LIST */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("GRID")}
              className={`w-10 h-10 flex items-center justify-center rounded ${
                viewMode === "GRID"
                  ? "bg-amber-600 text-white"
                  : "border"
              }`}
            >
              <i className="bi bi-grid"></i>
            </button>

            <button
              onClick={() => setViewMode("LIST")}
              className={`w-10 h-10 flex items-center justify-center rounded ${
                viewMode === "LIST"
                  ? "bg-amber-600 text-white"
                  : "border"
              }`}
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
        </section>

        {/* CONTEÚDO */}
        <div
          className={
            viewMode === "GRID"
              ? "grid grid-cols-2 md:grid-cols-4 gap-4"
              : "flex flex-col gap-3"
          }
        >
          {colaboradoresFiltrados.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-10">
              Nenhum colaborador encontrado
            </div>
          ) : (
            colaboradoresFiltrados.map((colaborador) => (
              <div
                key={colaborador.id}
                onClick={() => abrirModal(colaborador)}
                className={`border rounded-md p-4 bg-amber-50 border-amber-300 shadow-md cursor-pointer hover:border-amber-500 hover:text-amber-800  ${
                  viewMode === "LIST" ? "flex items-center gap-4" : ""
                }`}
              >
                <div className='flex gap-2'>
                  <img src={colaborador.foto} alt={colaborador.nome} className="w-12 h-12 bg-gray-300 rounded-full" />
                <div>
                  <p className="font-semibold text-amber-900">{colaborador.nome}</p>
                  <p className="text-xs text-gray-600">{colaborador.idnum}</p>
                  <p className="text-xs text-amber-100 p-2 rounded-md bg-amber-700 w-max">
                    {colaborador.cargo}
                  </p>
                </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* modal */}
      {modalOpen && colaboradorSelecionado && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          
          {/* caixa do modal */}
          <div className="bg-amber-50 rounded-lg p-6 w-[400px] relative text-orange-950 shadow-md">

            {/* Título e Botão de Saída */}
              <div className='flex justify-between mb-2'>
                <h2 className='font-bold text-xl'>{colaboradorSelecionado.nome}</h2>
                <button onClick={() => setModalOpen(null)}>
                  <i className="bi bi-x-circle-fill text-orange-600 text-xl"></i>
                </button>
              </div>

            {/* dados */}
            <div className="flex flex-col gap-2 text-sm ">
              <div className='flex gap-2 justify-between'>
                <div className='w-full'>
                  <strong>ID</strong>
                  <p className='border border-gray-400 p-2 rounded-md mt-0'>{colaboradorSelecionado.idnum}</p>
                </div>
                <div className='w-full'>
                  <strong>Cargo</strong>
                  <p className='border border-gray-400 p-2 rounded-md mt-0'>{colaboradorSelecionado.cargo}</p>
                </div>
              </div>

              <div className='flex gap-2 justify-between'>
                <div className='w-full'>
                  <strong>Última Entrada</strong>
                  <p className='border border-gray-400 p-2 rounded-md mt-0'>{colaboradorSelecionado.pontoentrada}</p>
                </div>
                <div className='w-full'>
                  <strong>Última Saída</strong>
                  <p className='border border-gray-400 p-2 rounded-md mt-0'>{colaboradorSelecionado.pontosaida}</p>
                </div>
              </div>

              <div className='flex gap-2 justify-between'>
                <div className='w-full'>
                  <strong>data de Admissão</strong>
                  <p className='border border-gray-400 p-2 rounded-md mt-0'>{colaboradorSelecionado.datadeadmissao}</p>
                </div>
                <div className='w-full'>
                  <strong>Status</strong>{" "}
                  <p className='border border-gray-400 p-2 rounded-md'>
                    <span className=
                      {`font-bold  ${
                        colaboradorSelecionado.status === "Ativo"
                          ? "text-green-600"
                          : "text-red-500"
                    }`}>
                      {colaboradorSelecionado.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className='flex gap-2 justify-between'>
                <div className='w-full'>
                  <strong>Telefone</strong>
                  <p className='border border-gray-400 p-2 rounded-md mt-0'>{colaboradorSelecionado.telefone}</p>
                </div>
                <div className='w-full'>
                  <strong>Email</strong>
                  <p className='border border-gray-400 p-2 rounded-md mt-0'>{colaboradorSelecionado.email}</p>
                </div>
              </div>
            </div>
            <div className='w-full'>
              <strong className='text-sm'>Salário</strong>
              <p className='border border-gray-400 p-2 rounded-md mt-0'>{colaboradorSelecionado.salario}</p>
            </div>

            <div className='justify-items-center'>
              <button className='bg-amber-600 text-white p-2 rounded-md mt-4 hover:bg-amber-700 flex justify-center gap-2'>
                <i class="bi bi-box-arrow-down"></i>
                Baixar Dados Completos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Colaboradores;