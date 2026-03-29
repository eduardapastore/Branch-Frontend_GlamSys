import { useState, useEffect } from 'react';
import InputMask from "react-input-mask";
import Navbar from '../components/Navbar'
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const Agendamentos = () => {
  // select do status
  const [isOpen, setIsOpen] = useState(false);

  //consts
  const [busca, setBusca] = useState('');
  const [colaboradoresFiltrados, setColaboradoresFiltrados] = useState([]);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [salario_base, setSalario] = useState('');
  const [status, setStatus] = useState('');

  const [colaboradores, setColaboradores] = useState([]);
  const [quantidade, setQuantidade] = useState(0);
  useEffect(() => {
    axios.get('http://localhost:3000/colaboradores')
      .then(response => {
        setColaboradores(response.data);
        setColaboradoresFiltrados(response.data); // <- ADICIONE AQUI
      })
      .catch(() => toast.error('Erro ao carregar colaboradores'));
  }, []);

  const salvarColaboradores = () => {
    console.log({
      nome,
      cpf,
      email,
      telefone,
      cargo,
      departamento,
      salario_base,
      status
    });
    axios.post('http://localhost:3000/colaboradores', {
      nome,
      cpf,
      email,
      telefone,
      cargo,
      departamento,
      salario_base,
      status
    })
      .catch(() => toast.error('Erro ao salvar colaborador'));
  }

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


  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // popup - salvar colaborador
  const handleRegister = (e) => {
    e.preventDefault();
    toast.success("Colaborador registrado com sucesso!");
    setIsModalOpen(false);

  };

  axios.get('http://localhost:3000/colaboradores/quantidade')
    .then(response => {
      setQuantidade(response.data.total);
    })
    .catch(error => {
      console.log("Erro:", error);
    });

  return (
    <div className='w-screen flex h-screen overflow-x-hidden overflow-y-auto'>
      <Navbar />

      <Toaster position="top-center" />

      <main className='p-6 w-screen h-full'>
        <h2 className='font-bold mb-4'>Colaboradores</h2>

        {/* INFORMAÇÕES DOS COLABORADORES */}
        <section id='dashboard status' className='flex gap-4 text-gray-100 mb-4 justify-between'>
          {/* Total de Colaboradores */}
          <div id='status de colaboradores' >
            <div className='flex gap-4 bg-gray-950 p-3 text-sm rounded-md items-center'>
              <i className="bi bi-people text-4xl"></i>
              <div>
                <p className='font-medium text-md'>Total de Colaboradores</p>
                {/* Output ▼ | Use os dados do classname pliss pra a formatação ficar igual*/}
                <p className='text-xs'>{quantidade}</p>
              </div>
            </div>
          </div>

          {/* Colaboradores novos do mês (nesse mês quantos foram contratados) */}
          <div id='status de colaboradores' >
            <div className='flex gap-4 bg-orange-700 p-3 text-sm rounded-md justify-center'>
              <i className="bi bi-person-add text-4xl"></i>
              <div>
                <p className='font-medium text-md'>Colaboradores Contratados</p>
                {/* Output ▼ | Use os dados do classname pliss pra a formatação ficar igual*/}
                <p className='text-xs'>{quantidade}</p>
              </div>
            </div>
          </div>

          {/* Candidatos em Análise */}
          <div id='status de colaboradores' >
            <div className='flex gap-4 bg-orange-100 p-3 text-sm rounded-md items-center border border-orange-300'>
              <i className="bi bi-bar-chart-line text-4xl text-orange-600"></i>
              <div className='text-orange-600'>
                <p className='font-medium text-md'>Candidatos em Análise</p>
                {/* Output ▼ | Use os dados do classname pliss pra a formatação ficar igual*/}
                <p className='text-xs'>10</p>
              </div>
            </div>
          </div>
        </section>

        {/* PESQUISA DE ADIÇÃO DE COLABORADOR */}
        <section id='filters' className='flex justify-between mb-2'>
          <div id='pesquisa' className='flex gap-2'>
            {/* procurar nome do colaborador */}
            <div id='search' className='flex font-light p-2 text-xs rounded-md border border-gray-500 text-gray-400 gap-3 items-center'>
              <i className="bi bi-search text-gray-700 text-bold"></i>
              <input
                type='text'
                placeholder='Nome do Colaborador'
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className='bg-transparent focus:outline-none'
              />

            </div>
            {/* botão de pesquisa */}
            <button
              onClick={buscarColaborador}
              className='w-10 h-10 bg-orange-600 rounded-md hover:bg-orange-700'
            >
              <i className="bi bi-search text-sm text-gray-100 text-bold"></i>
            </button>

          </div>

          {/* adicionar colaborador */}
          <button
            onClick={() => setIsModalOpen(true)}
            className='bg-orange-600 flex gap-2 text-gray-50 p-2 rounded-md hover:bg-orange-700'>
            <i className="bi bi-plus-circle"></i>
            Adicionar Colaborador
          </button>

          {/* modal (adição de colaborador) */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
              <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
                {/* Botão de fechar */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                  <i className="bi bi-x-lg"></i>
                </button>

                {/* título */}
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Adicionar Colaborador</h3>

                {/* dados */}
                <form className="flex flex-col gap-3" onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Salvar colaborador");
                  handleRegister(e);
                }}>
                  {/* dados pessoais */}
                  <input
                    type="text"
                    placeholder="Nome do Colaborador"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600"
                  />
                  <div className='flex gap-2 justify-between'>
                    <InputMask
                      mask="999.999.999-99"
                      placeholder="CPF"
                      value={cpf}
                      onChange={e => setCpf(e.target.value)}
                      className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600"
                    />

                    <InputMask
                      mask={"(99)\\99999-9999"}
                      placeholder='Telefone'
                      value={telefone}
                      onChange={e => setTelefone(e.target.value)}
                      className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600"
                  />


                  {/* cargo e departamento*/}
                  <div className='flex flex-1 justify-between'>
                    <input
                      type='text'
                      placeholder='Cargo'
                      value={cargo}
                      onChange={e => setCargo(e.target.value)}
                      className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600"
                    />
                    <select id='departamento'
                      value={departamento}
                      onChange={e => setDepartamento(e.target.value)}
                      className=' border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600 w-40'>
                      <option value={"Atendimento e Serviços"}>Atendimento e Serviços</option>
                      <option value={"Recepção e Agendamento"}>Recepção e Agendamento</option>
                      <option value={"Financeiro"}>Financeiro</option>
                      <option value={"Recursos Humanos"}>Recursos Humanos</option>
                      <option value={"Marketing e Design"}>Marketing e Design</option>
                      <option value={"Gestão e Estratégia"}>Gestão e Estratégia</option>
                    </select>
                  </div>

                  {/*status e salário*/}
                  <div className='flex gap-4'>
                    <select id='status'
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className=' border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600 w-40'>
                      <option value={"ATIVO"}>ATIVO</option>
                      <option value={"INATIVO"}>INATIVO</option>
                    </select>
                    <input
                      type='text'
                      placeholder='Salário'
                      value={salario_base}
                      onChange={e => setSalario(e.target.value)}
                      className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600"
                    />
                  </div>

                  <button
                    onClick={salvarColaboradores}
                    type="submit"
                    className="bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700"
                  >
                    Salvar
                  </button>
                </form>
              </div>
            </div>
          )}
        </section>

        {/* COLABORADORES */}
        <section>
          <div className="grid grid-cols-4 gap-4 m-0 p-4 items-center">
            {colaboradoresFiltrados.length > 0 ? (
              colaboradoresFiltrados.map(colab => (
                <div
                  key={colab.id}
                  className="p-3 bg-transparent border border-gray-600 text-white rounded-md"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{colab.nome}</p>
                      <p className="text-xs font-light text-gray-600">{colab.cpf}</p>
                      <p className="p-1 bg-orange-200 text-orange-600 rounded-md font-normal text-xs">
                        {colab.departamento}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-4 text-center">Nenhum colaborador cadastrado</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Agendamentos