import axiosClient from "./axiosClient";

//lất tất cả danh mục
export const getAllCategories = async () =>{
   const res = await axiosClient.get("/home/category/read");
   return res.data;
}

// Lấy sản phẩm cho trang home
export const getAllHomeProducts = async () => {
  const res = await axiosClient.get("/home/products/read");
  return res.data;
};

export const getProductDetail = async (slug) =>{
  const res = await axiosClient.get(`/home/products/${slug}`);
  return res.data;
}

// Lấy danh sách locations
export const getLocations = async () => {
  const res = await axiosClient.get("/home/locations/read");
  return res.data; 
};

// 🔹 Tạo đơn hàng mới
export const createOrder = async (orderData) => {
  // orderData giống cấu trúc JSON bạn gửi trước
  const res = await axiosClient.post(`/home/orders/create`, orderData);
  return res.data;
};
