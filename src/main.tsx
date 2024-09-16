import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Import your main App component

// PrimeReact and PrimeIcons CSS imports
import 'primereact/resources/themes/saga-blue/theme.css';  // PrimeReact theme
import 'primereact/resources/primereact.min.css';  // Core PrimeReact styles
import 'primeicons/primeicons.css';  // PrimeIcons for icons

// Render the main App component
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
