import axiosClient from "./axiosClient";

// Lấy giỏ hàng của user
export const getCart = async (userId) => {
  const res = await axiosClient.get(`cart/${userId}`);
  return res.data;
};

// Thêm sản phẩm vào giỏ
export const addToCart = async (userId, cartItem) => {
  const res = await axiosClient.post(`cart/${userId}/add`, cartItem);
  return res.data;
};

// Xoá sản phẩm khỏi giỏ
export const removeCartItem = async (userId, cartItemId) => {
  const res = await axiosClient.delete(`cart/${userId}/remove/${cartItemId}`);
  return res.data;
};
