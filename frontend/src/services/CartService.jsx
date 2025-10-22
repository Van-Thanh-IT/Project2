import axiosClient from "./axiosClient";

// 🛒 Lấy giỏ hàng của user
export const getCart = async (userId) => {
  // ✅ Kiểm tra userId hợp lệ
  if (!userId || userId === "undefined" || userId === null) {
    console.warn("⚠️ getCart bị gọi khi userId chưa sẵn sàng:", userId);
    return { items: [] }; // Trả giỏ hàng rỗng để tránh lỗi
  }

  try {
    const res = await axiosClient.get(`cart/${userId}`);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy giỏ hàng:", error);
    throw error;
  }
};

// ➕ Thêm sản phẩm vào giỏ
export const addToCart = async (userId, cartItem) => {
  if (!userId || userId === "undefined") {
    console.error("❌ addToCart: userId không hợp lệ:", userId);
    throw new Error("User ID không hợp lệ");
  }

  console.log("📦 Dữ liệu gửi lên addToCart:", userId, cartItem);

  try {
    const res = await axiosClient.post(`cart/${userId}/add`, cartItem);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi thêm sản phẩm vào giỏ:", error);
    throw error;
  }
};

// ❌ Xóa sản phẩm khỏi giỏ
export const removeCartItem = async (userId, cartItemId) => {
  if (!userId || userId === "undefined") {
    console.error("❌ removeCartItem: userId không hợp lệ:", userId);
    throw new Error("User ID không hợp lệ");
  }

  try {
    const res = await axiosClient.delete(`cart/${userId}/remove/${cartItemId}`);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi xoá sản phẩm khỏi giỏ:", error);
    throw error;
  }
};
