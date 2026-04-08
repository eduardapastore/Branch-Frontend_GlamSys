"use client"

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login'
import Dashboard from './pages/Dashboard'
import Agendamentos from './pages/Agendamentos';
import Colaboradores from './pages/Colaboradores'
import Financeiro from './pages/Financeiro'
import Estoque from './pages/Estoque'
import Suporte from './pages/Suporte'
import Procedimentos from './pages/Procedimentos'
import AddColaborador from './pages/AddColaborador';

const Router = () => {
  return (

    <BrowserRouter>
            <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/login' element={<Login />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/agendamentos' element={<Agendamentos />} />
                <Route path='/colaboradores' element={<Colaboradores />} />
                <Route path='/financeiro' element={<Financeiro />}/>
                <Route path='/estoque' element={<Estoque />}/>
                <Route path='/procedimentos' element={<Procedimentos />}/>
                <Route path='/suporte' element={<Suporte />}/>
                <Route path='*' element={<h1>404 - Página Não Encontrada</h1>} />
                <Route path='/addcolaborador' element={<AddColaborador />} />
                {/* Adiciona do mesmo jeito aqui outras páginas */}
            </Routes>
    </BrowserRouter>
  )
}

export default Router