import React, { useEffect, useState } from 'react'
import '../css/Menu.css';
import { IoAdd, IoLibraryOutline, IoList, IoRemove } from 'react-icons/io5';
import { PiStudent } from 'react-icons/pi';
import { useLocation, useNavigate } from 'react-router-dom';

// Images
import Logo from '../images/logo.png';
import { IoIosAdd } from 'react-icons/io';
import { GoTrash } from 'react-icons/go';


export default function Menu() {
  
  const navigate = useNavigate();
  const location = useLocation();
  const page = String(location.pathname).replace(/\/$/, '');

  // Modais
  const [linksLivros, setLinksLivros] = useState(page === '/painel/livros' ? true : false);
  const [linksAlunos, setLinksAlunos] = useState(page === '/painel/alunos' ? true : false);

  useEffect(() => {
    if (page.includes('/painel/livros')) {
      setLinksLivros(true);
      setLinksAlunos(false);
    } else if (page.includes('/painel/alunos')) {
      setLinksLivros(false);
      setLinksAlunos(true);
    }
  }, [page]);

  return (
    <section className='container-menu'>
      <div className='content-menu'>
        
        {/* Botões */}
        <div className='btns'>
          <img onClick={() => navigate('/')} className='logo' src={Logo} />
          <button onClick={() => navigate('/painel/livros')} className={`btn ${linksLivros && 'selecionado'}`}>
            <IoLibraryOutline className='icon' />
          </button>
          <button onClick={() => navigate('/painel/alunos')} className={`btn ${linksAlunos && 'selecionado'}`}>
            <PiStudent className='icon' />
          </button>
        </div>
        
      </div>
    </section>
  )
}