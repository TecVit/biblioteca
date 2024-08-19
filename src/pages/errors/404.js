import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './css/404.css';

export default function Error404() {


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
        document.title = 'Leitores Letícia | Error 404';
        animacoes();
        window.addEventListener('scroll', animacoes);
        return () => {
        window.removeEventListener('scroll', animacoes);
        };
    }, []);

    const navigate = useNavigate();

    return (
    <main className="container-error404">
        <section className='content-error404'>
            <div className='right'>
                <h1 data-animation="left" data-duration-animation="0.7s">404...</h1>
                <h2 data-animation="left" data-duration-animation="0.8s">Silencio, Por Favor!</h2>
                <h3 data-animation="left" data-duration-animation="0.9s">Biblioteca Responde:</h3>
                <p data-animation="left" data-duration-animation="1.0s">Essa página foi emprestada da biblioteca e ainda não devolvida. Volte ao índice e escolha outra leitura!</p> 
                <button data-animation="left" data-duration-animation="1.1s" onClick={() => navigate('/painel/livros')}>Retornar ao início</button>
            </div>
        </section>
    </main>
    )
}
