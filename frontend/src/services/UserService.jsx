import axiosClient from "./axiosClient";

// Lấy thông tin user đang đăng nhập
export const getInfo = async () => {
  const res = await axiosClient.get("/users/info");
  return res.data;
};

// Lấy tất cả user
export const getAllUsers = async () => {
  const res = await axiosClient.get("/users/read");
  return res.data;
};

// Cập nhật user
export const updateUser = async (userId, formData) => {
  const res = await axiosClient.put(`/users/update/${userId}`, formData);
  return res.data;
};

// Xóa user
export const deleteUser = async (userId) => {
  const res = await axiosClient.delete(`/users/delete/${userId}`);
  return res.data;
};

// Khóa/Mở khóa user
export const toggleUserActive = async (userId) => {
  const res = await axiosClient.put(`/users/${userId}/toggle-active`);
  return res.data;
};
