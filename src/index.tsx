import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from '../App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// React 18+ uses createRoot instead of render
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
