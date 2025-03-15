import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';

// Create a root element for rendering
const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

// Render your App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
