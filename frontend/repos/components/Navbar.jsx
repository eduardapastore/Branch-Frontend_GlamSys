import React from 'react';
import { useLocation } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

const Navbar = () => {
  const location = useLocation();

  // Função para verificar se o botão está ativo
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className='w-1/4 h-screen p-6 border-r border-r-slate-400'>
      {/* profile */}
      <div id='perfildeusuário' className='flex gap-4 align-middle items-center '>
        <img src='/src/imgs/pfp.png' width='48px' alt='Profile'/>
        <div>
          <p className='text-xs font-semibold'>João Pessoa Valensky</p>
          <p className='text-xs font-light'>Administrador</p>
        </div>
        <a href='/login'>
          <i className="bi bi-box-arrow-right font-semibold"></i>
        </a>
      </div>

      <hr className='border-slate-400 my-4'/>

      {/* system navigation */}
      <div className='gap-4 align-middle items-center'>
        <a href='/dashboard'>
          <button 
          id='dashboard' 
          className={`flex gap-6 transition-colors duration-100 ${
            isActive('/dashboard') ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'
          }`}
          >
            <i className="bi bi-columns-gap"></i>
            <p>Dashboard</p>

          </button>
        </a>

        <a href='/agendamentos'>
          <button id='agendamentos' className={`flex gap-6 transition-colors duration-100 ${
            isActive('/agendamentos') ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'
          }`}>
            <i className="bi bi-calendar-event"></i>
            <p>Agendamentos</p>
          </button>
        </a>

        <a href='/colaboradores'>
          <button 
          id='colaboradores' 
          className={`flex gap-6 transition-colors duration-100 ${
            isActive('/colaboradores') ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'
          }`}
        >
          <i className="bi bi-person-badge"></i>
          <p>Colaboradores</p>
        </button>
        </a>
        <a href='/financeiro'>
            <button 
            id='financeiro' 
            className={`flex gap-6 transition-colors duration-100 ${
              isActive('/financeiro') ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'
            }`}
          >
            <i className="bi bi-cash"></i>
            <p>Financeiro</p>
          </button>
        </a>
        <a href='/estoque'>
            <button 
            id='stock' 
            className={`flex gap-6 transition-colors duration-100 ${
              isActive('/estoque') ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'
            }`}
          >
            <i className="bi bi-inboxes"></i>
            <p>Estoque</p>
          </button>
        </a>
        <a href='/procedimentos'>
            <button 
            id='procedures' 
            className={`flex gap-6 transition-colors duration-100 ${
              isActive('/procedimentos') ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'
            }`}
          >
            <i className="bi bi-inboxes"></i>
            <p>Procedimentos</p>
          </button>
        </a>
      </div>
      

      <hr className='border-slate-400 my-4'/>

      {/* settings & support */}
      <div className='gap-4 align-middle items-center'>
      
      <a href='/suporte'>
            <button 
            id='suport' 
            className={`flex gap-6 transition-colors duration-100 ${
              isActive('/suporte') ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'
            }`}
          >
            <i className="bi bi-inboxes"></i>
            <p>Suporte</p>
          </button>
      </a>
      <div className='flex justify-center'>
        <img src='/src/imgs/GlamSys.svg' width='196px' alt='GlamSys Logo' className='absolute bottom-6 '/>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;