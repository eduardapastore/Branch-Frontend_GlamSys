import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [login, setarlogin] = useState('');
  const [senha, setarsenha] = useState('');
  const [mensagem, setMensagem] = useState(''); // ✅ estado para feedback
  const navigate = useNavigate();

  const loginReq = async () => {
    try {
      const resposta = await axios.post('http://localhost:3000/login', {
        login,
        senha
      });
  
      setMensagem(resposta.data.mensagem);
      console.log(resposta.data);
      
      if (resposta.data.sucesso === true) {
        navigate('/dashboard');
      }
  
    } catch (erro) {
      console.error('Erro ao fazer login:', erro);
  
      if (erro.response && erro.response.data) {
        setMensagem(erro.response.data.mensagem);
      } else {
        setMensagem('Erro ao conectar com o servidor.');
      }
    }
  };

  function Login() {
  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuário logado!", userCredential.user);
      // Aqui, se o 2FA estiver ativo, o Firebase vai disparar o erro 
      // 'auth/multi-factor-auth-required' e você mostra a tela do código.
    } catch (error) {
      console.error("Erro no login", error.code);
    }
  };
  

  return (
    <div className='flex min-h-screen bg-orange-50'>
      {/* Lado esquerdo - Imagem */}
      <div 
        className="w-1/2 min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/src/imgs/signimg.png')" }}
      >
      </div>

      {/* Lado direito - Login */}
      <div className='p-5 w-1/2 justify-center items-center flex flex-col gap-6'>
        <img src='/src/imgs/Glamsync.png' width="256px" alt="Logo" />
        
        <input 
          type='text'
          placeholder='Usuário'
          className='p-3 rounded-md border border-black bg-transparent'
          value={login}
          onChange={(e) => setarlogin(e.target.value)}
        />

        <input 
          type='password'
          placeholder='Senha'
          className='p-3 rounded-md border border-black bg-transparent'
          value={senha}
          onChange={(e) => setarsenha(e.target.value)}
        />

        <button 
          onClick={loginReq} 
          className='bg-orange-600 hover:bg-orange-900 text-white font-bold py-2 px-4 rounded-lg'
        >
          Entrar
        </button>

        {mensagem && (
          <p className='text-sm font-semibold mt-2 text-center text-gray-700'>
            {mensagem}
          </p>
        )}

        <a href='#' className='font-semibold text-orange-600 text-xs text-right underline'>
          Esqueceu a senha?
        </a>
      </div>
    </div>
  );
};

export default Login;
