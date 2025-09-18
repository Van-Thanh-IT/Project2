import axiosClient from "./axiosClient";
//http://localhost:8080/api/admin/read,create,update/{id},is_active/{id}
export const getAllProducts = async () => {
  const res = await axiosClient.get("read");
  return res.data;
};

export const createProduct = async (data) => {
  const res = await axiosClient.post("product/create", data, {
    headers: {
      "Content-Type": undefined, // ✅ Cho phép Axios tự set multipart/form-data
    },
  });
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await axiosClient.post(`product/update/${id}`, data, {
    headers: {
      "Content-Type": undefined,
    },
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axiosClient.delete(`product/delete/${id}`);
  return res.data;
};

export const toggleProductStatus = async (id, status) => {
  const res = await axiosClient.put(`product/status/${id}`, { status });
  return res.data;
};

export const totalProduct = async () => {
  const res = await axiosClient.get("product/total");
  return res.data;
};

export const getProductDetails = async (id) => {
  console.log("ID: ", id);
  const res = await axiosClient.get(`product/details/${id}`);
  return res.data;
};