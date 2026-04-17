import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const Estoque = () => {
  const [aba, setAba] = useState("itens");
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [estoques, setEstoques] = useState([]);

  // Estados para Cadastro de Estoque/Item
  const [produto_id, setProdutosId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [local, setLocal] = useState('');

  // Estados para Cadastro de Fornecedor
  const [nome_razao, setnomeRazao] = useState('');
  const [documento, setDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  // Estados para Cadastro de Produto
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco_custo, setPrecoCusto] = useState('');
  const [preco_venda, setPrecoVenda] = useState('');
  const [fornecedor_id, setFornecedorId] = useState('');

  // Busca de dados inicial
  const carregarDados = () => {
    axios.get('http://localhost:3000/produtos').then(res => setProdutos(res.data)).catch(() => toast.error("Erro nos produtos"));
    axios.get('http://localhost:3000/fornecedores').then(res => setFornecedores(res.data)).catch(() => toast.error("Erro nos fornecedores"));
    axios.get('http://localhost:3000/estoques/exibir').then(res => setEstoques(res.data)).catch(() => toast.error("Erro no estoque"));
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const salvarEstoque = () => {
    axios.post('http://localhost:3000/estoques', { produto_id, quantidade, local })
      .then(() => {
        toast.success("Item adicionado ao estoque!");
        setIsModalOpen(false);
        setProdutosId(''); setQuantidade(''); setLocal('');
        carregarDados();
      })
      .catch(() => toast.error('Erro ao salvar estoque'));
  };

  const salvarFornecedor = () => {
    axios.post('http://localhost:3000/fornecedores', { nome_razao, documento, email, telefone, endereco })
      .then(() => {
        toast.success("Fornecedor salvo!");
        setIsModalOpen2(false);
        carregarDados();
      })
      .catch(() => toast.error('Erro ao salvar fornecedor'));
  };

  const salvarProduto = () => {
    axios.post('http://localhost:3000/produtos', { nome, descricao, preco_custo, preco_venda, fornecedor_id })
      .then(() => {
        toast.success("Produto cadastrado!");
        setIsModalProduto(false);
        setNome(''); setDescricao(''); setPrecoCusto(''); setPrecoVenda(''); setFornecedorId('');
        carregarDados();
      })
      .catch(() => toast.error("Erro ao salvar produto!"));
  };

  // Filtros e Listagem
  const [search, setSearch] = useState("");
  const [resultadoFiltro, setResultadoFiltro] = useState([]);

  const listaFormatada = estoques.map((e) => ({
    produto_id: e.produto_id,
    estoque_id: e.id,
    nome: e.nome_produto,
    custo: e.preco_custo,
    venda: e.preco_venda,
    descricao: e.local,
    quantidade: e.quantidade
  }));

  const filtrar = () => {
    const termo = search.toLowerCase();
    const filtrados = listaFormatada.filter((item) => item.nome.toLowerCase().includes(termo));
    setResultadoFiltro(filtrados);
  };

  const listaParaExibir = resultadoFiltro.length > 0 || search.trim() !== "" ? resultadoFiltro : listaFormatada;
  const metade = Math.ceil(listaParaExibir.length / 2);
  const lista1 = listaParaExibir.slice(0, metade);
  const lista2 = listaParaExibir.slice(metade);

  // Modais de Controle
  const [modalOpen, setModalOpen] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalProduto, setIsModalProduto] = useState(false);
  const [menuOpenItem, setMenuOpenItem] = useState(null);

  // Estados Edição
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

  const fecharModal = () => { setModalOpen(false); setItemEditando(null); };

  const salvarEdicao = async () => {
    try {
      await axios.put(`http://localhost:3000/produtos/${itemEditando.produto_id}`, { nome: editNome, preco_venda: editVenda, preco_custo: editCusto });
      await axios.put(`http://localhost:3000/estoques/${itemEditando.estoque_id}`, { local: editDescricao, quantidade: editQtd });
      toast.success("Item atualizado!");
      fecharModal();
      carregarDados();
    } catch (error) { toast.error("Erro ao atualizar!"); }
  };

  return (
    <main className="w-screen flex h-screen overflow-x-hidden">
      <Navbar />
      <Toaster />

      {/* MODAL DE EDIÇÃO */}
      {modalOpen && itemEditando && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-sm p-6 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-amber-600">Editar Item</h2>
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold uppercase text-gray-500">Nome</label>
              <input type="text" value={editNome} onChange={(e) => setEditNome(e.target.value)} className="border p-2 rounded text-sm focus:border-amber-600 outline-none" />
              
              <label className="text-xs font-bold uppercase text-gray-500">Local</label>
              <input type="text" value={editDescricao} onChange={(e) => setEditDescricao(e.target.value)} className="border p-2 rounded text-sm focus:border-amber-600 outline-none" />
              
              <div className="flex gap-2">
                <div className="flex flex-col w-1/2">
                  <label className="text-xs font-bold uppercase text-gray-500">Custo</label>
                  <input type="number" value={editCusto} onChange={(e) => setEditCusto(e.target.value)} className="border p-2 rounded text-sm" />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-xs font-bold uppercase text-gray-500">Venda</label>
                  <input type="number" value={editVenda} onChange={(e) => setEditVenda(e.target.value)} className="border p-2 rounded text-sm" />
                </div>
              </div>

              <label className="text-xs font-bold uppercase text-gray-500">Quantidade</label>
              <input type="number" value={editQtd} onChange={(e) => setEditQtd(e.target.value)} className="border p-2 rounded text-sm" />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm" onClick={fecharModal}>Cancelar</button>
              <button className="px-4 py-2 bg-amber-600 text-white rounded text-sm font-semibold" onClick={salvarEdicao}>Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}

      <section className="p-6 w-full h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className='font-bold text-2xl text-gray-800'>Estoque</h2>
          <div className="flex gap-2">
             <input 
              type="text" 
              placeholder="  Pesquisar..." 
              className="w-64 border p-2 rounded-md text-sm outline-none shadow-sm focus:border-amber-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="p-2 w-10 h-10 bg-amber-600 rounded-md text-white hover:bg-amber-700" onClick={filtrar}>
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={() => setIsModalOpen(true)} className='flex items-center gap-2 p-2 px-4 text-xs text-white font-semibold bg-amber-600 rounded-md hover:bg-amber-700'>
            <i className="bi bi-plus-lg"></i> Adicionar Item
          </button>
          <button onClick={() => setIsModalOpen2(true)} className='flex items-center gap-2 p-2 px-4 text-xs text-white font-semibold bg-amber-600 rounded-md hover:bg-amber-700'>
            <i className="bi bi-person-plus-fill"></i> Adicionar Fornecedor
          </button>
          <button onClick={() => setIsModalProduto(true)} className='flex items-center gap-2 p-2 px-4 text-xs text-white font-semibold bg-amber-600 rounded-md hover:bg-amber-700'>
            <i className="bi bi-box-seam"></i> Adicionar Produto
          </button>
        </div>

        {/* ABAS */}
        <div className="flex gap-6 mb-6 border-b">
          {["itens", "fornecedores", "produtos"].map((t) => (
            <button key={t} onClick={() => setAba(t)} className={`pb-2 text-sm font-bold uppercase transition-all ${aba === t ? "border-b-4 border-amber-600 text-amber-600" : "text-gray-400"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* CONTEÚDO */}
        {aba === "itens" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              {lista1.map((item, i) => <CardItem key={i} item={item} abrirModal={abrirModal} menuOpenItem={menuOpenItem} setMenuOpenItem={setMenuOpenItem} />)}
            </div>
            <div className="flex flex-col gap-3">
              {lista2.map((item, i) => <CardItem key={i} item={item} abrirModal={abrirModal} menuOpenItem={menuOpenItem} setMenuOpenItem={setMenuOpenItem} />)}
            </div>
          </div>
        )}

        {/* MODAL ADICIONAR ITEM (ESTOQUE) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
              <div className='flex justify-between mb-2'>
              <h2 className='font-bold'>Cadastrar Produto</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
              <div className="flex flex-col gap-3">
                <select value={produto_id} onChange={e => setProdutosId(e.target.value)} className='border p-2 rounded-md text-sm outline-none focus:border-amber-600'>
                  <option value="">Selecione um produto</option>
                  {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
                <input type="number" placeholder="Quantidade" value={quantidade} onChange={e => setQuantidade(e.target.value)} className="border p-2 rounded-md text-sm" />
                <input type="text" placeholder="Local (ex: Prateleira A)" value={local} onChange={e => setLocal(e.target.value)} className="border p-2 rounded-md text-sm" />
                <button onClick={salvarEstoque} className="bg-amber-600 text-white py-2 rounded-md font-bold mt-2">Finalizar Lançamento</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PRODUTO */}
        {isModalProduto && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
              <h2 className='font-bold mb-4'>Cadastrar Novo Produto</h2>
              <div className="flex flex-col gap-3">
                <input type="text" placeholder="Nome do Produto" value={nome} onChange={e => setNome(e.target.value)} className="border p-2 rounded-md text-sm" />
                <input type="text" placeholder="Descrição/Marca" value={descricao} onChange={e => setDescricao(e.target.value)} className="border p-2 rounded-md text-sm" />
                <input type="number" placeholder="Preço de Custo" value={preco_custo} onChange={e => setPrecoCusto(e.target.value)} className="border p-2 rounded-md text-sm" />
                <input type="number" placeholder="Preço de Venda" value={preco_venda} onChange={e => setPrecoVenda(e.target.value)} className="border p-2 rounded-md text-sm" />
                <select value={fornecedor_id} onChange={e => setFornecedorId(e.target.value)} className='border p-2 rounded-md text-sm'>
                   <option value="">Selecione o Fornecedor</option>
                   {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome_razao}</option>)}
                </select>
                <button onClick={salvarProduto} className="bg-amber-600 text-white py-2 rounded-md font-bold mt-2">Cadastrar</button>
                <button onClick={() => setIsModalProduto(false)} className="text-gray-500 text-sm">Voltar</button>
              </div>
            </div>
          </div>
        )}

        {/* Outras abas (Fornecedores e Produtos) seguem a mesma lógica simplificada */}
      </section>
    </main>
  );
};

const CardItem = ({ item, abrirModal, menuOpenItem, setMenuOpenItem }) => {
  const menuAberto = menuOpenItem === item;
  return (
    <div className="relative p-4 bg-white border border-gray-200 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-gray-800 uppercase">{item.nome}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1"><i className="bi bi-geo-alt"></i> {item.descricao}</p>
        <div className="flex gap-2 mt-2">
          <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded uppercase">Venda: R$ {item.venda}</span>
          <span className="text-[10px] font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded uppercase">Custo: R$ {item.custo}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <button onClick={() => abrirModal(item)} className="text-amber-600 hover:bg-amber-50 p-2 rounded-full"><i className="bi bi-pencil-square"></i></button>
        <p className="text-2xl font-black text-gray-800">{item.quantidade}</p>
        <p className="text-[10px] text-gray-400 font-bold">UNIDADES</p>
      </div>
    </div>
  );
};

export default Estoque;