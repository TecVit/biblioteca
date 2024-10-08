import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Components
import Menu from './components/Menu';

// Pages
import Entrar from './pages/logar/Entrar';
import Livros from './pages/livros/Livros';
import Error404 from './pages/errors/404';

// Toastify
import { notifySuccess, notifyError, NotificationContainer } from './toastifyServer';
import 'react-toastify/dist/ReactToastify.css';
import './css/customToastify.css';
import { useNavigate } from 'react-router-dom';

const RouterApp = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Entrar />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/painel/*" element={
          <div className='painel'>
            <Menu />
            <Routes>
              
              {/* Livros */}
              <Route path="/livros" element={<Livros />} />
              <Route path="/*" element={<Error404 />} />
            </Routes>
          </div>
        } />
        <Route path="/*" element={<Error404 />} />
      </Routes>
    </Router>
  );

}

export default RouterApp;