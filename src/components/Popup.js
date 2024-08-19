import React, { Children, useEffect } from 'react'
import '../css/Popup.css';

// Icones
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';

export default function Popup({ children, titulo, handleClose }) {

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
      if (Number(windowTop) >= positionElemento - 50) {
        element.classList.add(classAnimation);
      }
    });
  }

  useEffect(() => {
    animacoes();
    window.addEventListener('scroll', animacoes);
    return () => {
      window.removeEventListener('scroll', animacoes);
    };
  }, []);

  const navigate = useNavigate();

  return (
    <section className='container-popup'>
      <div data-animation="top" data-duration-animation="0.5s" className='content-popup'>
        <div className='top'>
          <h1>{titulo}</h1>
          <IoMdClose onClick={handleClose} className='icon' />
        </div>
        <div className='content'>
          {children}
        </div>
      </div>
    </section>
  )
}