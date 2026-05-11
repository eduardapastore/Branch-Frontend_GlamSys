"use client"

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login'
import Dashboard from './pages/Dashboard'
import Agendamentos from './pages/Agendamentos';
import Colaboradores from './pages/Colaboradores'
import Financeiro from './pages/Financeiro'
import Estoque from './pages/Estoque'
import Suporte from './pages/Suporte'
import Confirmacoes from './pages/Confirmacoes'
import AddColaborador from './pages/AddColaborador';
import Clientes from './pages/Clientes';
import Serviços from './pages/Serviços';
import FolhadePagamento from './pages/FolhadePagamento';

const Router = () => {
  return (

    <div className='flex'>
      <BrowserRouter>
            <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/login' element={<Login />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/agendamentos' element={<Agendamentos />} />
                <Route path='/colaboradores' element={<Colaboradores />} />
                <Route path='/financeiro' element={<Financeiro />}/>
                <Route path='/estoque' element={<Estoque />}/>
                <Route path='/confirmacoes' element={<Confirmacoes />}/>
                <Route path='/suporte' element={<Suporte />}/>
                <Route path='/addcolaborador' element={<AddColaborador />} />
                <Route path='/clientes' element={<Clientes />} />
                <Route path='/servicos' element={<Serviços />} />
                <Route path='/folhadepagamento' element={<FolhadePagamento />} />
                <Route path='*' element={<h1>404 - Página Não Encontrada</h1>} />
                {/* Adiciona do mesmo jeito aqui outras páginas */}
            </Routes>
    </BrowserRouter>
    </div>
  )
}

export default Router