import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
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

const ReportStatisticsManagement = () => {
  // State lưu dữ liệu
  const [ordersStatus, setOrdersStatus] = useState([]);
  const [productRevenue, setProductRevenue] = useState([]);
  const [inventoryStatus, setInventoryStatus] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [inventoryTransactions, setInventoryTransactions] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  // Lọc theo thời gian
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [error, setError] = useState(null);

  // Tải dữ liệu cơ bản
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

  // Lấy doanh thu theo thời gian
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

  if (error) return <div className="text-danger p-3">{error}</div>;

  return (
    <Container className="py-4">
      <h1 className="mb-4">Quản lý Báo cáo & Thống kê</h1>

      <ReportOverviewCards/>
      <ReportDashboard/>

  
      {/* 1. Đơn hàng theo trạng thái */}
      <h3>Đơn hàng theo trạng thái</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Trạng thái</th>
            <th>Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {ordersStatus.map((o, idx) => (
            <tr key={idx}>
              <td>{o.status}</td>
              <td>{o.totalOrders}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 2. Doanh thu theo sản phẩm */}
      <h3>Doanh thu theo sản phẩm</h3>
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

      {/* 3. Doanh thu theo thời gian */}
      <h3>Doanh thu theo thời gian</h3>
        {/* Bộ lọc thời gian */}
      <div className="d-flex gap-3 mb-4">
        <div>
          <label>Từ ngày: </label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div>
          <label>Đến ngày: </label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={fetchRevenue}>
          Lọc
        </button>
      </div>
      <Table striped bordered hover responsive>
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
              <td>{r.totalRevenue != null ? r.totalRevenue.toLocaleString() : "0"}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 4. Tồn kho hiện tại */}
      <h3>Tồn kho hiện tại</h3>
      <Table striped bordered hover responsive>
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

      {/* 5. Tồn kho dưới mức cảnh báo */}
      <h3>Tồn kho dưới mức cảnh báo</h3>
      <Table striped bordered hover responsive>
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

      {/* 6. Lịch sử nhập / xuất kho */}
      <h3>Lịch sử nhập / xuất kho</h3>
      <Table striped bordered hover responsive>
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

      {/* 7. Sản phẩm được đánh giá cao */}
      <h3>Sản phẩm được đánh giá cao</h3>
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
    </Container>
  );
};

export default ReportStatisticsManagement;
