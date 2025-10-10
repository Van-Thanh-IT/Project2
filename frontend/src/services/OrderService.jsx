import axiosClient from "./axiosClient";


// Lấy tất cả đơn hàng của 1 user
export const getOrderByUser = async (userId) => {
  const res = await axiosClient.get(`users/orders/user/${userId}`);
  return res.data; 
};

// Lấy tất cả đơn hàng
export const getAllOrders = async () => {
  const res = await axiosClient.get(`/admin/orders/read`);
  return res.data;
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
  const res = await axiosClient.put(`/admin/orders/${orderId}/status?status=${status}`);
  return res.data;
};


// Hủy đơn hàng
export const cancelOrder = async (orderId) => {
  const res = await axiosClient.put(`/admin/orders/${orderId}/cancel`);
  return res.data;
};

// // Đánh dấu thanh toán đã trả
// export const markPaymentPaid = async (paymentId) => {
//   const res = await axiosClient.put(`/admin/payments/${paymentId}/paid`);
//   return res.data;
// };

// Cập nhật vận chuyển
export const updateShipment = async (shipmentId, payload) => {
  // payload có thể gồm: { status, trackingNumber }
  const res = await axiosClient.put(`/admin/orders/shipments/${shipmentId}`, payload);
  return res.data;
};
