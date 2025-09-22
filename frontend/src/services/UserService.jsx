import axiosClient from "./axiosClient";

export const getInfo = async () =>{
    const response = await axiosClient.get("/user/info");
    return response.data;
    
}