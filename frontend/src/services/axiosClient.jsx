import axios from "axios";
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

export default axiosClient;
