import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// base global styles, design often falls back to them
import './css/base/_reset.css';
import './css/base/_variables.css';
import './css/base/_typography.css';

// key features and layout styles, reusable across most pages
import './css/components/global/header.css';
import './css/components/eventrix/profile.css';
import './css/components/global/container.css';
import './css/components/eventrix/filter.css';
import './css/components/global/sidebar.css';

// reusable components used across the website
import './css/components/global/animations.css';
import './css/components/global/buttons.css';
import './css/components/eventrix/modal.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
