import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const Estoque = () => {
  const [lancamentos] = useState([
    {
      nome: "shampoo - marca tal",
      custo: "",
      descricao: "Pagamento de serviço",
      quantidade: "10",
    },
    {
      nome: "condicionador - marca tal",
      custo: "",
      descricao: "Item em estoque",
      quantidade: "5",
    },
  ]);
  const [aba, setAba] = useState("itens");


  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [estoques, setEstoques] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:3000/produtos')
      .then((response) => {
        setProdutos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar Produto:", error);
        toast.error("Erro ao carregar os Produtos!");
      });

    axios.get('http://localhost:3000/fornecedores')
      .then((response) => {
        setFornecedores(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar fornecedores:", error);
        toast.error("Erro ao carregar os fornecedores!");
      });

    axios.get('http://localhost:3000/estoques/exibir')
      .then((response) => {
        setEstoques(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar Estoque:", error);
        toast.error("Erro ao carregar o estoque!");
      });
  }, []);
  const [produto_id, setProdutosId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [local, setLocal] = useState('');
  const salvarEstoque = () => {
    console.log({ produto_id, quantidade, local });
    axios.post('http://localhost:3000/estoques', {
      produto_id,
      quantidade,
      local
    })
      .catch(() => toast.error('Erro ao salvar estoque'));
  };
  //salvar fornecedores
  const [nome_razao, setnomeRazao] = useState('');
  const [documento, setDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const salvarFornecedor = () => {
    console.log({ nome_razao, documento, email, telefone, endereco });
    axios.post('http://localhost:3000/fornecedores', {
      nome_razao, documento, email, telefone, endereco
    })
      .catch(() => toast.error('Erro ao salvar estoque'));
  };

  const [search, setSearch] = useState("");

  const [resultadoFiltro, setResultadoFiltro] = useState([]);

  const filtrar = () => {
    const termo = search.toLowerCase();

    const filtrados = listaFormatada.filter((item) =>
      item.nome.toLowerCase().includes(termo)
    );

    setResultadoFiltro(filtrados);
  };

  const listaFormatada = estoques.map((e) => ({
    produto_id: e.produto_id,
    estoque_id: e.id,
    nome: e.nome_produto,
    custo: e.preco_custo,
    venda: e.preco_venda,
    descricao: e.local,
    quantidade: e.quantidade
  }));
  // Divide a lista automaticamente em duas colunas
  const listaParaExibir =
    resultadoFiltro.length > 0 || search.trim() !== ""
      ? resultadoFiltro
      : listaFormatada;

  const metade = Math.ceil(listaParaExibir.length / 2);
  const lista1 = listaParaExibir.slice(0, metade);
  const lista2 = listaParaExibir.slice(metade);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);

  const [editNome, setEditNome] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editCusto, setEditCusto] = useState("");
  const [editQtd, setEditQtd] = useState("");
  const [editVenda, setEditVenda] = useState("");

  const abrirModal = (item) => {
    setItemEditando(item);

    setEditNome(item.nome);
    setEditDescricao(item.descricao);
    setEditCusto(item.custo);
    setEditQtd(item.quantidade);
    setEditVenda(item.venda);

    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setItemEditando(null);
  };

  const salvarEdicao = async () => {
    try {
      await axios.put(`http://localhost:3000/produtos/${itemEditando.produto_id}`, {
        nome: editNome,
        preco_venda: editVenda,
        preco_custo: editCusto
      });
      await axios.put(`http://localhost:3000/estoques/${itemEditando.estoque_id}`, {
        local: editDescricao,
        quantidade: editQtd
      });


      toast.success("Item atualizado!");

      // fecha modal
      fecharModal();

      // recarrega o estoque atualizado
      const response = await axios.get("http://localhost:3000/estoques/exibir");
      setEstoques(response.data);

    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar item!");
    }
  };

  const deletarDados = async () => {
    try {
      if (!itemEditando) {
        toast.error("Nenhum item selecionado!");
        return;
      }

      const estoqueId = itemEditando.estoque_id;

      await axios.delete(`http://localhost:3000/estoques/${estoqueId}`);

      toast.success("Item deletado do estoque!");

      fecharModal();

      // recarregar lista
      const response = await axios.get("http://localhost:3000/estoques/exibir");
      setEstoques(response.data);

    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar item!");
    }
  };

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco_custo, setPrecoCusto] = useState('');
  const [preco_venda, setPrecoVenda] = useState('');
  const [fornecedor_id, setFornecedorId] = useState('');
  const salvarProduto = () => {
    axios.post('http://localhost:3000/produtos', {
      nome,
      descricao,
      preco_custo,
      preco_venda,
      fornecedor_id
    })
      .then(() => {
        toast.success("Produto cadastrado!");
        setIsModalProduto(false);

        // limpar campos
        setNome('');
        setDescricao('');
        setPrecoCusto('');
        setPrecoVenda('');
        setFornecedorId('');

        // recarregar lista
        axios.get('http://localhost:3000/produtos').then((response) => {
          setProdutos(response.data);
        });
      })
      .catch(() => toast.error("Erro ao salvar produto!"));
  };


  // Menu dropdown global
  const [menuOpenItem, setMenuOpenItem] = useState(null);

  // Modal adição de item, fornecedor e produto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalProduto, setIsModalProduto] = useState(false);

  return (
    <main className="w-screen flex h-screen overflow-x-hidden">
      <Navbar />

      {/* MODAL DE EDIÇÃO */}
      {modalOpen && itemEditando && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white w-80 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-3">Editar Item</h2>

            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold">Nome</h2>
              <input
                type="text"
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
                className="border p-2 rounded text-sm"
              />
              <h2 className="text-sm font-semibold">Local</h2>
              <input
                type="text"
                value={editDescricao}
                onChange={(e) => setEditDescricao(e.target.value)}
                className="border p-2 rounded text-sm"
              />
              <h2 className="text-sm font-semibold">Custo</h2>
              <input
                type="number"
                value={editCusto}
                onChange={(e) => setEditCusto(e.target.value)}
                className="border p-2 rounded text-sm"
              />
              <h2 className="text-sm font-semibold">Custo de venda</h2>
              <input
                type="number"
                value={editVenda}
                onChange={(e) => setEditVenda(e.target.value)}
                className="border p-2 rounded text-sm"
              />
              <h2 className="text-sm font-semibold">Quantidade</h2>
              <input
                type="number"
                value={editQtd}
                onChange={(e) => setEditQtd(e.target.value)}
                className="border p-2 rounded text-sm"
              />
            </div>


            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-1 bg-gray-400 text-white rounded"
                onClick={deletarDados}
              >
                Deletar
              </button>

              <button
                className="px-3 py-1 bg-gray-400 text-white rounded"
                onClick={fecharModal}
              >
                Cancelar
              </button>

              <button
                className="px-3 py-1 bg-orange-600 text-white rounded"
                onClick={salvarEdicao}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="p-6 w-screen h-full">
        {/* Header */}
        <div className="flex justify-between mb-3">
          <h2 className='font-semibold text-lg'>Estoque</h2>

          <div className="flex gap-2">
            <div
              id="search"
              className="flex font-light p-2 text-xs rounded-md border border-gray-500 text-gray-400 gap-3 items-center"
            >
              <i className="bi bi-search text-gray-700 text-bold"></i>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nome do Item"
                className="bg-transparent focus:outline-none"
              />
            </div>
            <button className="w-10 h-10 bg-orange-600 rounded-md hover:bg-orange-700" onClick={filtrar}>
              <i className="bi bi-search text-sm text-gray-100 text-bold"></i>
            </button>
          </div>
        </div>
        {/* BOTOES DE ADIÇAO */}
        <div className="flex gap-3 mb-2">
          <button className='p-2 text-xs text-orange-50 font-semibold bg-orange-600 rounded-md hover:bg-orange-700'
            onClick={() => setIsModalOpen(true)}
          >
            <i className="bi bi-plus"></i>
            Adicionar Item
          </button>

          <button className='p-2 text-xs text-orange-50 font-semibold bg-orange-600 rounded-md hover:bg-orange-700'
            onClick={() => setIsModalOpen2(true)}
          >
            <i className="bi bi-plus"></i>
            Adicionar fornecedor
          </button>

          <button
            className='p-2 text-xs text-orange-50 font-semibold bg-orange-600 rounded-md hover:bg-orange-700'
            onClick={() => setIsModalProduto(true)}
          >
            <i className="bi bi-plus"></i>
            Adicionar Produto
          </button>

        </div>

        {/* MODAL ADICIONAR ITEM */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
              <div className='flex justify-between mb-2'>
                <h2 className='font-semibold'>Adicionar Item</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <select id='Nome'
                value={produto_id}
                onChange={e => setProdutosId(e.target.value)}
                className='border border-gray-300 rounded-md h-9 p-2 text-sm focus:outline-none focus:border-orange-600'>
                <option value="">Selecione um item</option>
                {
                  produtos.map((i) =>
                  (
                    <option key={i.id} value={i.id}>
                      {i.nome}
                    </option>
                  )
                  )
                }
              </select>
              <div className='flex gap-2'>
                <input
                  type="number"
                  placeholder="Quantidade"
                  value={quantidade}
                  onChange={e => setQuantidade(e.target.value)}
                  className="w-full mb-2 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600"
                />

              </div>
              <input
                type="text"
                placeholder="Local"
                value={local}
                onChange={e => setLocal(e.target.value)}
                className="w-full mb-2 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600"
              />
              <button
                onClick={salvarEstoque}
                type="submit"
                className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700"
              >
                Salvar
              </button>
            </div>

          </div>
        )}


        {/* MODAL ADICIONAR fornecedor */}
        {isModalOpen2 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
              <div className='flex justify-between mb-2'>
                <h2 className='font-semibold'>Adicionar Fornecedor</h2>
                <button
                  onClick={() => setIsModalOpen2(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className='flex gap-2'>
                <input
                  type="text"
                  placeholder="nome"
                  value={nome_razao}
                  onChange={e => setnomeRazao(e.target.value)}
                  className="w-full mb-2 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600"
                />

              </div>
              <div className='flex gap-2'>
                <input
                  type="text"
                  placeholder="documento"
                  value={documento}
                  onChange={e => setDocumento(e.target.value)}
                  className="w-full mb-2 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600"
                />

              </div>
              <div className='flex gap-2'>
                <input
                  type="text"
                  placeholder="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full mb-2 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600"
                />

              </div>
              <div className='flex gap-2'>
                <input
                  type="text"
                  placeholder="telefone"
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                  className="w-full mb-2 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600"
                />

              </div>
              <div className='flex gap-2'>
                <input
                  type="text"
                  placeholder="endereco"
                  value={endereco}
                  onChange={e => setEndereco(e.target.value)}
                  className="w-full mb-2 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-orange-600"
                />

              </div>

              <button
                onClick={salvarFornecedor}
                type="submit"
                className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700"
              >
                Salvar
              </button>
            </div>

          </div>
        )}

        {/* MODAL ADICIONAR Produto */}
        {isModalProduto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
              <div className="flex justify-between mb-2">
                <h2 className="font-semibold">Adicionar Produto</h2>
                <button
                  onClick={() => setIsModalProduto(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full mb-2 border border-gray-300 rounded-md p-2 text-sm"
              />

              <input
                type="text"
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricaoProduto(e.target.value)}
                className="w-full mb-2 border border-gray-300 rounded-md p-2 text-sm"
              />

              <input
                type="number"
                placeholder="Preço de Custo"
                value={preco_custo}
                onChange={(e) => setPrecoCusto(e.target.value)}
                className="w-full mb-2 border border-gray-300 rounded-md p-2 text-sm"
              />

              <input
                type="number"
                placeholder="Preço de Venda"
                value={preco_venda}
                onChange={(e) => setPrecoVenda(e.target.value)}
                className="w-full mb-2 border border-gray-300 rounded-md p-2 text-sm"
              />

              <select
                value={fornecedor_id}
                onChange={(e) => setFornecedorId(e.target.value)}
                className="w-full mb-3 border border-gray-300 rounded-md p-2 text-sm"
              >
                <option value="">Selecione o fornecedor</option>
                { /* usa a lista de fornecedores que você já tem */}
                {fornecedores &&
                  fornecedores.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome_razao}
                    </option>
                  ))}
              </select>

              <button
                onClick={salvarProduto}
                className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700"
              >
                Salvar
              </button>
            </div>
          </div>
        )}

        {/* BARRAS DE EXIBIÇÃO */}
        <div className="flex gap-4 mb-4 border-b pb-2 text-sm">

          <button
            onClick={() => setAba("itens")}
            className={`pb-2 ${aba === "itens" ? "border-b-2 border-orange-600 font-semibold" : ""
              }`}
          >
            ITENS
          </button>

          <button
            onClick={() => setAba("fornecedores")}
            className={`pb-2 ${aba === "fornecedores" ? "border-b-2 border-orange-600 font-semibold" : ""
              }`}
          >
            FORNECEDORES
          </button>

          <button
            onClick={() => setAba("produtos")}
            className={`pb-2 ${aba === "produtos" ? "border-b-2 border-orange-600 font-semibold" : ""
              }`}
          >
            PRODUTOS
          </button>

        </div>


        {/* CONTEÚDO DAS ABAS */}
        {aba === "itens" && (
          <div className="flex gap-3">
            <div className="flex flex-col w-full gap-3 max-h-[100vh] overflow-y-auto pr-2">
              {lista1.length > 0 ? (
                lista1.map((item, index) => (
                  <CardItem
                    key={index}
                    item={item}
                    abrirModal={abrirModal}
                    menuOpenItem={menuOpenItem}
                    setMenuOpenItem={setMenuOpenItem}
                  />
                ))
              ) : (
                <p className="text-gray-600">Nenhum lançamento encontrado</p>
              )}
            </div>

            <div className="flex flex-col w-full gap-3 max-h-[100vh] overflow-y-auto pr-2">
              {lista2.length > 0 ? (
                lista2.map((item, index) => (
                  <CardItem
                    key={index}
                    item={item}
                    abrirModal={abrirModal}
                    menuOpenItem={menuOpenItem}
                    setMenuOpenItem={setMenuOpenItem}
                  />
                ))
              ) : (
                <p className="text-gray-600">Nenhum lançamento encontrado</p>
              )}
            </div>
          </div>
        )}

        {aba === "fornecedores" && (
          <div className="flex flex-col gap-3">
            {fornecedores.map((f) => (
              <div key={f.id} className="p-3 border rounded-md">
                <p className="font-semibold">{f.nome_razao}</p>
                <p className="text-xs">{f.documento}</p>
                <p className="text-xs">{f.email}</p>
                <p className="text-xs">{f.telefone}</p>
              </div>
            ))}
          </div>
        )}

        {aba === "produtos" && (
          <div className="flex flex-col gap-3">
            {produtos.map((p) => (
              <div key={p.id} className="p-3 border rounded-md">
                <p className="font-semibold">{p.nome}</p>
                <p className="text-xs">Custo: {p.preco_custo}</p>
                <p className="text-xs">Venda: {p.preco_venda}</p>
              </div>
            ))}
          </div>
        )}

      </section>
    </main>
  );
};


// COMPONENTE CARD ITEM COMPLETAMENTE CORRIGIDO
const CardItem = ({ item, abrirModal, menuOpenItem, setMenuOpenItem }) => {

  const menuAberto = menuOpenItem === item;

  const excluirItem = () => {
    console.log("Excluir item:", item);
    setMenuOpenItem(null);
  };

  return (
    <div className="relative p-3 bg-transparent border border-gray-600 rounded-md flex justify-between items-center text-gray-900">
      <div>
        <p className="text-sm font-semibold">{item.nome}</p>
        <p className="text-xs text-gray-500">{item.descricao}</p>

        <span className="text-xs px-2 bg-orange-300 text-orange-700 py-1 rounded-md mt-1 inline-block">
          {`Custo: ${item.custo}`}
        </span>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex gap-2">

          {/* Botão editar */}
          <button
            className="rounded-full p-1 h-fit w-fit text-orange-600"
            onClick={() => abrirModal(item)}
          >
            <i className="bi bi-pen-fill text-xs"></i>
          </button>

          {/* Botão menu */}
          <button
            className="rounded-full text-gray-600 p-1 h-fit w-fit"
            onClick={() =>
              setMenuOpenItem(menuAberto ? null : item)
            }
          >
            <i className="bi bi-three-dots-vertical text-xs"></i>
          </button>
        </div>

        <p className="text-2xl font-black">{`Qtd: ${item.quantidade}`}</p>

        {/* DROPDOWN */}
        {menuAberto && (
          <div className="absolute right-2 top-12 bg-white border border-gray-300 shadow-lg rounded-md z-50 w-32">
            <button
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:rounded-md"
              onClick={excluirItem}
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export default Estoque;
