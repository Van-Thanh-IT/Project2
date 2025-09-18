import axios from "axios";
import Store from "../redux/Store";
import { logout } from "../redux/features/authSlice";

// "http://localhost:8080/api",
// const axiosClient = axios.create({
//   baseURL: "https://project-northwest-cuisine-2.onrender.com/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // dùng cookie nếu backend cần
// });

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // dùng cookie nếu backend cần
});

// Xử lý lỗi response
// axiosClient.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       Store.dispatch(logout());
//       window.location.href = "/login";
//     }
//     return Promise.reject(err);
//   }
// );

export default axiosClient;