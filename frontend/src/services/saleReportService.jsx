import axiosClient from "./axiosClient";

// Tổng số sản phẩm
export const getTotalProducts = () => axiosClient.get("/admin/reports/product/total");

// Tổng số người dùng
export const getTotalUsers = () => axiosClient.get("/admin/reports/user/total");

// Tổng doanh thu
export const getTotalRevenue = () => axiosClient.get("/admin/reports/order/total_revenue");

// Tổng đơn hàng
export const getTotalOrders = () => axiosClient.get("/admin/reports/order/total");

// Báo cáo đơn hàng theo trạng thái
export const getOrdersByStatus = () => axiosClient.get("/admin/reports/order/status");

// Doanh thu theo ngày/tháng/năm
export const getRevenue = (start, end, groupBy = "day") => 
  axiosClient.get("/admin/reports/order/revenue", { params: { start, end, groupBy } });

// Doanh thu theo sản phẩm
export const getProductRevenue = () => axiosClient.get("/admin/reports/order/product");

// Tồn kho hiện tại
export const getInventoryStatus = () => axiosClient.get("/admin/reports/inventory/status");

// Tồn kho dưới mức cảnh báo
export const getLowStockInventory = () => axiosClient.get("/admin/reports/inventory/low-stock");

// Lịch sử nhập/xuất kho
export const getInventoryTransactions = () => axiosClient.get("/admin/reports/inventory/transactions");

// Lọc người dùng theo khoảng thời gian
export const getNewUsersByBetween = (start, end) =>
  axiosClient.get("/admin/reports/user", { params: { start, end } });

// Sản phẩm đánh giá cao/thấp
export const getTopRatedProducts = () => axiosClient.get("/admin/reports/review/products/top-rated");
export const getLowestRatedProducts = () => axiosClient.get("/admin/reports/review/products/lowest-rated");
