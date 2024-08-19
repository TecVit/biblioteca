import React from 'react';
import ReactDOM from 'react-dom/client';
import './framework.scss';
import './global.css';
import RouterApp from './Router';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <RouterApp />
  //</React.StrictMode>
);