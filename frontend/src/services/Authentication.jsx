import axiosClient from "./axiosClient";

// Đăng nhập bằng tài khoản thường
export const login = async (email, password) => {
  const response = await axiosClient.post("/auth/login", { email, password });
  return response.data;
};

// Đăng ký
export const register = async (formData) => {
  const response = await axiosClient.post("/auth/register", formData);
  return response.data;
};

//quên mk
export const forgotPassword = async ({ email, password, confirmPassword }) => {
  const response = await axiosClient.put("/auth/forgot_password", { email, password, confirmPassword });
  return response.data;
};

//Đăng nhập bằng Google
export const loginWithGoogle = async (idToken) => {
  const response = await axiosClient.post("/auth/google-login", { idToken });
  return response.data;
};

// Đăng nhập bằng Facebook
export const loginWithFacebook = async (accessToken) => {
  try {
    const response = await axiosClient.post("/auth/facebook-login", { accessToken });
    return response.data; // trả về dữ liệu từ backend (AuthenticationResponse)
  } catch (error) {
    // Xử lý lỗi
    console.error("Lỗi đăng nhập Facebook:", error.response?.data || error.message);
    throw error;
  }
};