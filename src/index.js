import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import "uikit/dist/css/uikit.min.css";
import "uikit/dist/js/uikit.min.js";
import "uikit/dist/js/uikit-icons.min.js";
// import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter  future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}>
    <App />
  </BrowserRouter>
);

// reportWebVitals();