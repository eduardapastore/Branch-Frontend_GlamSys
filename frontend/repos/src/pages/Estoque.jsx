import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const Estoque = () => {
  // --- ESTADOS DE DADOS ---
  const [aba, setAba] = useState("itens");
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [estoques, setEstoques] = useState([]);
  const [search, setSearch] = useState("");
  const [resultadoFiltro, setResultadoFiltro] = useState([]);

  // --- ESTADOS DE CONTROLE (MODAIS) ---
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalEstoque, setisModalEstoque] = useState(false);
  const [isModalFornecedor, setisModalFornecedor] = useState(false);
  const [isModalProduto, setIsModalProduto] = useState(false);
  const [isModalExclusao, setIsModalExclusao] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);

  // --- ESTADOS DE FORMULÁRIO ---
  const [produto_id, setProdutosId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [local, setLocal] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco_custo, setPrecoCusto] = useState('');
  const [preco_venda, setPrecoVenda] = useState('');
  const [fornecedor_id, setFornecedorId] = useState('');
  const [margem, setMargem] = useState(50);

  // Estados do Fornecedor
  const [nome_razao, setnomeRazao] = useState('');
  const [documento, setDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');

  // Estados de Edição
  const [editNome, setEditNome] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editCusto, setEditCusto] = useState("");
  const [editQtd, setEditQtd] = useState("");
  const [editVenda, setEditVenda] = useState("");

  // --- LÓGICA DE CARREGAMENTO ---
  const carregarDados = () => {
    axios.get('http://localhost:3000/produtos').then(res => setProdutos(res.data)).catch(() => toast.error("Erro nos produtos"));
    axios.get('http://localhost:3000/fornecedores').then(res => setFornecedores(res.data)).catch(() => toast.error("Erro nos fornecedores"));
    axios.get('http://localhost:3000/estoques/exibir').then(res => setEstoques(res.data)).catch(() => toast.error("Erro no estoque"));
  };

  useEffect(() => { carregarDummydata(); }, []);

  // --- FUNÇÕES DE SALVAMENTO ---
  const salvarEstoque = () => {
    axios.post('http://localhost:3000/estoques', { produto_id, quantidade, local })
      .then(() => { toast.success("Lançamento concluído!"); setisModalEstoque(false); carregarDados(); })
      .catch(() => toast.error('Erro ao salvar estoque'));
  };

  const salvarProduto = () => {
    axios.post('http://localhost:3000/produtos', { nome, descricao, preco_custo, preco_venda, fornecedor_id })
      .then(() => { toast.success("Produto cadastrado!"); setIsModalProduto(false); carregarDados(); })
      .catch(() => toast.error("Erro ao salvar produto!"));
  };

  const salvarFornecedor = () => {
    const enderecoCompleto = `${rua}, ${numero} - ${bairro}, ${cidade}/${estado} (CEP: ${cep})`;
    axios.post('http://localhost:3000/fornecedores', { nome_razao, documento, email, telefone, endereco: enderecoCompleto })
      .then(() => { 
        toast.success("Fornecedor cadastrado!"); 
        setisModalFornecedor(false); 
        limparCamposFornecedor();
        carregarDados(); 
      })
      .catch(() => toast.error('Erro ao salvar fornecedor'));
  };

  const limparCamposFornecedor = () => {
    setnomeRazao(''); setDocumento(''); setEmail(''); setTelefone(''); setCep(''); 
    setCidade(''); setEstado(''); setBairro(''); setRua(''); setNumero('');
  };

  // --- EDIÇÃO ---
  const abrirModalEdicao = (item) => {
    setItemEditando(item);
    setEditNome(item.nome);
    setEditDescricao(item.descricao);
    setEditCusto(item.custo);
    setEditQtd(item.quantidade);
    setEditVenda(item.venda);
    setModalOpen(true);
  };

  const salvarEdicao = async () => {
    try {
      await axios.put(`http://localhost:3000/produtos/${itemEditando.produto_id}`, { nome: editNome, preco_venda: editVenda, preco_custo: editCusto });
      await axios.put(`http://localhost:3000/estoques/${itemEditando.estoque_id}`, { local: editDescricao, quantidade: editQtd });
      toast.success("Item atualizado!");
      setModalOpen(false);
      carregarDados();
    } catch (error) { toast.error("Erro ao atualizar!"); }
  };

  // --- FILTROS ---
  const listaFormatada = estoques.map((e) => ({
    produto_id: e.produto_id, estoque_id: e.id, nome: e.nome_produto, custo: e.preco_custo,
    venda: e.preco_venda, descricao: e.local, quantidade: e.quantidade
  }));

  const filtrar = () => {
    const termo = search.toLowerCase();
    setResultadoFiltro(listaFormatada.filter((item) => item.nome.toLowerCase().includes(termo)));
  };

  // EXIBIÇÃO
  const listaParaExibir = resultadoFiltro.length > 0 || search.trim() !== "" ? resultadoFiltro : listaFormatada;
  const metade = Math.ceil(listaParaExibir.length / 2);
  const lista1 = listaParaExibir.slice(0, metade);
  const lista2 = listaParaExibir.slice(metade);

  // DUMMY DATA
  const dummyProdutos = [
    { id: 1, nome: "Cera Depilatória Mel", descricao: "Marca Premium - 500g", preco_custo: 25.00, preco_venda: 60.00 },
    { id: 2, nome: "Óleo Pós-Depilatório", descricao: "Calmante de Camomila", preco_custo: 12.00, preco_venda: 35.00 },
    { id: 3, nome: "Kit Espátulas Madeira", descricao: "Pacote com 100un", preco_custo: 8.50, preco_venda: 15.00 }
  ];

  const dummyFornecedores = [
    { id: 1, nome_razao: "Beleza Pro Distribuidora", documento: "12.345.678/0001-90", telefone: "71999998888", email: "contato@belezapro.com", endereco: "Rua das Flores, 123 - Centro, Salvador/BA" },
    { id: 2, nome_razao: "Sudeste Cosméticos", documento: "98.765.432/0001-10", telefone: "11988887777", email: "vendas@sudeste.com", endereco: "Av. Paulista, 1000 - Bela Vista, São Paulo/SP" }
  ];

  const dummyEstoque = [
    { id: 101, produto_id: 1, nome_produto: "Cera Depilatória Mel", preco_custo: 25.00, preco_venda: 60.00, local: "Prateleira A1", quantidade: 15 },
    { id: 102, produto_id: 2, nome_produto: "Óleo Pós-Depilatório", preco_custo: 12.00, preco_venda: 35.00, local: "Armário 02", quantidade: 8 },
    { id: 103, produto_id: 3, nome_produto: "Kit Espátulas Madeira", preco_custo: 8.50, preco_venda: 15.00, local: "Estoque Central", quantidade: 42 }
  ];

  /// --- LÓGICA DE CARREGAMENTO (COM FALLBACK PARA DUMMY) ---
  const carregarDummydata = async () => {
    try {
      const resProdutos = await axios.get('http://localhost:3000/produtos');
      setProdutos(resProdutos.data);
    } catch (e) { 
      setProdutos(dummyProdutos); 
    }

    try {
      const resFornecedores = await axios.get('http://localhost:3000/fornecedores');
      setFornecedores(resFornecedores.data);
    } catch (e) { 
      setFornecedores(dummyFornecedores); 
    }

    try {
      const resEstoque = await axios.get('http://localhost:3000/estoques/exibir');
      setEstoques(resEstoque.data);
    } catch (e) { 
      setEstoques(dummyEstoque); 
    }
  };

  return (
    <main className="w-screen flex h-screen overflow-hidden bg-inherit">
      <Navbar />
      <Toaster />

      <section className="p-6 w-full h-full overflow-y-auto">
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center mb-6">
          <h2 className='font-bold text-2xl text-gray-800'>Estoque</h2>
          <div className="flex gap-2">
            <input 
              type="text" placeholder=" Pesquisar..." 
              className="w-64 border p-2 rounded-md text-sm outline-none shadow-sm focus:border-amber-600"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
            <button className="p-2 w-10 h-10 bg-amber-600 rounded-md text-white hover:bg-amber-700 transition-all" onClick={filtrar}>
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>

        {/* ABAS E BOTÕES */}
        <div className='flex justify-between items-end border-b mb-6'>
          <div className="flex gap-6">
            {["itens", "fornecedores", "produtos"].map((t) => (
              <button key={t} onClick={() => setAba(t)} className={`pb-2 text-sm font-bold uppercase transition-all ${aba === t ? "border-b-4 border-amber-600 text-amber-600" : "text-gray-400"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* CONTEÚDO CONDICIONAL */}
        <div className="pb-10">
          {aba === "itens" && (
            <div>
              <div className='flex justify-between mb-2'>
                <h3 className="text-sm font-bold text-gray-600 uppercase mb-4">Itens em Estoque</h3>
                <button onClick={() => setisModalEstoque(true)} className='flex items-center gap-2 p-2 px-4 text-xs text-white font-semibold bg-amber-600 rounded-md hover:bg-amber-700 shadow-sm'>
                  <i className="bi bi-plus-lg"></i> Adicionar item
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  {lista1.map((item, i) => <CardItem key={i} item={item} abrirModal={abrirModalEdicao} />)}
                </div>
                <div className="flex flex-col gap-3">
                  {lista2.map((item, i) => <CardItem key={i} item={item} abrirModal={abrirModalEdicao} />)}
                </div>
                {listaParaExibir.length === 0 && <p className="text-gray-400 italic">Nenhum item encontrado.</p>}
              </div>
            </div>
          )}

          {aba === "fornecedores" && (
            <div>
              <div>
                <div className='flex justify-between mb-2'>
                  <h3 className="text-sm font-bold text-gray-600 uppercase mb-4">Fornecedores Contratados</h3>
                  <button onClick={() => setisModalFornecedor(true)} className='flex items-center gap-2 p-2 px-4 text-xs text-white font-semibold bg-amber-600 rounded-md hover:bg-amber-700 shadow-sm'>
                    <i className="bi bi-plus-lg"></i> Adicionar Fornecedor
                  </button>
                </div>
            </div>
            <div className='bg-white rounded-md shadow-md border'>
              {fornecedores.map(f => (
                <div key={f.id} className="p-4 border-b last:border-0 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-amber-700">{f.nome_razao}</p>
                    <p className="text-xs text-gray-500">{f.documento} • {f.telefone}</p>
                    <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-1 rounded font-bold uppercase">{f.endereco}</span>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => window.open(`https://wa.me/${f.telefone.replace(/\D/g,'')}`)}><i className="bi bi-whatsapp text-green-600 text-2xl"></i></button>
                    <button onClick={() => window.location.href = `mailto:${f.email}`}><i className="bi bi-envelope text-amber-800 text-2xl"></i></button>
                    <button onClick={() => setIsModalExclusao(true)}><i className="bi bi-trash3 text-red-600 text-2xl"></i></button>
                  </div>
                   {listaParaExibir.length === 0 && <p className="text-gray-400 italic">Nenhum fornecedor encontrado.</p>}
                </div>
              ))}
            </div>
            </div>
          )}

          {aba === "produtos" && (
            <div>
              <div>
                <div className='flex justify-between mb-2'>
                  <h3 className="text-sm font-bold text-gray-600 uppercase mb-4">Protutos em Estoque</h3>
                  <button onClick={() => setIsModalProduto(true)} className='flex items-center gap-2 p-2 px-4 text-xs text-white font-semibold bg-amber-600 rounded-md hover:bg-amber-700 shadow-sm'>
                    <i className="bi bi-plus-lg"></i> Adicionar Produto
                  </button>
                </div>
              </div>
              {produtos.map(p => (
                <div key={p.id} className="p-3 border-b last:border-0 flex justify-between items-center align-middle bg-amber-50 mb-2 rounded-md shadow-sm">
                  <div>
                    <p className="font-bold text-gray-800">{p.nome}</p>
                    <p className="text-xs text-gray-400">{p.descricao}</p>
                  </div>
                  <div className="text-right flex gap-8">
                    <div>
                      <p className="text-sm font-black text-green-600">R$ {p.preco_venda}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Preço sugerido</p>
                    </div>
                    <div className='flex gap-2'>
                      <button><i class="bi bi-pencil-square text-2xl text-amber-600"></i></button>
                      <button onClick={() => setIsModalExclusao(true)}><i class="bi bi-trash3 text-red-600 text-2xl"></i></button>
                    </div>
                  </div>
                   {listaParaExibir.length === 0 && <p className="text-gray-400 italic">Nenhum produto encontrado.</p>}                  
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- MODAIS --- */}

      {/* 1. EDITAR */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-sm p-6 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-amber-600 border-b pb-2">Editar Item</h2>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold uppercase text-gray-500">Nome do Produto</label>
              <input type="text" value={editNome} onChange={(e) => setEditNome(e.target.value)} className="border p-2 rounded text-sm focus:border-amber-600 outline-none" />
              <label className="text-[10px] font-bold uppercase text-gray-500">Localização</label>
              <input type="text" value={editDescricao} onChange={(e) => setEditDescricao(e.target.value)} className="border p-2 rounded text-sm focus:border-amber-600 outline-none" />
              <div className="flex gap-2">
                <div className="flex flex-col w-1/2">
                  <label className="text-[10px] font-bold uppercase text-gray-500">Custo</label>
                  <input type="number" value={editCusto} onChange={(e) => setEditCusto(e.target.value)} className="border p-2 rounded text-sm outline-none" />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-[10px] font-bold uppercase text-gray-500">Venda</label>
                  <input type="number" value={editVenda} onChange={(e) => setEditVenda(e.target.value)} className="border p-2 rounded text-sm outline-none" />
                </div>
              </div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Quantidade em Estoque</label>
              <input type="number" value={editQtd} onChange={(e) => setEditQtd(e.target.value)} className="border p-2 rounded text-sm outline-none" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded text-sm font-semibold" onClick={salvarEdicao}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. NOVO ITEM NO ESTOQUE */}
      {isModalEstoque && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <div className='flex justify-between mb-4 border-b pb-2'>
              <h2 className='font-bold text-gray-800'>Lançar no Estoque</h2>
              <button onClick={() => setisModalEstoque(false)} className="text-gray-400 hover:text-red-500"><i className="bi bi-x-lg"></i></button>
            </div>
            <div className="flex flex-col gap-3">
              <label className='text-[10px] font-bold text-gray-600 uppercase'>Produto</label>
              <select value={produto_id} onChange={e => setProdutosId(e.target.value)} className='border p-2 rounded-md text-sm outline-none focus:border-amber-600'>
                <option value="">Selecione um produto</option>
                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
              <label className='text-[10px] font-bold text-gray-600 uppercase'>Quantidade de Entrada</label>
              <input type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} className="border p-2 rounded-md text-sm outline-none" />
              <label className='text-[10px] font-bold text-gray-600 uppercase'>Local de Armazenamento</label>
              <input type="text" placeholder="Ex: Gaveta 02" value={local} onChange={e => setLocal(e.target.value)} className="border p-2 rounded-md text-sm outline-none" />
              <button onClick={salvarEstoque} className="bg-green-600 text-white py-2 rounded-md font-bold mt-4 hover:bg-green-700 transition-all shadow-md">
                Confirmar Entrada
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. NOVO FORNECEDOR */}
      {isModalFornecedor && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl flex flex-col max-h-[90vh]">
            {/* HEADER DE TÍTULO */}
            <div className='flex justify-between items-center p-6 border-b'>
              <h2 className='font-bold text-gray-800 text-lg'>Novo Fornecedor</h2>
              <button onClick={() => setisModalFornecedor(false)} className="text-gray-400 hover:text-red-500"><i className="bi bi-x-lg"></i></button>
            </div>
            {/* CONTEÚDO */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <div>
                <label className='text-[10px] font-bold text-gray-500 uppercase'>Razão Social</label>
                <input type="text" value={nome_razao} onChange={e => setnomeRazao(e.target.value)} className="w-full border p-2 rounded-md text-sm outline-none focus:border-amber-600" />
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className='text-[10px] font-bold text-gray-500 uppercase'>Documento (CNPJ/CPF)</label>
                  <input type="text" value={documento} onChange={e => setDocumento(e.target.value)} className="w-full border p-2 rounded-md text-sm outline-none" />
                </div>
                <div className="w-1/2">
                  <label className='text-[10px] font-bold text-gray-500 uppercase'>Telefone</label>
                  <input type="text" value={telefone} onChange={e => setTelefone(e.target.value)} className="w-full border p-2 rounded-md text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className='text-[10px] font-bold text-gray-500 uppercase'>E-mail de Contato</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded-md text-sm outline-none" />
              </div>
              <hr />
              <div className="grid grid-cols-2 gap-2">
                <div>
                   <label className='text-[10px] font-bold text-gray-500 uppercase'>CEP</label>
                   <input type="text" value={cep} onChange={e => setCep(e.target.value)} className="w-full border p-2 rounded-md text-sm" />
                </div>
                <div>
                   <label className='text-[10px] font-bold text-gray-500 uppercase'>Cidade</label>
                   <input type="text" value={cidade} onChange={e => setCidade(e.target.value)} className="w-full border p-2 rounded-md text-sm" />
                </div>
                <div className="col-span-2">
                   <label className='text-[10px] font-bold text-gray-500 uppercase'>Rua e Número</label>
                   <div className="flex gap-2">
                    <input type="text" value={rua} onChange={e => setRua(e.target.value)} className="flex-1 border p-2 rounded-md text-sm" />
                    <input type="text" value={numero} onChange={e => setNumero(e.target.value)} className="w-20 border p-2 rounded-md text-sm" />
                   </div>
                </div>
              </div>
            </div>
            {/* SALVAR */}
            <div className="p-6 bg-gray-50 border-t">
              <button onClick={salvarFornecedor} className="w-full bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 transition-all shadow-md">
                Cadastrar Fornecedor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. NOVO PRODUTO */}
      {isModalProduto && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl flex flex-col max-h-[90vh]">
            <div className='flex justify-between items-center p-6 border-b'>
              <h2 className='font-bold text-gray-800 text-lg'>Novo Produto no Catálogo</h2>
              <button onClick={() => setIsModalProduto(false)} className="text-gray-400 hover:text-red-500"><i className="bi bi-x-lg"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Nome</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full border p-2 rounded-md text-sm outline-none focus:border-amber-600" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Marca/Descrição</label>
                <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full border p-2 rounded-md text-sm outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Fornecedor</label>
                <select value={fornecedor_id} onChange={e => setFornecedorId(e.target.value)} className='w-full border p-2 rounded-md text-sm outline-none'>
                  <option value="">Selecione o Fornecedor</option>
                  {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome_razao}</option>)}
                </select>
              </div>
              <div className="bg-amber-50 p-4 rounded-md border border-amber-700 shadow-lg">
                 <p className="text-[10px] font-bold text-amber-600 uppercase mb-2">Precificação Automática</p>
                 <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">Custo R$</label>
                      <input type="number" value={preco_custo} onChange={e => {
                        setPrecoCusto(e.target.value);
                        setPrecoVenda((parseFloat(e.target.value) * (1 + margem/100)).toFixed(2));
                      }} className="w-full border p-2 rounded text-sm" />
                    </div>
                    <div className="w-1/2">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">Margem %</label>
                      <input type="number" value={margem} onChange={e => {
                        setMargem(e.target.value);
                        setPrecoVenda((parseFloat(preco_custo) * (1 + e.target.value/100)).toFixed(2));
                      }} className="w-full border p-2 rounded text-sm" />
                    </div>
                 </div>
                 <div className="mt-3">
                    <label className="text-[10px] font-bold text-gray-700 uppercase">Preço Final de Venda</label>
                    <input type="text" value={preco_venda} readOnly className="w-full bg-white border border-amber-200 p-2 rounded font-bold text-green-700" />
                 </div>
              </div>
            </div>
            <div className="p-6 border-t">
              <button onClick={salvarProduto} className="w-full bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 shadow-md">Salvar Produto</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL DE EXCLUSÃO */}
      {isModalExclusao && (
        <div className="fixed inset-0 text-center bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-1">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-4">Tem certeza que deseja excluir? Ao excluir não será possível desfazer a operação.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setIsModalExclusao(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">Cancelar</button>
              <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

const CardItem = ({ item, abrirModal }) => {
  return (
    <div className="relative p-4 bg-white border border-gray-200 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition-all group">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-gray-800 uppercase">{item.nome}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1"><i className="bi bi-geo-alt"></i> {item.descricao}</p>
        <div className="flex gap-2 mt-2">
          <span className="text-[9px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded uppercase">Venda: R$ {item.venda}</span>
          <span className="text-[9px] font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded uppercase">Custo: R$ {item.custo}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <button onClick={() => abrirModal(item)} className="text-amber-600 hover:bg-amber-50 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100">
          <i className="bi bi-pencil-square"></i>
        </button>
        <p className="text-2xl font-black text-gray-800 leading-none">{item.quantidade}</p>
        <p className="text-[9px] text-gray-400 font-bold uppercase">Unidades</p>
      </div>
    </div>
  );
};

export default Estoque;