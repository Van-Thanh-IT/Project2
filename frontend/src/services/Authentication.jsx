import axiosClient from "./axiosClient";

export const login = async (email, password) =>{
    const response = await axiosClient.post("/auth/login", {email, password});
    return response.data;
}

export const register = async (formData) =>{
   const response = await axiosClient.post("/auth/register", formData);
   return response.data;
}