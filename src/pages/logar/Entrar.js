import React, { useEffect, useState } from 'react'
import './css/Entrar.css';

// Images
import BlueAuth from '../../images/auth.svg';
import Logo from '../../images/logo.png';

// Icones
import { FaArrowRight } from "react-icons/fa6";
import { NotificationContainer, notifyError, notifySuccess } from '../../toastifyServer';
import { entrarComEmail } from '../../firebase/logar';
import { getCookie } from '../../firebase/cookies';
import { useNavigate } from 'react-router-dom';

export default function Menu() {
  
    // Animações
  function getTopPositionRelativeToPage(element) {
    var rect = element.getBoundingClientRect();
    var scrollTop = window.scrollY || window.pageYOffset;
    return rect.top + scrollTop;
  }

  const animacoes = () => {
    const elements = document.querySelectorAll('[data-animation]');
    const classAnimation = "animationClass";
    const windowTop = window.scrollY + ((window.innerHeight * 4.5) / 4);
    
    elements.forEach( async (element) => {
      const positionElemento = await getTopPositionRelativeToPage(element);
      if (Number(windowTop) >= positionElemento - 100) {
        element.classList.add(classAnimation);
      }
    });
  }

  useEffect(() => {
    document.title = 'Leitores Letícia | Entrar';
    animacoes();
    window.addEventListener('scroll', animacoes);
    return () => {
      window.removeEventListener('scroll', animacoes);
    };
  }, []);

    const navigate = useNavigate();

    // Dados
    const emailCookie = getCookie('email') || '';

    // Modais
    const [carregando, setCarregando] = useState('');

    // Inputs
    const [inputEmail, setInputEmail] = useState(emailCookie);
    const [inputSenha, setInputSenha] = useState('');

    const handleEntrar = async () => {
        if (carregando) {
            notifyError('Espere a outra requisição terminar!');
            setCarregando(false);
            return;
        }
        setCarregando(true);
        try {
            if (!inputEmail || !inputSenha) {
                notifyError('Complete o formulário corretamente!');
                return;
            }
            const codigoEntrar = await entrarComEmail(inputEmail, inputSenha);
            if (codigoEntrar === 'sucesso') {
                setCarregando(false);
                notifySuccess(`Bem-Vindo novamente ao Leitores Letícia`);
                setTimeout(() => {
                    navigate('/painel/livros');
                }, 3750);
            } else if (codigoEntrar === 'usuario-nao-existe') {
                notifyError('Usuário não existe!');
            } else if (codigoEntrar === 'credencial-invalida') {
                notifyError('Credenciais inválidas!');
            } else if (codigoEntrar === 'email-invalido') {
                notifyError('E-mail inválido!');
            }
            setCarregando(false);
            return;
        } catch (error) {
            console.log(error);
            return;
        } finally {
            setCarregando(false);
        }
    }

    return (
        <>
            <NotificationContainer />
            <section className='container-entrar'>
                <div className='content-entrar'>
                    <div className='form'>
                        <div data-animation="top" data-duration-animation="0.6s" className='logo'>
                            <img src={Logo} />
                            <h2> <span className='blue'>Leitores</span> <br/> <span className='red'>Letícia</span></h2>
                        </div>
                        <h1 data-animation="top" data-duration-animation="0.7s">Faça login na sua conta</h1>
                        <div data-animation="top" data-duration-animation="0.8s" className='input'>
                            <label>E-mail</label>
                            <input onChange={(e) => setInputEmail(e.target.value)} value={inputEmail} type='text' placeholder='Digite seu e-mail' />
                        </div>
                        <div data-animation="top" data-duration-animation="0.9s" className='input'>
                            <label>Senha</label>
                            <input onChange={(e) => setInputSenha(e.target.value)} value={inputSenha} type='text' placeholder='Digite sua senha' />
                        </div>
                        <button data-animation="top" data-duration-animation="1.0s" onClick={handleEntrar}>Entrar <FaArrowRight className='icon' /> </button>
                    </div>
                    <div data-animation="top" data-duration-animation="1.1s" className='creditos'>
                        <p>Copyright ©2024 | Desenvolvido por <strong onClick={() => window.open('https://instagram.com/tecvit_')}>TecVit, Inc.</strong></p>
                    </div>
                </div>
            </section>
        </>
    )
}