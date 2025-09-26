import React from "react";
import { Card } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "react-bootstrap";

const data = [
  { name: "Th1", doanhthu: 4000 },
  { name: "Th2", doanhthu: 3000 },
  { name: "Th3", doanhthu: 5000 },
  { name: "Th4", doanhthu: 7000 },
  { name: "Th5", doanhthu: 6000 },
];

const DashboardPage = () => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Nội dung */}
      <div className="flex-grow-1 p-4">
        {/* Header */}
        <div className="mb-4">
          <h2>Trang chủ Admin</h2>
        </div>

        {/* Thống kê nhanh */}
        <div className="row mb-4">
          <div className="col-md-3">
            <Card className="shadow-sm p-3">
              <h5>Tổng sản phẩm</h5>
              <h3>120</h3>
            </Card>
          </div>
          <div className="col-md-3">
            <Card className="shadow-sm p-3">
              <h5>Tổng đơn hàng</h5>
              <h3>350</h3>
            </Card>
          </div>
          <div className="col-md-3">
            <Card className="shadow-sm p-3">
              <h5>Người dùng</h5>
              <h3>95</h3>
            </Card>
          </div>
          <div className="col-md-3">
            <Card className="shadow-sm p-3">
              <h5>Doanh thu</h5>
              <h3>50,000,000₫</h3>
            </Card>
          </div>
        </div>

        {/* Biểu đồ doanh thu */}
        <Card className="shadow-sm p-3">
          <h5>Thống kê doanh thu theo tháng</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="doanhthu" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
