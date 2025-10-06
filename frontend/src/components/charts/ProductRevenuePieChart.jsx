import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const ProductRevenuePieChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <h5 className="mb-3">tỷ trọng doanh thu theo sản phẩm</h5>

      {Array.isArray(data) && data.length > 0 ? (
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            dataKey="totalRevenue"   
            nameKey="productName"
            outerRadius={150}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v.toLocaleString()} VNĐ`} />
          <Legend />
        </PieChart>
      ) : (
        <p>Không có dữ liệu</p>
      )}
    </div>
  );
};

export default ProductRevenuePieChart;
