// src/services/axiosClient.js
import axios from "axios";
import { toast } from "react-toastify";
// https://male-dayna-vanthanh-02b52a66.koyeb.app
//  http://localhost:8080
// https://project2-y0u9.onrender.com/
const axiosClient = axios.create({
  baseURL: "https://project2-y0u9.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn token vào header Authorization
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý khi token hết hạn
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error;

    if (response?.status === 401 && config.requiresAuth) {
      toast.info("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
