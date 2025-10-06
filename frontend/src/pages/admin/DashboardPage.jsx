import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { FaBoxOpen, FaShoppingCart, FaUsers, FaDollarSign } from "react-icons/fa";
import ReportDashboard from "../../components/charts/ReportDashboard";
import { getTotalProducts, getTotalUsers, getTotalRevenue, getTotalOrders } from "../../services/saleReportService";

const DashboardPage = () => {
  const [totals, setTotals] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const [productsRes, ordersRes, usersRes, revenueRes] = await Promise.all([
          getTotalProducts(),
          getTotalOrders(),
          getTotalUsers(),
          getTotalRevenue()
        ]);

        setTotals({
          products: productsRes.data,
          orders: ordersRes.data,
          users: usersRes.data,
          revenue: revenueRes.data
        });
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu tổng:", err);
      }
    };

    fetchTotals();
  }, []);

  const cardData = [
    { title: "Tổng sản phẩm", value: totals.products, icon: <FaBoxOpen size={30} />, bg: "#4e73df" },
    { title: "Tổng đơn hàng", value: totals.orders, icon: <FaShoppingCart size={30} />, bg: "#1cc88a" },
    { title: "Người dùng", value: totals.users, icon: <FaUsers size={30} />, bg: "#36b9cc" },
    { title: "Doanh thu", value: totals.revenue.toLocaleString() + "đ", icon: <FaDollarSign size={30} />, bg: "#f6c23e" }
  ];

  return (
    <div className="p-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
      <h2 className="mb-4">Trang chủ Admin</h2>

      <div className="row mb-4">
        {cardData.map((card, idx) => (
          <div key={idx} className="col-md-3 mb-3">
            <Card 
              className="shadow-sm text-white" 
              style={{ 
                backgroundColor: card.bg, 
                cursor: "pointer", 
                transition: "transform 0.2s", 
                minHeight: "180px",      // tăng chiều cao
                borderRadius: "10px",    // bo góc mềm mại
                padding: "10px"          // tăng padding
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <Card.Title style={{ fontSize: "1.2rem" }}>{card.title}</Card.Title>
                  <h3 className="mt-2" style={{ fontSize: "2rem" }}>{card.value}</h3> {/* tăng font-size */}
                </div>
                <div style={{ fontSize: "2.5rem" }}>{card.icon}</div> {/* icon to hơn */}
              </Card.Body>
            </Card>

          </div>
        ))}
      </div>

      <ReportDashboard />
    </div>
  );
};

export default DashboardPage;
