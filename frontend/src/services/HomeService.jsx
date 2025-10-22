import axiosClient from "./axiosClient";

// Lấy tất cả danh mục (public)
export const getAllCategories = async () => {
   const res = await axiosClient.get("/home/category/read", { requiresAuth: false });
   return res.data;
}

// Lấy sản phẩm cho trang home (public)
export const getAllHomeProducts = async () => {
  const res = await axiosClient.get("/home/products/read", { requiresAuth: false });
  return res.data;
};

// Lấy sản phẩm nổi bật 
export const  getTopSellingProducts = async () => {
  const res = await axiosClient.get("/home/product/top-selling", { requiresAuth: false });
  return res.data;
};

export const getProductDetail = async (slug) => {
  const res = await axiosClient.get(`/home/products/${slug}`, { requiresAuth: false });
  return res.data;
}

// Lấy danh sách locations (public)
export const getLocations = async () => {
  const res = await axiosClient.get("/home/locations/read", { requiresAuth: false });
  return res.data; 
};

// Tạo đơn hàng mới (có thể cần token nếu user đã login)
export const createOrder = async (orderData) => {
  const res = await axiosClient.post(`/home/orders/create`, orderData, { requiresAuth: true });
  return res.data;
};

// Kiểm tra tình trạng tồn kho của sản phẩm theo variantId và số lượng yêu cầu
export const checkProductStock = async (variantId, requiredQuantity = 1) => {
  const res = await axiosClient.get(`/home/product/status/${variantId}`, {
    params: { requiredQuantity },
    requiresAuth: false
  });
  return res.data; 
};



