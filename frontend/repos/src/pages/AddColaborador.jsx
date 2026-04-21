import { useState } from 'react';
import Navbar from '../../components/Navbar';
import toast, { Toaster } from 'react-hot-toast';
import InputMask from "react-input-mask";
import axios from 'axios';

const AddColaborador = () => {

    // consts para os dados pessoais
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [foto, setFoto] = useState(null);
    //consts para os dados de vínculo e função
    const [cargo, setCargo] = useState("");
    const [localTrabalho, setLocalTrabalho] = useState("");
    const [dataEntrada, setDataEntrada] = useState("");
    const [tipoVinculo, setVinculo] = useState("");
    const [pdfContrato, setPdfContrato] = useState(null);
    //consts para os dados de pagamento
    const [salario_fixo, setSalarioFixo] = useState("");
    const [tipo_chave_pix, setTipoChavePix] = useState("");
    const [chave_pix, setChavePix] = useState("");
    const [porcentagem_comissao, setPorcentagemComissao] = useState("");
    const [agencia, setAgencia] = useState("");
    const [numero_conta, setNumeroConta] = useState("");
    const [vale_alimentacao, setValeAlimentacao] = useState(false);
    const [vale_transporte, setValeTransporte] = useState(false);

    const [loading, setLoading] = useState(false);
    const [msgErro, setMsgErro] = useState("");


    const [previewFoto, setPreviewFoto] = useState(null);
    const [aberto, setAberto] = useState(null); // Controla qual está aberto


    const toggle = (index) => {
        setAberto(aberto === index ? null : index);
    };

    const cargos = [
        "Atendente",
        "Auxiliar de Serviços Gerais",
        "Barbeiro",
        "Cabeleireiro(a) / Hair Stylist",
        "Consultor(a) de Vendas",
        "Designer de Sobrancelhas",
        "Esteticista Facial/Corporal",
        "Gerente de Unidade",
        "Lash Designer",
        "Manicure e Pedicure",
        "Marketing de Vendas",
        "Massoterapeuta",
        "Nail Designer",
        "Recepcionista"
    ];

    const vinculo = [
        "CLT",
        "PJ",
        "Autônomo"
    ];

    const comissao = [
        "10%",
        "15%",
        "20%",
        "25%",
        "30%"
    ];

    const tipopix = [
        "CPF",
        "CNPJ",
        "Email",
        "Telefone",
        "Chave Aleatória"
    ];

    const categoriasServicos = [
        {
            titulo: "Cabelo",
            icone: "💇",
            itens: [
                { id: "cab_01", nome: "Corte feminino" },
                { id: "cab_02", nome: "Corte masculino" },
                { id: "cab_03", nome: "Corte infantil" },
                { id: "cab_04", nome: "Escova simples" },
                { id: "cab_05", nome: "Escova modelada" },
                { id: "cab_06", nome: "Escova progressiva" },
                { id: "cab_07", nome: "Chapinha" },
                { id: "cab_08", nome: "Babyliss" },
                { id: "cab_09", nome: "Hidratação capilar" },
                { id: "cab_10", nome: "Nutrição capilar" },
                { id: "cab_11", nome: "Reconstrução capilar" },
                { id: "cab_12", nome: "Cronograma capilar" },
                { id: "cab_13", nome: "Coloração completa" },
                { id: "cab_14", nome: "Retoque de raiz" },
                { id: "cab_15", nome: "Luzes / mechas" },
                { id: "cab_16", nome: "Balayage" },
                { id: "cab_17", nome: "Ombré hair" },
                { id: "cab_18", nome: "Tonalização" },
                { id: "cab_19", nome: "Descoloração" },
                { id: "cab_20", nome: "Tratamento antiqueda" },
                { id: "cab_21", nome: "Botox capilar" },
                { id: "cab_22", nome: "Alisamento (diversos tipos)" }
            ]
        },
        {
            titulo: "Barbearia",
            icone: "🧔",
            itens: [
                { id: "bar_01", nome: "Corte masculino (tradicional/degradê)" },
                { id: "bar_02", nome: "Barba (modelagem)" },
                { id: "bar_03", nome: "Barba completa" },
                { id: "bar_04", nome: "Aparar barba" },
                { id: "bar_05", nome: "Sobrancelha masculina" },
                { id: "bar_06", nome: "Pigmentação de barba" },
                { id: "bar_07", nome: "Hidratação de barba" },
                { id: "bar_08", nome: "Relaxamento capilar masculino" },
                { id: "bar_09", nome: "Camuflagem de fios brancos" }
            ]
        },
        {
            titulo: "Unhas",
            icone: "💅",
            itens: [
                { id: "unh_01", nome: "Manicure simples" },
                { id: "unh_02", nome: "Pedicure simples" },
                { id: "unh_03", nome: "Manicure + pedicure" },
                { id: "unh_04", nome: "Esmaltação comum" },
                { id: "unh_05", nome: "Esmaltação em gel" },
                { id: "unh_06", nome: "Alongamento de unhas" },
                { id: "unh_07", nome: "Fibra de vidro" },
                { id: "unh_08", nome: "Unha de acrílico" },
                { id: "unh_09", nome: "Manutenção de alongamento" },
                { id: "unh_10", nome: "Nail art (decoração)" },
                { id: "unh_11", nome: "Spa dos pés" },
                { id: "unh_12", nome: "Spa das mãos" },
                { id: "unh_13", nome: "Remoção de esmalte em gel" }
            ]
        },
        {
            titulo: "Estética Facial",
            icone: "💆‍♀️",
            itens: [
                { id: "est_01", nome: "Limpeza de pele" },
                { id: "est_02", nome: "Limpeza de pele profunda" },
                { id: "est_03", nome: "Hidratação facial" },
                { id: "est_04", nome: "Peeling químico" },
                { id: "est_05", nome: "Peeling de diamante" },
                { id: "est_06", nome: "Microagulhamento" },
                { id: "est_07", nome: "Radiofrequência facial" },
                { id: "est_08", nome: "Tratamento para acne" },
                { id: "est_09", nome: "Clareamento facial" },
                { id: "est_10", nome: "Rejuvenescimento facial" },
                { id: "est_11", nome: "Design de sobrancelhas" },
                { id: "est_12", nome: "Henna na sobrancelha" },
                { id: "est_13", nome: "Brow lamination" },
                { id: "est_14", nome: "Extensão de cílios" },
                { id: "est_15", nome: "Lash lifting" },
                { id: "est_16", nome: "Remoção de cílios" }
            ]
        },
        {
            titulo: "Depilação",
            icone: "✨",
            itens: [
                { id: "dep_01", nome: "Depilação com cera" },
                { id: "dep_02", nome: "Depilação com linha" },
                { id: "dep_03", nome: "Depilação a laser" }
            ]
        }
    ];
    // Const para gerar o colaborador e captar seu id
    const [colaboradorId, setColaboradorId] = useState(null);


    const salvarColaborador = () => {
        axios.post('http://localhost:3000/colaboradores', {
            nome,
            cpf,
            email,
            telefone,
            cargo,
            data_admissao: dataEntrada,
            vinculo: tipoVinculo,
            local_trabalho: localTrabalho
        })
        .then((resposta) => {
            console.log('Resposta da API:', resposta.data.id); // Adicionado para verificar o JSON retornado
            const id = resposta.data.id; // Captura o ID retornado pela API
            setColaboradorId(id); // Armazena o ID no estado
            proximaAba(); // Avança para a próxima aba
            toast.success('Colaborador salvo!');
        })
        .catch((error) => {
            console.error('Erro ao salvar colaborador:', error); // Adicionado para verificar erros
            toast.error('Erro ao salvar colaborador');
        });
    };

    // Salvar pagamento do colaborador
    const salvarPagColaborador = () => {
        const comissaoDecimal = porcentagem_comissao
        ? parseFloat(porcentagem_comissao.replace('%', '')) / 100
        : 0;
        const salDecimal = parseFloat(salario_fixo.replace(',', '.')) || 0;
        const alimentacaoDecimal = parseFloat(vale_alimentacao.replace(',', '.')) || 0;
        const transporteDecimal = parseFloat(vale_transporte.replace(',', '.')) || 0;
        
        axios.post('http://localhost:3000/pagColaboradores', {
            salario_fixo: salDecimal,
            tipo_chave_pix,
            chave_pix,
            porcentagem_comissao: comissaoDecimal,
            agencia,
            numero_conta,
            vale_alimentacao: alimentacaoDecimal,
            vale_transporte: transporteDecimal,
            colaborador_id: colaboradorId
        })
            .then(() => {
                toast.success("Pagamento salvo!");
                proximaAba();
            })
            .catch(() => toast.error('Erro ao salvar pagamento do colaborador'));
    };



    // Função de uppload de foto com preview
    const handleImageChange = (e) => {
        const arquivo = e.target.files[0];
        if (arquivo) {
            setFoto(arquivo);
            // Cria uma URL temporária para mostrar a imagem na tela
            setPreviewFoto(URL.createObjectURL(arquivo));
        }
    };

    // Função de upploade de PDF
    const handlePdfChange = (e) => {
        const arquivo = e.target.files[0];
        if (arquivo && arquivo.type === "application/pdf") {
            setPdfContrato(arquivo);
            toast.success("PDF selecionado: " + arquivo.name);
        } else {
            toast.error("Por favor, selecione um arquivo PDF válido.");
        }
    };

    // Função da API de validação de email (AbstractAPI)
    const validateEmailWithAbstract = async (emailToValidate) => {
        const apiKey = "33e9b941cdd04e20a4b9bff0647a3a64";
        const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${emailToValidate}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return {
                isValid: data.deliverability === "DELIVERABLE",
                isDisposable: data.is_disposable_email?.value
            };
        } catch (error) {
            console.error("Erro na validação do e-mail:", error);
            return { isValid: false, error: true };
        }
    };

    // Função de validação de cpf
    const validarCPF = (valor) => {
        const cleanCPF = valor.replace(/[^\d]+/g, '');
        if (cleanCPF.length !== 11 || !!cleanCPF.match(/(\d)\1{10}/)) return false;
        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma = soma + parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cleanCPF.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma = soma + parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        return resto === parseInt(cleanCPF.substring(10, 11));
    };

    // Função de disparo da verificação de e-mail
    const handleEmailBlur = async () => {
        const regexBasico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return;

        if (!regexBasico.test(email)) {
            setMsgErro("Formato de e-mail inválido!");
            return;
        }

        setLoading(true);
        setMsgErro("");

        const result = await validateEmailWithAbstract(email);

        if (!result.isValid) {
            setMsgErro("Este e-mail não existe no servidor.");
            toast.error("E-mail inexistente!");
        } else if (result.isDisposable) {
            setMsgErro("E-mails temporários não são permitidos.");
        } else {
            toast.success("E-mail válido!");
        }
        setLoading(false);
    };
    //ABAS
    const abas = ["Dados Pessoais", "Vínculo e Função", "Pagamento", "Serviços"];
    const [abaAtiva, setAbaAtiva] = useState(abas[0]);

    const proximaAba = () => {
        const indexAtual = abas.indexOf(abaAtiva);
        if (indexAtual < abas.length - 1) {
            setAbaAtiva(abas[indexAtual + 1]);
        }
    };

    return (
        <main className="w-screen flex h-screen overflow-x-hidden">
            <Toaster />
            <Navbar />

            <div className='p-6 w-screen h-full'>
                <a href='/colaboradores' className='flex gap-1 items-center'>
                    <i className="bi bi-arrow-bar-left text-4xl text-gray-900"></i>
                    <h1 className='text-2xl font-bold text-gray-900'>Voltar</h1>
                </a>

                <h1 className='text-2xl font-bold text-gray-900 mt-3'>Adicionar Colaborador</h1>

                {/* Abas */}
                <div className="flex gap-2 justify-center mt-4 text-amber-900 ">
                    {["Dados Pessoais", "Vínculo e Função", "Pagamento", "Serviços"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setAbaAtiva(status)}
                            className={`px-4 py-2 text-sm font-semibold transition ${abaAtiva === status ? "font-bold text-amber-900 border-b-2 border-amber-500" : "hover:bg-gray-300"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {abaAtiva === "Dados Pessoais" && (
                    <div className='p-4 mt-4'>
                        <p className='font-bold text-amber-950'>Nome</p>
                        <input type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="NOME DO COLABORADOR"
                            className="w-full mb-4 border border-gray-500 bg-transparent rounded-md p-2 text-sm"
                        />

                        <div className='flex gap-2 w-full'>
                            <div className='flex-1'>
                                <p className='font-bold text-amber-950'>CPF</p>
                                <InputMask
                                    mask="999.999.999-99"
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                    onBlur={() => { if (!validarCPF(cpf)) toast.error("CPF Inválido!") }}
                                    className="w-full mb-2 border border-gray-500 bg-transparent rounded-md p-2 text-sm"
                                    placeholder="000.000.000-00"
                                />
                            </div>
                            <div className='flex-1'>
                                <p className='font-bold text-amber-950'>Email</p>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={handleEmailBlur}
                                    placeholder="Email"
                                    className="w-full mb-2 border border-gray-500 bg-transparent rounded-md p-2 text-sm"
                                />
                                {loading && <span className="text-xs text-blue-500"> Verificando e-mail...</span>}
                                {msgErro && <p className="text-xs text-red-500">{msgErro}</p>}
                            </div>
                        </div>

                        <div className='flex-1 mb-3'>
                            <p className='font-bold text-amber-950'>Telefone</p>
                            <InputMask
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                mask="(99)9 9999-9999"
                                className="w-1/2 mb-2 border border-gray-500 bg-transparent rounded-md p-2 text-sm"
                                placeholder="(00) 900000-0000"
                            />
                        </div>

                        <p className="font-bold text-amber-950">Foto</p>
                        <div className="mb-4 flex p-4 border border-gray-500 rounded-md flex-col items-center gap-2">
                            <p className="font-medium text-amber-950">Arraste a sua imagem ou selecione do seu dispositivo</p>
                            <div className="w-24 h-24 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center overflow-hidden bg-gray-100">
                                {previewFoto ? (
                                    <img src={previewFoto} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <i className="bi bi-person-fill text-4xl text-gray-400"></i>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="text-xs"
                            />
                        </div>

                        <div className="flex justify-center w-full mt-6">
                            <button onClick={proximaAba} className='p-2 font-bold flex gap-2 bg-green-500 rounded-md text-white hover:bg-green-600 transition'>
                                <i className="bi bi-floppy2-fill"></i>
                                <span>Continuar</span>
                            </button>
                        </div>
                    </div>
                )}

                {abaAtiva === "Vínculo e Função" && (
                    <div className='p-4 mt-4'>
                        <div className='flex gap-2 w-full'>
                            <div className='flex-1'>
                                <p className='font-bold text-amber-950 '>Cargo</p>
                                <select value={cargo} onChange={e => setCargo(e.target.value)} className="w-full mb-4 border border-gray-500 bg-transparent rounded-md p-2 text-sm">
                                    <option value="">Selecione o cargo</option>
                                    {cargos.map((cargo) => (
                                        <option key={cargo} value={cargo}>{cargo}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex-1'>
                                <p className='font-bold text-amber-950'>Tipo de Vínculo</p>
                                <select value={tipoVinculo} onChange={e => setVinculo(e.target.value)} className="w-full mb-4 border border-gray-500 bg-transparent rounded-md p-2 text-sm">
                                    <option value="">Selecione o tipo de vínculo</option>
                                    {vinculo.map((vinculo) => (
                                        <option key={vinculo} value={vinculo}>{vinculo}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <div className='flex-1'>
                                <p className='font-bold text-amber-950'>Data de Entrada</p>
                                <input type="date"
                                    value={dataEntrada}
                                    onChange={e => setDataEntrada(e.target.value)}
                                    placeholder="__/__/____"
                                    className="w-full mb-4 border border-gray-500 bg-transparent rounded-md p-2 text-sm"
                                />
                            </div>
                            <div className='flex-1'>
                                <p className='font-bold text-amber-950'>Local de Trabalho</p>
                                <InputMask
                                    value={localTrabalho}
                                    onChange={(e) => setLocalTrabalho(e.target.value)}
                                    type='text'
                                    className="w-full mb-2 border border-gray-500 bg-transparent rounded-md p-2 text-sm"
                                />
                            </div>
                        </div>
                        <p className="font-bold text-amber-950">Contrato de Prestação de Serviço (PDF)</p>
                        <div className="mt-4 flex justify-center w-full">
                            <div className="flex p-8 justify-center items-center gap-3 border border-gray-400 rounded-md bg-trasparend">
                                <i className="bi bi-file-earmark-pdf-fill text-red-600 text-2xl"></i>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handlePdfChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center w-full mt-6">
                            <button onClick={salvarColaborador} className='p-2 font-bold flex gap-2 bg-green-500 rounded-md text-white hover:bg-green-600 transition'>
                                <i className="bi bi-floppy2-fill"></i>
                                <span>Salvar Dados</span>
                            </button>
                        </div>
                    </div>
                )}

                {abaAtiva === "Pagamento" && (
                    <div className='p-4 mt-4'>
                        <div className='flex justify-center gap-2 w-full'>
                            <div className='flex-1'>
                                <p className='font-bold text-amber-950'>Salário Fixo</p>
                                <InputMask
                                    value={salario_fixo}
                                    onChange={(e) => setSalarioFixo(e.target.value)}
                                    mask="9999,99"
                                    className="w-full mb-4 border border-gray-500 bg-transparent rounded-md p-2 text-sm"
                                    placeholder="0000,00"
                                />
                            </div>
                            <div className='flex-1'>
                                <p className='font-bold text-amber-950'>Porcentagem de Comissão</p>
                                <select value={porcentagem_comissao} onChange={(e) => setPorcentagemComissao(e.target.value)} className="w-full mb-4 border border-gray-500 bg-transparent rounded-md p-2 text-sm">
                                    <option value="" className='text-gray-400'>Selecione a porcentagem</option>
                                    {comissao.map((comissao) => (
                                        <option key={comissao} value={comissao}>{comissao}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='flex justify-center gap-2 w-full'>
                            <div className='flex-1'>
                                <p className='font-bold text-amber-950'>Tipo de chave Pix</p>
                                <select value={tipo_chave_pix} onChange={(e) => setTipoChavePix(e.target.value)} className="w-full mb-4 border border-gray-500 bg-transparent rounded-md p-2 text-sm">
                                    <option value="" className='text-gray-400'>Selecione a porcentagem</option>
                                    {tipopix.map((tipopix) => (
                                        <option key={tipopix} value={tipopix}>{tipopix}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex-1'>
                                <p className='font-bold text-amber-950'>Chave Pix</p>
                                <InputMask
                                    value={chave_pix}
                                    onChange={(e) => setChavePix(e.target.value)}
                                    type='text'
                                    className="w-full mb-4 border border-gray-500 bg-transparent rounded-md p-2 text-sm"
                                />
                            </div>
                        </div>
                        <div className='flex justify-center gap-2 w-full'>
                            <div className='flex-1'>
                                <p className='font-bold text-amber-950'>Agência</p>
                                <InputMask
                                    value={agencia}
                                    onChange={(e) => setAgencia(e.target.value)}
                                    type='text'
                                    mask="9999-9"
                                    className="w-full mb-4 border border-gray-500 bg-transparent rounded-md p-2 text-sm"
                                />
                            </div>
                            <div className='flex-1'>
                                <p className='font-bold text-amber-950'>Número da Conta</p>
                                <InputMask
                                    value={numero_conta}
                                    onChange={(e) => setNumeroConta(e.target.value)}
                                    type='text'
                                    mask="99.999-9"
                                    className="w-full mb-4 border border-gray-500 bg-transparent rounded-md p-2 text-sm"
                                />
                            </div>
                        </div>
                        <div className='flex justify-center gap-2 w-full'>
                            <div className='flex-1'>
                                <p className='font-bold text-amber-950'>Vale Alimentação</p>
                                <InputMask
                                    value={vale_alimentacao}
                                    onChange={(e) => setValeAlimentacao(e.target.value)}
                                    type='text'
                                    mask="999,99"
                                    className="w-full mb-4 border border-gray-500 bg-transparent rounded-md p-2 text-sm"
                                />
                            </div>
                            <div className='flex-1'>
                                <p className='font-bold text-amber-950'>Vale Transporte</p>
                                <InputMask
                                    value={vale_transporte}
                                    onChange={(e) => setValeTransporte(e.target.value)}
                                    type='text'
                                    mask="999,99"
                                    className="w-full mb-4 border border-gray-500 bg-transparent rounded-md p-2 text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center w-full">
                            <button onClick={salvarPagColaborador} className='p-2 font-bold flex gap-2 bg-green-500 rounded-md text-white hover:bg-green-600 transition'>
                                <i className="bi bi-floppy2-fill"></i>
                                <span>Salvar Dados</span>
                            </button>
                        </div>
                    </div>
                )}

                {abaAtiva === "Serviços" && (
                    <div className='p-4 mt-4'>
                        <div className="space-y-4">
                            {categoriasServicos.map((cat, index) => (
                                <div key={index} className="border-b border-gray-200 py-2">
                                    <button
                                        onClick={() => toggle(index)}
                                        className="w-full flex justify-between items-center font-bold text-amber-950 text-lg"
                                    >
                                        <span>{cat.icone} {cat.titulo}</span>
                                        <i className={`bi bi-chevron-${aberto === index ? 'up' : 'down'}`}></i>
                                    </button>

                                    {aberto === index && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 transition-all">
                                            {cat.itens.map(servico => (
                                                <label key={servico.id} className="flex items-center gap-2 text-amber-900 text-sm">
                                                    <input type="checkbox" className="
                                            appearance-none 
                                            w-5 h-5
                                            border-2 border-gray-400 
                                            rounded-full 
                                            cursor-pointer 
                                            transition-all 
                                            checked:bg-amber-600 
                                            checked:border-amber-800 
                                            before:content-['◉'] 
                                            before:text-white 
                                            before:text-xs 
                                            before:font-bold 
                                            before:hidden 
                                            checked:before:flex 
                                            before:items-center 
                                            before:justify-center 
                                            before:w-full 
                                            before:h-full
                                        " />
                                                    {servico.nome}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center w-full">
                            <button className='p-2 font-bold flex gap-2 bg-green-500 rounded-md text-white hover:bg-green-600 transition'>
                                <i className="bi bi-floppy2-fill"></i>
                                <span>Salvar Dados</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default AddColaborador;