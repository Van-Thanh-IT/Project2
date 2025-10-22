import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import {
  getOrdersByStatus,
  getProductRevenue,
  getInventoryStatus,
  getLowStockInventory,
  getInventoryTransactions,
  getTopRatedProducts,
  getRevenue,
} from "../../services/saleReportService";
import ReportOverviewCards from "./ReportOverviewCards ";
import ReportDashboard from "../../components/charts/ReportDashboard";
import ExportCSV from "../../utils/exportCSV";
import "../../styles/ReportStatisticsManagement.scss";

const ReportStatisticsManagement = () => {
  const [ordersStatus, setOrdersStatus] = useState([]);
  const [productRevenue, setProductRevenue] = useState([]);
  const [inventoryStatus, setInventoryStatus] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [inventoryTransactions, setInventoryTransactions] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          ordersRes,
          productRevenueRes,
          inventoryStatusRes,
          lowStockRes,
          inventoryTransactionsRes,
          topProductsRes,
        ] = await Promise.all([
          getOrdersByStatus(),
          getProductRevenue(),
          getInventoryStatus(),
          getLowStockInventory(),
          getInventoryTransactions(),
          getTopRatedProducts(),
        ]);

        setOrdersStatus(ordersRes.data);
        setProductRevenue(productRevenueRes.data);
        setInventoryStatus(inventoryStatusRes.data);
        setLowStock(lowStockRes.data);
        setInventoryTransactions(inventoryTransactionsRes.data);
        setTopProducts(topProductsRes.data);
      } catch (err) {
        console.error(err);
        setError("Lỗi khi tải dữ liệu báo cáo");
      }
    };
    fetchData();
  }, []);

  const fetchRevenue = async () => {
    if (!start || !end) {
      alert("Vui lòng chọn khoảng thời gian");
      return;
    }
    const startDate = `${start}T00:00:00`;
    const endDate = `${end}T23:59:59`;
    try {
      const res = await getRevenue(startDate, endDate, "day");
      setRevenueData(res.data);
    } catch (err) {
      console.error(err);
      setError("Lỗi khi tải dữ liệu doanh thu");
    }
  };

  // Hàm dịch trạng thái đơn hàng sang tiếng Việt
const translateStatus = (status) => {
  switch (status) {
    case "PENDING":
      return "⏳ Đang chờ xác nhận";
    case "CONFIRMED":
      return "✅ Đã xác nhận";
    case "SHIPPED":
      return "🚚 Đang vận chuyển";
    case "DELIVERED":
      return "📦 Đã giao hàng";
    case "CANCELLED":
      return "❌ Đã hủy";
    default:
      return "Không xác định";
  }
};


  if (error) return <div className="text-danger p-3">{error}</div>;

  return (
    <Container className="py-4 ">
      <h1 className="mb-4 text-center fw-bold page-title">
        📊 Quản lý Báo cáo & Thống kê
      </h1>

      <ReportOverviewCards />

      <Tabs defaultActiveKey="orders" className="custom-tabs my-5" fill>
        {/* Đơn hàng theo trạng thái */}
        <Tab eventKey="orders" title="Đơn hàng theo trạng thái">
          <div className="tab-pane-container">
            <div className="export-btn-wrapper">
              <Button
                variant="success"
                onClick={() => ExportCSV(ordersStatus, "orders_status.csv")}
              >
                📤 Xuất file CSV
              </Button>
            </div>
           <Table striped bordered hover responsive className="sticky-table">
            <thead>
              <tr>
                <th>Trạng thái</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {ordersStatus.map((o, idx) => (
                <tr key={idx}>
                  <td>{translateStatus(o.status)}</td>
                  <td>{o.totalOrders}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          </div>
        </Tab>

        {/* Doanh thu theo sản phẩm */}
        <Tab eventKey="productRevenue" title="Doanh thu theo sản phẩm">
          <div className="tab-pane-container">
            <div className="export-btn-wrapper">
              <Button
                variant="success"
                onClick={() => ExportCSV(productRevenue, "product_revenue.csv")}
              >
                📤 Xuất file CSV
              </Button>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {productRevenue.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.productName}</td>
                    <td>{p.totalQuantity}</td>
                    <td>{p.totalRevenue.toLocaleString()} VNĐ</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Tab>

        {/* Doanh thu theo thời gian */}
        <Tab eventKey="revenueTime" title="Doanh thu theo thời gian">
          <div className="tab-pane-container">
            <div className="filter-container">
              <div>
                <label>Từ ngày:</label>
                <input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="form-control"
                />
              </div>
              <div>
                <label>Đến ngày:</label>
                <input
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="form-control"
                />
              </div>
              <Button variant="primary" onClick={fetchRevenue}>
                Lọc
              </Button>
              <Button
                variant="success"
                onClick={() => ExportCSV(revenueData, "revenue_time.csv")}
              >
                📤 Xuất file CSV
              </Button>
            </div>
            <Table striped bordered hover >
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.map((r, idx) => (
                  <tr key={idx}>
                    <td>{r.date}</td>
                    <td>{r.totalRevenue?.toLocaleString() ?? "0"} VNĐ</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Tab>

        {/* Các tab còn lại giữ nguyên, chỉ thêm export tương tự */}
        <Tab eventKey="inventory" title="Tồn kho hiện tại">
          <div className="tab-pane-container">
            <div className="export-btn-wrapper">
              <Button
                variant="success"
                onClick={() => ExportCSV(inventoryStatus, "inventory_status.csv")}
              >
                📤 Xuất file CSV
              </Button>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Màu</th>
                  <th>Size</th>
                  <th>Tồn kho</th>
                </tr>
              </thead>
              <tbody>
                {inventoryStatus.map((i, idx) => (
                  <tr key={idx}>
                    <td>{i.productName}</td>
                    <td>{i.color}</td>
                    <td>{i.size}</td>
                    <td>{i.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Tab>

        <Tab eventKey="lowStock" title="Tồn kho dưới mức cảnh báo">
          <div className="tab-pane-container">
            <div className="export-btn-wrapper">
              <Button
                variant="success"
                onClick={() => ExportCSV(lowStock, "low_stock.csv")}
              >
                📤 Xuất file CSV
              </Button>
            </div>
            <Table striped bordered hover >
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Màu</th>
                  <th>Size</th>
                  <th>Tồn kho</th>
                  <th>Mức cảnh báo</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((i, idx) => (
                  <tr key={idx}>
                    <td>{i.productName}</td>
                    <td>{i.color}</td>
                    <td>{i.size}</td>
                    <td>{i.quantity}</td>
                    <td>{i.safetyStock}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Tab>

        <Tab eventKey="transactions" title="Lịch sử nhập / xuất kho">
          <div className="tab-pane-container">
            <div className="export-btn-wrapper">
              <Button
                variant="success"
                onClick={() =>
                  ExportCSV(inventoryTransactions, "inventory_transactions.csv")
                }
              >
                📤 Xuất file CSV
              </Button>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Sản phẩm</th>
                  <th>Màu</th>
                  <th>Size</th>
                  <th>Loại</th>
                  <th>Số lượng</th>
                  <th>Nguồn</th>
                </tr>
              </thead>
              <tbody>
                {inventoryTransactions.map((t, idx) => (
                  <tr key={idx}>
                    <td>{new Date(t.transactionDate).toLocaleString()}</td>
                    <td>{t.productName}</td>
                    <td>{t.color}</td>
                    <td>{t.size}</td>
                    <td>{t.transactionType}</td>
                    <td>{t.quantity}</td>
                    <td>{t.transactionSource}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Tab>

        <Tab eventKey="topProducts" title="Sản phẩm được đánh giá cao">
          <div className="tab-pane-container">
            <div className="export-btn-wrapper">
              <Button
                variant="success"
                onClick={() => ExportCSV(topProducts, "top_products.csv")}
              >
                📤 Xuất file CSV
              </Button>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Lượt đánh giá</th>
                  <th>Điểm TB</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.productName}</td>
                    <td>{p.reviewCount}</td>
                    <td>{p.averageRating}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Tab>
      </Tabs>

      <ReportDashboard />
    </Container>
  );
};

export default ReportStatisticsManagement;
