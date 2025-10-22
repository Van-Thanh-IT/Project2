// src/services/SearchService.js
import axios from "axios";

// Tạo axios client riêng cho các request public
const axiosPublic = axios.create({
  baseURL: "https://project2-y0u9.onrender.com/api/home", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Hàm tìm kiếm sản phẩm
export const searchProducts = async (keyword) => {
  try {
    const response = await axiosPublic.get(`/products/search`, {
      params: { q: keyword },
    });
    // trả về data từ backend
    return response.data;
  } catch (err) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", err);
    return []; // trả về mảng rỗng nếu lỗi
  }
};


// Lấy sản phẩm theo slug danh mục
export const getProductsByCategorySlug = async (slug) => {
  try {
    const response = await axiosPublic.get(`/products/category/${slug}`);
    return response.data; 
  } catch (err) {
    console.error("Lỗi khi lấy sản phẩm theo danh mục:", err);
    return [];
  }
};


export const createVnpayPayment = async (orderData) => {
    const response = await axiosPublic.post("/payment/pay", orderData);
    return response.data;
};


//lấy đánh giá theo productId
export const getProductReviewStats = async (productId) =>{
 const res = await axiosPublic.get(`/review/stats/${productId}`);
  return res.data;
}




export default axiosPublic;