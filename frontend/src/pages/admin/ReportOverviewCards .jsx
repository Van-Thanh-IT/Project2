import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import {
  getOrdersByStatus,
  getTopRatedProducts,
  getLowStockInventory,
  getTotalRevenue,
} from "../../services/saleReportService";
import { FaDollarSign, FaShoppingCart, FaStar, FaExclamationTriangle } from "react-icons/fa";

const ReportOverviewCards = () => {
  const [overview, setOverview] = useState({
    totalRevenue: 0,
    completedOrders: 0,
    topProduct: null,
    lowStockCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
      

        const [revenueRes, ordersRes, topProductsRes, lowStockRes] =
          await Promise.all([
            getTotalRevenue(),
            getOrdersByStatus(),
            getTopRatedProducts(),
            getLowStockInventory(),
          ]);

        const completedOrders =
          ordersRes.data.find((o) => o.status === "DELIVERED")?.totalOrders || 0;

        const topProduct =
          topProductsRes.data.length > 0 ? topProductsRes.data[0] : null;

        const lowStockCount = lowStockRes.data.length;

       const totalRevenue = revenueRes.data; 

        setOverview({totalRevenue, completedOrders, topProduct, lowStockCount });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu tổng quan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading)
    return <Spinner animation="border" className="m-3 text-primary" />;

  const iconStyle = { fontSize: "2.5rem", opacity: 0.3 };

  const cards = [
    {
      title: "Tổng doanh thu",
      value: `${overview.totalRevenue} VNĐ`,
      icon: <FaDollarSign className="text-success" style={iconStyle} />,
      border: "border-success",
    },
    {
      title: "Đơn hàng hoàn tất",
      value: overview.completedOrders,
      icon: <FaShoppingCart className="text-primary" style={iconStyle} />,
      border: "border-primary",
    },
    {
      title: "Sản phẩm bán chạy",
      value: overview.topProduct ? overview.topProduct.productName : "Chưa có",
      subValue: `Lượt bán: ${overview.topProduct?.reviewCount || 0}`,
      icon: <FaStar className="text-warning" style={iconStyle} />,
      border: "border-warning",
    },
    {
      title: "Tồn kho thấp",
      value: overview.lowStockCount,
      icon: <FaExclamationTriangle className="text-danger" style={iconStyle} />,
      border: "border-danger",
    },
  ];

  return (
    <Row className="g-3">
      {cards.map((item, idx) => (
        <Col key={idx} xs={12} sm={6} md={3}>
          <Card className={`shadow-sm ${item.border} h-100`}>
            <Card.Body className="d-flex flex-column justify-content-between">
              <div>{item.icon}</div>
              <div>
                <Card.Title>{item.title}</Card.Title>
                <h5 className="fw-bold">{item.value}</h5>
                {item.subValue && <p className="mb-0">{item.subValue}</p>}
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ReportOverviewCards;
