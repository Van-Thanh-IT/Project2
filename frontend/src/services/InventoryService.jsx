import axiosClient from "./axiosClient";

// Lấy toàn bộ tồn kho
export const getAllInventory = async () => {
  const res = await axiosClient.get("admin/inventory/read");
  return res.data; // trả về APIResponse
};

// Cập nhật tồn kho
export const updateInventory = async (inventoryId, payload) => {
  const res = await axiosClient.put(`admin/inventory/${inventoryId}/update`, payload);
  return res.data;
};

// Lấy toàn bộ lịch sử giao dịch kho
export const getAllTransactions = async () => {
  const res = await axiosClient.get("admin/inventory/transactions/read");
  return res.data;
};

// Tạo giao dịch nhập / xuất kho
export const createTransaction = async (payload) => {
  const res = await axiosClient.post("admin/inventory/transactions/create", payload);
  return res.data;
};
