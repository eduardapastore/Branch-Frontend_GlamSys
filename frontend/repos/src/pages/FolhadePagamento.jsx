import React from 'react'
import Navbar from '../../components/Navbar'
import toast, { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import Select from 'react-select'

const FolhadePagamento = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const options = [
    { value: 'colaborador1', label: 'Fulano de Tal' },
    { value: 'colaborador2', label: 'Edu Becks' },
    { value: 'colaborador3', label: 'Jojo Todynho' },
    { value: 'colaborador4', label: 'Ana Wintour' },
    { value: 'colaborador5', label: 'Miranda Priestly' },
  ];

  const options_conta = [
    { value: 'conta1', label: 'Conta Corrente - Banco do Brasil' },
    { value: 'conta2', label: 'Conta Poupança - Caixa Econômica' },
    { value: 'conta3', label: 'Conta Corrente - Bradesco' },
    { value: 'conta4', label: 'Conta Corrente - Itaú' },
    { value: 'conta5', label: 'Conta Poupança - Santander' },
  ]

  const [lancamento, setLancamento] = useState([
    { id: 1, titulo: "Fulano de Tal", valor: 85.00, tipo_lancamento_id: 1, data_lancamento: "25/04/2026", pagamento: "Pendente", valor_pago: 1523.00 },
    { id: 2, titulo: "Edu Becks", valor: 45.00, tipo_lancamento_id: 1, data_lancamento: "24/04/2026", pagamento: "Pendente", valor_pago: 0.00 },
    { id: 3, titulo: "Jojo Todynho", valor: 1200.00, tipo_lancamento_id: 3, data_lancamento: "05/04/2026", pagamento: "Pendente", valor_pago: 0.00 },
    { id: 4, titulo: "Ana Wintour", valor: 280.00, tipo_lancamento_id: 2, data_lancamento: "10/04/2026", pagamento: "Pendente", valor_pago: 0.00 },
    { id: 5, titulo: "Miranda Priestly", valor: 350.00, tipo_lancamento_id: 2, data_lancamento: "15/04/2026", pagamento: "Pendente", valor_pago: 0.00 },
  ]);

  return (
    <main className="w-screen flex h-screen overflow-hidden bg-inherit">
      <Navbar />
      <Toaster />

      {/* Conteúdo principal */}
      <section className="p-6 w-full h-full overflow-y-auto">
        <div className='flex justify-between'>
          <h1 className="font-bold text-2xl text-gray-800">Folha de Pagamento</h1>
          <div className='flex gap-3'>
            <button className='flex gap-2 p-2 border border-gray-700 items-center text-gray-700 font-normal text-sm rounded-md'>
              <i class="bi bi-newspaper"></i>
              Relatório
            </button>
            <button onClick={() => setModalOpen(true)}  className='flex gap-2 p-3 text-sm font-semibold bg-amber-600 text-white align-middle rounded-md hover:bg-amber-700 transition-colors'>
              <i class="bi bi-plus-circle-fill"></i>
              Registrar Pagamento
            </button>
          </div>
        </div>

        <h3 className="text-base text-gray-600 font-medium mb-4">Histórico Recente</h3>
        <section className=' rounded-2xl flex-1 flex flex-col overflow-hidden '>
          <div className=' flex-1 overflow-y-auto space-y-3 pr-2'>
            {lancamento.map((item, index) => {
              return (
                <div key={index} className="p-4 bg-gray-50 rounded-md flex justify-between items-center shadow-sm hover:border-amber-200 transition-all">
                  <div className='w-full flex items-center align-middle justify-between'>
                    <div>
                      <p className="text-md font-bold text-gray-800">{item.titulo}</p>
                      <p className="text-[10px] text-gray-400 uppercase">{item.data_lancamento}</p>
                    </div>
                    <div>
                      <p className='text-lg font-black text-amber-600'>R$ {item.valor.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl flex flex-col max-h-[90vh]">
             <div className='flex justify-between items-center p-6 border-b'>
                <h2 className='font-bold text-gray-800 text-lg'>Registrar Pagamento</h2>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-red-500"><i className="bi bi-x-lg"></i></button>
              </div>

           <div className='p-6 pt-2 w-full flex flex-col'>
               <label className='text-[10px] font-bold text-gray-600 uppercase'>Colaborador</label>
               <Select options={options} className='mb-4 '/>

               <label className='text-[10px] font-bold text-gray-600 uppercase'>Valor</label>
               <input type="number" step="0.01" className='mb-4 border border-gray-400 p-2 rounded-md text-sm outline-none focus:border focus:border-amber-600' />

               <label className='text-[10px] font-bold text-gray-600 uppercase'>Conta Debitada</label>
               <Select options={options_conta}/>
           </div>

           <div className="p-4 pt-3 bg-gray-50 border-t rounded-md">
              <button className="w-full bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 transition-all shadow-md">
                Registrar Pagamento
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default FolhadePagamento