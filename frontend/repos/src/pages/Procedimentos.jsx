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


const Procedimentos = () => {
    const [ordensServico, setOrdensServico] = useState([]);
    useEffect(() => {
        //servicos
        axios.get('http://localhost:3000/ordens_servico')
            .then((response) => {
                setOrdensServico(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar ordens:", error);
                toast.error("Erro ao carregar as ordens!");
            });

    }, []);

    const [abaAtiva, setAbaAtiva] = useState("ABERTA");

    return (
        <main className="w-screen flex h-screen overflow-x-hidden">
            <Navbar />

            <section className="p-6 w-screen h-full overflow-y-auto flex flex-col gap-4">
            <h2 className="text-lg font-semibold mb-4">
                    Procedimentos
                </h2>
                {/* 🔹 Abas */}
                <div className="flex gap-2">
                    {["ABERTA", "CANCELADA", "FECHADA"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setAbaAtiva(status)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition
                      ${abaAtiva === status
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* 🔹 Conteúdo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    {ordensServico
                        .filter((o) => o.status === abaAtiva)
                        .map((o) => (
                            <div key={o.id} className="p-4 border rounded-md shadow-sm flex flex-col gap-2 bg-white">

                                <p className="text-xs">Cliente: {o.cliente_nome}</p>
                                <p className="text-xs">Cabelereira/o: {o.colaborador_nome}</p>
                                <p className="text-xs">Procedimento: {o.procedimento}</p>

                                <p
                                    className={`text-xs font-semibold
                          ${o.status === "ABERTA"
                                            ? "text-yellow-600"
                                            : o.status === "CANCELADA"
                                                ? "text-red-600"
                                                : "text-green-600"
                                        }`}
                                >
                                    STATUS: {o.status}
                                </p>

                                {/* Botão só aparece se estiver ABERTA */}
                                {o.status === "ABERTA" && (
                                    <button
                                        className="mt-2 self-start rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 transition"
                                        onClick={() => handleConfirmar(o.id)}
                                    >
                                        Confirmar
                                    </button>
                                )}

                            </div>
                        ))}

                </div>

            </section>
        </main>
    );
};


export default Procedimentos;