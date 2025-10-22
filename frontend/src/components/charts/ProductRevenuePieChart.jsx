import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];
const RADIAN = Math.PI / 180;

// ✅ Label ngoài hiển thị tên + giá trị VNĐ
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  totalRevenue,
}) => {
  const radius = outerRadius + 25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${name}: ${totalRevenue.toLocaleString()} VNĐ`}
    </text>
  );
};

const ProductRevenuePieChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 420, textAlign: "center" }}>
      <h5 className="mb-3">📊 Tỷ trọng doanh thu theo sản phẩm</h5>

      {Array.isArray(data) && data.length > 0 ? (
        <PieChart width={450} height={400}>
          <Pie
            data={data}
            dataKey="totalRevenue"
            nameKey="productName"
            outerRadius={120}
            labelLine={false}
            label={renderCustomizedLabel}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) =>
              `${props.payload.productName}: ${value.toLocaleString()} VNĐ`
            }
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      ) : (
        <p>Không có dữ liệu</p>
      )}
    </div>
  );
};

export default ProductRevenuePieChart;
