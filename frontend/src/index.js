import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Icons (nếu muốn dùng <i className="bi bi-person"></i>)
import "bootstrap-icons/font/bootstrap-icons.css";
// Bootstrap JS (dropdown, modal…)
import "bootstrap/dist/js/bootstrap.bundle.min.js";


const clientId = "595448726961-kvt4kksrmn17de509lksfsidkfcflh9q.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
  </React.StrictMode>
);

