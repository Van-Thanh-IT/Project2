import axiosClient from "./axiosClient";

// Lấy tất cả sản phẩm
export const getAllProducts = async () => {
  const res = await axiosClient.get("/admin/products/read");
  return res.data;
};

// Lấy sản phẩm cho trang home
export const getAllHomeProducts = async () => {
  const res = await axiosClient.get("/home/products/read");
  return res.data;
};

// Tạo sản phẩm
export const createProduct = async (productData) => {
  const res = await axiosClient.post("/admin/products/create", productData);
  return res.data;
};

// Cập nhật sản phẩm
export const updateProduct = async (productId, productData) => {
  const res = await axiosClient.put(`/admin/products/update/${productId}`, productData);
  return res.data;
};

// Xóa mềm sản phẩm
export const softDeleteProduct = async (productId, body) => {
  const res = await axiosClient.put(`/admin/products/deletesoft/${productId}`, body);
  return res.data;
};


//////////////////////////ProductImgae/////////////////////////////////
//lấy ảnh theo productId
export const getProductImages = async (productId) => {
  const res = await axiosClient.get(`/admin/products/${productId}/images/read`);
  return res.data.data; 
}
// Thêm ảnh cho sản phẩm
export const createProductImage = async (productId, formData) => {
  const res = await axiosClient.post(`/admin/products/${productId}/images/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Cập nhật ảnh sản phẩm
export const updateProductImage = async (imageId, formData) => {
  const res = await axiosClient.put(`/admin/products/images/update/${imageId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Xóa ảnh sản phẩm
export const deleteProductImage = async (imageId) => {
  return axiosClient.delete(`/admin/products/images/delete/${imageId}`);
};



/////////////////////// ProductVariant ///////////////////////

// Lấy tất cả variant theo productId
export const getProductVariants = async (productId) => {
  const res = await axiosClient.get(`/admin/products/${productId}/variants/read`);
  return res.data;
};

// Tạo variant
export const createProductVariant = async (productId, formData) => {
  const res = await axiosClient.post(
    `/admin/products/${productId}/variants/create`,formData);
  return res.data;
};

// Cập nhật variant
export const updateProductVariant = async (variantId, formData) => {
  const res = await axiosClient.put( `/admin/products/${variantId}/variants/update`,formData);
  return res.data;
};

// Xóa variant
export const deleteProductVariant = async (variantId) => {
  const res = await axiosClient.delete(`/admin/products/variants/delete/${variantId}`);
  return res.data;
};
