import axiosClient from "./axiosClient";

// Tạo review mới
export const createReview = async (payload) => {
  // payload: { userId, productId, rating, comment }
  const res = await axiosClient.post("/users/reviews/create", payload);
  return res.data;
};

// Cập nhật review
export const updateReview = async (reviewId, payload) => {
  
  const res = await axiosClient.put(`/users/reviews/${reviewId}/update`, payload);
  return res.data;
};

// Xóa review
export const deleteReview = async (reviewId) => {
  const res = await axiosClient.delete(`/users/reviews/delete/${reviewId}`);
  return res.data;
};

// Ẩn hoặc hiện review
export const toggleReviewVisibility = async (reviewId, status) => {
  const res = await axiosClient.patch(`/users/reviews/${reviewId}/status?status=${status}`);
  return res.data;
};

// Lấy tất cả review
export const getAllReviews = async () => {
  const res = await axiosClient.get(`/users/reviews`);
  return res.data;
};

// Lấy review theo sản phẩm
export const getReviewsByProduct = async (productId) => {
  const res = await axiosClient.get(`/users/reviews/product/${productId}`);
  return res.data;
};

// Lấy review theo user
export const getReviewsByUser = async (userId) => {
  const res = await axiosClient.get(`/users/reviews/user/${userId}`);
  return res.data;
};
