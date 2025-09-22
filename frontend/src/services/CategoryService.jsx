import axiosClient from "./axiosClient";

// Lấy tất cả danh mục
export const getAllCategories = async () => {
  const res = await axiosClient.get("/admin/categories/read");
  return res.data.data;
};

// Tạo danh mục mới
export const createCategory = async (formData) => {
  const res = await axiosClient.post("/admin/categories/create", formData,

    { headers: { "Content-Type": "multipart/form-data" },}
  );
  return res.data;
};

// Cập nhật danh mục
export const updateCategory = async (categoryId, formData) => {
  const res = await axiosClient.put(`/admin/categories/update/${categoryId}`, formData,
    {
    headers: { "Content-Type": "multipart/form-data" },
  }
  );
  return res.data;
};

// Ẩn/hiện danh mục
export const toggleCategoryStatus = async (categoryId, isActive) => {
  const res = await axiosClient.put(`/admin/categories/status/${categoryId}`, isActive);
  return res.data;
};
