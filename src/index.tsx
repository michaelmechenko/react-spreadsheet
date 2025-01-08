import React from 'react';
import ReactDOM from 'react-dom/client';
import SpreadsheetMain from './SpreadsheetMain';
import './globals.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SpreadsheetMain />
  </React.StrictMode>
);