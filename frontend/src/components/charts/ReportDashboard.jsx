import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Card, Form, Button } from "react-bootstrap";

import RevenueLineChart from "./RevenueLineChart";
import OrderStatusBarChart from "./OrderStatusBarChart";
import ProductRevenuePieChart from "./ProductRevenuePieChart";
import InventoryAreaChart from "./InventoryAreaChart";

import ProductRatingChart from "./ProductRatingChart";



import {
  getOrdersByStatus,
  getProductRevenue,
  getInventoryStatus,
  getRevenue,
} from "../../services/saleReportService";

// Hàm định dạng yyyy-mm-dd
const formatDate = (date) => date.toISOString().split("T")[0];

function ReportDashboard() {
  const today = new Date();

  const [granularity, setGranularity] = useState("day");
  const [startDate, setStartDate] = useState("2025-01-01");  
  const [endDate, setEndDate] = useState(formatDate(today)); 

  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [productRevenueData, setProductRevenueData] = useState([]);
  const [inventoryStatusData, setInventoryStatusData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const revenue = await getRevenue(
        `${startDate}T00:00:00`,
        `${endDate}T23:59:59`,
        granularity
      );
      const orderStatus = await getOrdersByStatus();
      const productRevenue = await getProductRevenue();
      const inventoryStatus = await getInventoryStatus();

      setRevenueData(revenue.data || []);
      setOrderStatusData(orderStatus.data || []);
      setProductRevenueData(productRevenue.data || []);
      setInventoryStatusData(inventoryStatus.data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
  <Container fluid className="mt-4">
    {loading ? (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    ) : (
      <>
        {/* Card Doanh thu + Bộ lọc */}
        <Row className="mb-4">
          <Col md={12}>
            <Card>
              <Card.Body>
                {/* Bộ lọc nằm trong Card */}
                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Label>Ngày bắt đầu</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Col>

                  <Col md={3}>
                    <Form.Label>Ngày kết thúc</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      max={formatDate(today)}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Col>

                  <Col md={3}>
                    <Form.Label>Chế độ</Form.Label>
                    <Form.Select
                      value={granularity}
                      onChange={(e) => setGranularity(e.target.value)}
                    >
                      <option value="day">Theo ngày</option>
                      <option value="month">Theo tháng</option>
                      <option value="year">Theo năm</option>
                    </Form.Select>
                  </Col>

                  <Col md={2} className="d-flex align-items-end">
                    <Button onClick={fetchData}>Lọc dữ liệu</Button>
                  </Col>
                </Row>

                {/* Biểu đồ Doanh thu */}
                <RevenueLineChart data={revenueData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Trạng thái đơn hàng */}
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <OrderStatusBarChart data={orderStatusData} />
              </Card.Body>
            </Card>
          </Col>

          {/* Top sản phẩm doanh thu */}
          <Col md={6}>
            <Card>
              <Card.Body>
                <ProductRevenuePieChart data={productRevenueData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tồn kho */}
        <Row>
          <Col md={12}>
            <Card>
              <Card.Body>
                <InventoryAreaChart data={inventoryStatusData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Biểu đồ đánh giá sản phẩm */}
      <Row className="mb-4">
        <Col md={12}>
          <ProductRatingChart />
        </Col>
      </Row>

      </>
    )}
  </Container>
);


}

export default ReportDashboard;
