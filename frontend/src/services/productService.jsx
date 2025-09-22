import axiosClient from "./axiosClient";

//get home
export const getAllHomeProducts = async () => {
  const res = await axiosClient.get("/home/products/read");
  return res.data;
};

// get product
export const getAllProducts = async () =>{
   const res = await axiosClient.get("/admin/products/read")
   return res.data;
}

//create product
export const createProducts = async (formData) =>{
  console.log("dl nhận đc: ",formData );
  const res = await axiosClient.post("/admin/products/create/", formData);
  return res.data;
}

// update product
export const updateProduct = async (productId, formData) => {
  console.log("dl nhận đc: ",formData );
  const res = await axiosClient.put(`/admin/products/update/${productId}`, formData);
  return res.data;
};

// delet soft
export const deleteProduct = async (productId, isActive) =>{
  const res = await axiosClient.put(`/admin/products/deletesoft/${productId}`, isActive);
  return res.data;
}
