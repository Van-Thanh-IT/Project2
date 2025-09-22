import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { jwtDecode } from 'jwt-decode';

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Icons (nếu muốn dùng <i className="bi bi-person"></i>)
import "bootstrap-icons/font/bootstrap-icons.css";
// Bootstrap JS (dropdown, modal…)
import "bootstrap/dist/js/bootstrap.bundle.min.js";


// Kiểm tra token khi app load
const token = localStorage.getItem("token");
if (token) {
  const decoded = jwtDecode(token);
  const now = Date.now() / 1000;
  if (decoded.exp < now) {
    localStorage.removeItem("token"); // token hết hạn → remove
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

