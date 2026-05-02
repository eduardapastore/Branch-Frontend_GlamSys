import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

const Navbar = () => {
  const location = useLocation();
  // Estado único para controlar qual dropdown está aberto
  const [openDropdown, setOpenDropdown] = useState(null); 
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Função para alternar entre os menus
  const handleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className='w-1/4 h-screen sticky top-0 p-6 border-r border-slate-400 bg-transparent flex flex-col' ref={dropdownRef}>
      
      {/* Perfil do Usuário */}
      <div id='perfildeusuário' className='flex gap-4 items-center'>
        <img 
          src='repos/src/imgs/pfp.png' 
          className='w-12 h-12 rounded-full object-cover' 
          alt='Profile'
        />
        <div className='flex-1'>
          <p className='text-1xl font-semibold whitespace-nowrap'>João Pessoa Valensky</p>
          <p className='text-xs font-light text-gray-500'>Administrador</p>
        </div>
        <Link to='/login' className="text-gray-400 hover:text-black transition-colors">
          <i className="bi bi-box-arrow-right text-lg font-semibold"></i>
        </Link>
      </div>

      {/* Navegação do Sistema */}
      <div className='flex flex-col gap-4 flex-1 mt-8'>
        
        {/* Dashboard */}
        <Link to='/dashboard' className={`flex items-center gap-6 w-full transition-colors text-lg ${
          isActive('/dashboard') ? 'text-black font-bold' : 'text-gray-500 hover:text-black'
        }`}>
          <i className="bi bi-columns-gap text-xl"></i>
          <p>Dashboard</p>
        </Link>

        {/* Dropdown: Agendamentos */}
        <div className='relative'>
          <button 
            onClick={() => handleDropdown('agendamentos')}
            className={`flex items-center justify-between w-full transition-colors text-lg ${
              openDropdown === 'agendamentos' || isActive('/agendamentos') ? 'text-black font-bold' : 'text-gray-500 hover:text-black'
            }`}
          >
            <div className='flex items-center gap-6'>
              <i className="bi bi-calendar-event text-xl"></i>
              <p>Agendamentos</p>
            </div>
            <i className={`bi bi-chevron-${openDropdown === 'agendamentos' ? 'up' : 'down'} text-sm`}></i>
          </button>

          {openDropdown === 'agendamentos' && (
            <ul className="mt-2 ml-11 flex flex-col gap-2 border-l-2 border-slate-200 pl-4">
              <li>
                <Link to='/agendamentos' className="text-gray-500 flex gap-2 hover:text-black text-base py-1">
                  <i class="bi bi-calendar-date"></i> Calendário
                </Link>
              </li>
              <li>
                <Link to='/confirmacoes' className="text-gray-500 flex gap-2 hover:text-black text-base py-1">
                  <i class="bi bi-calendar-check"></i> Confirmações
                </Link>
              </li>
            </ul>
          )}
        </div>
        
        {/* Dropdown: Colaboradores */}
        <div className='relative'>
          <button 
            onClick={() => handleDropdown('colaboradores')}
            className={`flex items-center justify-between w-full transition-colors text-lg ${
              openDropdown === 'colaboradores' || isActive('/colaboradores') ? 'text-black font-bold' : 'text-gray-500 hover:text-black'
            }`}
          >
            <div className='flex items-center gap-6'>
              <i className="bi bi-person-badge text-xl"></i>
              <p>Colaboradores</p>
            </div>
            <i className={`bi bi-chevron-${openDropdown === 'colaboradores' ? 'up' : 'down'} text-sm`}></i>
          </button>

          {openDropdown === 'colaboradores' && (
            <ul className="mt-2 ml-11 flex flex-col gap-2 border-l-2 border-slate-200 pl-4">
              <li>
                <Link to='/colaboradores' className="text-gray-500 flex gap-2 hover:text-black text-base  py-1">
                  <i className="bi bi-people"></i> Gestão de Equipe
                </Link>
              </li>
              <li>
                <Link to='/colaboradores/folha' className="text-gray-500 flex gap-2 hover:text-black text-base py-1">
                  <i className="bi bi-file-earmark-medical"></i> Folha de Pagamento
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Links Simples (Clientes, Estoque, etc) */}
        {[
          { path: '/clientes', icon: 'bi-star-fill', label: 'Clientes' },
          { path: '/estoque', icon: 'bi-inboxes', label: 'Estoque' },
          { path: '/financeiro', icon: 'bi-cash', label: 'Financeiro' },
          { path: '/servicos', icon: 'bi-person-workspace', label: 'Serviços' },
        ].map((item) => (
          <Link key={item.path} to={item.path} className={`flex items-center gap-6 w-full transition-colors text-lg ${
            isActive(item.path) ? 'text-black font-bold' : 'text-gray-500 hover:text-black'
          }`}>
            <i className={`bi ${item.icon} text-xl`}></i>
            <p>{item.label}</p>
          </Link>
        ))}

      </div>

      <hr className='w-full border-slate-300 my-6' />

      {/* Rodapé */}
      <div className='flex flex-col gap-6'>
        <Link to='/suporte' className={`flex items-center gap-6 w-full transition-colors ${
          isActive('/suporte') ? 'text-black font-bold' : 'text-gray-500 hover:text-black'
        }`}>
          <i className="bi bi-question-octagon text-lg"></i>
          <p>Suporte</p>
        </Link>

        <div className='flex justify-center pb-2'>
          <img src='repos/src/imgs/GlamSys.svg' className='w-32 opacity-80' alt='GlamSys Logo' />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;