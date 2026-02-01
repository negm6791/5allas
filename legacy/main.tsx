import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log("5allas OS v5: Initializing Kernel...");

window.onerror = (msg, url, line, col, error) => {
    console.error("5allas KERNEL CRASH:", { msg, url, line, col, error });
    return false;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
    console.error("5allas ERROR: Root element #root not found in DOM.");
} else {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
