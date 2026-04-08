import Navbar from '../../components/Navbar';

const Suporte = () => {

  const devs = [
    {
      nome: "Joâo Cleber",
      email: "jscleberpsanches@gmail.com",
      telefone: "5575999742991"
    },
    {
      nome: "Maria Eduarda",
      email: "mepastore18@gmail.com",
      telefone: "557599036694"
    }
  ];

  const abrirWhatsApp = (numero) => {
    const link = `https://wa.me/${numero}`;
    window.open(link, "_blank");
  };

  return (
    <main className='flex w-screen h-screen overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-orange-600'>
      <Navbar />

      <div className="p-6 w-screen">
        <h2 className="font-bold text-2xl mb-4">Suporte</h2>
        <p className="text-gray-700 mb-6 text-sm">
          Entre em contato com um dos desenvolvedores do sistema para suporte técnico.
        </p>

        {/* Cards de contato */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devs.map((dev, index) => (
            <div key={index} className="border border-gray-400 rounded-lg p-4 shadow-md">

              {/* Nome e imagem */}
              <div className="flex items-center gap-3 mb-3">
                
                <h3 className="font-bold text-lg">{dev.nome}</h3>
              </div>

              {/* Email */}
              <div className="mb-3">
                <p className="text-gray-600 font-semibold text-sm">Email:</p>
                <a
                  href={`mailto:${dev.email}`}
                  className="text-orange-600 underline text-sm hover:text-orange-700"
                >
                  {dev.email}
                </a>
              </div>

              {/* Telefone / WhatsApp */}
              <div className="mb-4">
                <p className="text-gray-600 font-semibold text-sm">Telefone / WhatsApp:</p>
                <button
                  onClick={() => abrirWhatsApp(dev.telefone)}
                  className="flex items-center gap-2 text-sm text-green-600 underline hover:text-green-700"
                >
                  <i className="bi bi-whatsapp text-lg"></i>
                  {dev.telefone}
                </button>
              </div>

              {/* Botão grande WhatsApp */}
              <button
                className="mt-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex gap-2"
                onClick={() => abrirWhatsApp(dev.telefone)}
              >
                <i className="bi bi-chat-dots-fill"></i>
                Falar via WhatsApp
              </button>

            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Suporte;
