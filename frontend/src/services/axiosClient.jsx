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
   if (token && !config.url.startsWith("/home")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý khi token hết hạn
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.info("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
