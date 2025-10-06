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

const InventoryCurrentChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <h5 className="mb-3">Tồn kho hiện tại theo sản phẩm</h5>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="variantId"    
            angle={-30}              
            textAnchor="end"
            interval={0}           
          />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} sản phẩm`, "Tồn kho"]} />
          <Legend />
          <Bar
            dataKey="quantity"
            name="Số lượng tồn kho"
            fill="#4a90e2"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InventoryCurrentChart;
