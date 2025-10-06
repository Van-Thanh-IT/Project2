import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

const RevenueBarChart = ({ data, granularity }) => {
  // format nhãn trên trục X tùy theo chế độ
  const formatXAxis = (value) => {
    if (granularity === "day") {
      // lấy ngày/tháng
      return new Date(value).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    }
    if (granularity === "month") {
      return value; // ví dụ "2025-10"
    }
    return value; // với năm thì giữ nguyên
  };

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h5 className="mb-3">Doanh thu theo {granularity === "day" ? "ngày" : granularity === "month" ? "tháng" : "năm"}</h5>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="placedAt" tickFormatter={formatXAxis} />
          <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} />
          <Tooltip
            labelFormatter={(label) => `Thời gian: ${label}`}
            formatter={(v) => `${v.toLocaleString()}`}
          />
          <Legend />
          <Bar dataKey="totalRevenue" name="Doanh thu" fill="#82ca9d" />
          <Bar dataKey="totalOrders" name="Số đơn hàng" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueBarChart;
