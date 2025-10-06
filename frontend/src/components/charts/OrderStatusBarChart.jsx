import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const OrderStatusBarChart = ({ data }) => {
  const statusMap = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    SHIPPED: "Đang giao",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
  };

  // Chuyển status sang tiếng Việt
  const chartData = (data || []).map(item => ({
    ...item,
    status: statusMap[item.status] || item.status
  }));

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h5 className="mb-3">Đơn hàng theo trạng thái</h5>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalOrders" fill="#82ca9d" barSize={50} name={"Tổng số hàng"} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderStatusBarChart;
