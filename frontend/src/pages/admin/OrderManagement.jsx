import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Stack, Form } from "react-bootstrap";
import { 
  getAllOrders, 
  updateOrderStatus, 
  cancelOrder, 
  updateShipment ,
  
} from "../../services/OrderService";
import "../../styles/global.scss";
import { toast } from "react-toastify";
import OrderDetailModal from "../../components/modal/OrderDetailModal";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
      setFilteredOrders(res.data);
   
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await updateOrderStatus(orderId, status);
      toast.success(res.messages);
      fetchOrders();
      handleClose();
    } catch (error) {
      console.error("Failed to update order status", error);
      toast.error("Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const handleCancelOrder = async (orderId) => {
    if(!window.confirm(`Bạn có chắc chẵn muốn hủy đơn hàng có mã đơn là: ${orderId} này không?`)) return;
    try {
      const res = await cancelOrder(orderId);
      toast.success(res.messages);
      fetchOrders();
      handleClose();
    } catch (error) {
      console.error("Failed to cancel order", error);
      toast.error(error?.response?.data?.messages || "Không thể hủy đơn hàng");
    }
  };

  const handleUpdateShipment = async (shipmentId, status, trackingNumber) => {
    try {
      const res = await updateShipment(shipmentId, { status, trackingNumber });
      toast.success(res.messages);
      fetchOrders();
      handleClose();
    } catch (error) {
      console.error("Failed to update shipment", error);
      toast.error(error?.response?.data?.messages);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge bg="secondary">Đang chờ xác nhận</Badge>;
      case "CONFIRMED":
        return <Badge bg="info">Đã xác nhận</Badge>;
      case "SHIPPED":
        return <Badge bg="warning">Đang vận chuyển</Badge>;
      case "DELIVERED":
        return <Badge bg="success">Đã giao</Badge>;
      case "CANCELLED":
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">Không hợp lệ</Badge>;
    }
  };

  const normalize = (str) =>
    str?.toString().trim().replace(/\s+/g, " ").toLowerCase() || "";

  const handleSearch = (e) => {
    const term = normalize(e.target.value);
    setSearchTerm(e.target.value);

    const filtered = orders.filter((order) => {
      const userName = order.user?.fullName || order.fullName || "";
      const status = order.status || "";
      const code = order.code || "";

      return (
        normalize(userName).includes(term) ||
        normalize(status).includes(term) ||
        normalize(code).includes(term)
      );
    });

    setFilteredOrders(filtered);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 page-title">Quản lý đơn hàng</h3>

      <Form.Control
        type="text"
        className="form-control mb-3 w-50"
        placeholder="Tìm kiếm theo mã đơn, người đặt, trạng thái..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <div style={{ maxHeight: "550px", overflowY: "auto" }}>
        <Table striped bordered hover className="table-dark align-middle text-center">
          <thead className="table-primary">
            <tr>
              <th>Mã đơn</th>
              <th>Người đặt</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Ngày đặt</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.user?.fullName || order.fullName || "Khách vãng lai"}</td>
                <td>{renderStatusBadge(order.status)}</td>
                <td>{order.total.toLocaleString()} VNĐ</td>
                <td>{new Date(order.placedAt).toLocaleString()}</td>
                <td>
                  <Stack direction="horizontal" gap={2} className="justify-content-center flex-wrap">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleViewDetails(order)}
                    >
                      👁 Xem chi tiết
                    </Button>
                    {order.status !== "CANCELLED" && order.status !== "DELIVERED"  ?  (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleCancelOrder(order.orderId)}
                      >
                        ❌ Hủy đơn
                      </Button>
                    ) : null}
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/*Modal chi tiết đơn hàng */}
      <OrderDetailModal
        show={showModal}
        onHide={handleClose}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onCancelOrder={handleCancelOrder}
        onUpdateShipment={handleUpdateShipment}
      />

    </div>
  );
};

export default OrderManagement;
