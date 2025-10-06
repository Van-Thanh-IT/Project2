// src/services/axiosClient.js
import axios from "axios";
import { toast } from "react-toastify";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
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
    if (error.response?.status === 401) {
      const url = error.config.url; // URL của request

      // Chỉ hiển thị thông báo cho các endpoint admin hoặc user
      const notifyUrls = [
        "/users/profile",    // user cá nhân
        "/admin/",           // admin
      ];

      const shouldNotify = notifyUrls.some((u) => url.startsWith(u));

      if (shouldNotify) {
        toast.info("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
      }

      // Luôn xóa token nếu hết hạn
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);


export default axiosClient;
