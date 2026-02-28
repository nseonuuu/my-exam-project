import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

console.log(import.meta.env);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);