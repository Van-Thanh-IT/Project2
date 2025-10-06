import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Badge, Stack, Form } from "react-bootstrap";
import { 
  getAllOrders, 
  updateOrderStatus, 
  cancelOrder, 
  updateShipment 
} from "../../services/OrderService";
import "../../styles/global.scss";
import { toast } from "react-toastify";

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
      setFilteredOrders(res.data)
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
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await cancelOrder(orderId);
       toast.success(res.messages);
      fetchOrders();
      handleClose();
    } catch (error) {
      console.error("Failed to cancel order", error);
      toast.error(error?.response?.data?.messages);
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
        return <Badge bg="secondary">Đang chờ xác nhận</Badge>
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
    const renderShipmentStatusBadge = (status) => {
    switch (status) {
        case "PREPARING":
        return <Badge bg="secondary">Chưa gửi</Badge>;
        case "SHIPPED":
        return <Badge bg="warning">Đang vận chuyển</Badge>;
        case "DELIVERED":
        return <Badge bg="success">Đã giao</Badge>;
        case "RETURNED":
        return <Badge bg="danger">Đã trả hàng</Badge>;
        default:
        return <Badge bg="secondary">Không hợp lệ</Badge>;
    }
    };

    const normalize = (str) => str?.toString().trim().replace(/\s+/g, " ").toLowerCase() || "";
    const handleSearch = (e) => {
  const term = normalize(e.target.value);
    setSearchTerm(e.target.value);

    const filtered = orders.filter(order => {
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
      <h3 className="mb-4">Quản lý đơn hàng</h3>
       
       <Form.Control
        type="text" 
        className="form-control mb-3 w-50" 
        placeholder="Tìm kiếm theo mã đơn, người đặt, trạng thái..." 

        value={searchTerm} 
        onChange={handleSearch} 
      />


      <div style={{ maxHeight: "550px", overflowY: "auto" }}>
        <Table  striped bordered hover className="table-dark">
        <thead>
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
              <td>{order.code}</td>
              <td>{order.user?.fullName || order.fullName || "Khách vãng lai"}</td>
              <td>{renderStatusBadge(order.status)}</td>
              <td>{order.total.toLocaleString()} VNĐ</td>
              <td>{new Date(order.placedAt).toLocaleString()}</td>
              <td>
                <Stack direction="horizontal" gap={2} className="justify-content-center">
                  <Button size="sm" variant="primary" onClick={() => handleViewDetails(order)}>Xem chi tiết</Button>
                  {order.status !== "CANCELLED" && (
                    <Button size="sm" variant="danger" onClick={() => handleCancelOrder(order.orderId)}>Hủy đơn</Button>
                  )}
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
      {/* Modal chi tiết đơn hàng */}
      <Modal show={showModal} onHide={handleClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Stack direction="horizontal" gap={3} className="mb-3">
                <div><strong>Mã khách hàng:</strong> {selectedOrder.user?.userId || "-"}</div>
                <div><strong>Mã đơn:</strong> {selectedOrder.code}</div>
                 <div className=" fs-4"><strong>Trạng thái:</strong> {renderStatusBadge(selectedOrder.status)}</div>
              </Stack>
              <p><strong>Người đặt:</strong> {selectedOrder.user?.fullName || selectedOrder.fullName || "Khách vãng lai"}</p>
              <p><strong>Số điện thoại:</strong> {selectedOrder.phone || "-"}</p>
              <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.shippingAddress}</p>
              {selectedOrder.location && (
                <p><strong>Địa chỉ chi tiết:</strong> {selectedOrder.location.province}, {selectedOrder.location.district}, {selectedOrder.location.ward}</p>
              )}

              {/* Cập nhật trạng thái */}
              <div className="mb-3">
                <Stack direction="horizontal" gap={2} className="mt-2">
                  <Button size="sm" variant="info" onClick={() => handleUpdateStatus(selectedOrder.orderId, "CONFIRMED")}>Xác nhận</Button>
                  <Button size="sm" variant="warning" onClick={() => handleUpdateStatus(selectedOrder.orderId, "SHIPPED")}>Đang vận chuyển</Button>
                  <Button size="sm" variant="success" onClick={() => handleUpdateStatus(selectedOrder.orderId, "DELIVERED")}>Đã giao</Button>
                </Stack>
              </div>

              {/* Danh sách sản phẩm */}
              <h5>Sản phẩm</h5>
              <Table striped bordered size="sm" responsive className="text-center">
                <thead className="table-secondary">
                  <tr>
                    <th>Tên SP</th>
                    <th>Màu</th>
                    <th>Size</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map(item => (
                    <tr key={item.orderItemId}>
                      <td>{item.productName}</td>
                      <td>{item.variantColor}</td>
                      <td>{item.variantSize}</td>
                      <td>{item.price.toLocaleString()}₫</td>
                      <td>{item.quantity}</td>
                      <td>{(item.price * item.quantity).toLocaleString()}₫</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Thanh toán */}
              <h5 className="mt-4">Thanh toán</h5>
              <Table striped bordered size="sm" responsive className="text-center">
                <thead className="table-secondary">
                  <tr>
                    <th>Phương thức</th>
                    <th>Trạng thái</th>
                    <th>Số tiền</th>
                    <th>Thời gian thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.payments.map(pay => (
                    <tr key={pay.id}>
                      <td>{pay.method}</td>
                      <td>{pay.status || "Chưa thanh toán"}</td>
                      <td>{pay.amount.toLocaleString()}₫</td>
                      <td>{pay.paidAt ? new Date(pay.paidAt).toLocaleString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Vận chuyển */}
              <h5 className="mt-4">Vận chuyển</h5>
              <Table striped bordered size="sm" responsive className="text-center">
                <thead className="table-secondary">
                  <tr>
                    <th>Nhà vận chuyển</th>
                    <th>Tracking</th>
                    <th>Trạng thái</th>
                    <th>Ngày gửi</th>
                    <th>Ngày giao</th>
                    <th>Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.shipments.map(ship => (
                    <tr key={ship.id}>
                      <td>{ship.carrier}</td>
                      <td>{ship.trackingNumber || "-"}</td>
                      <td>{renderShipmentStatusBadge(ship.status)}</td>
                      <td>{ship.shippedAt ? new Date(ship.shippedAt).toLocaleString() : "-"}</td>
                      <td>{ship.deliveredAt ? new Date(ship.deliveredAt).toLocaleString() : "-"}</td>
                      <td>
                        <Stack direction="horizontal" gap={2} className="justify-content-center">
                          <Button size="sm" variant="warning" onClick={() => handleUpdateShipment(ship.id, "SHIPPED", ship.trackingNumber)}>Đang vận chuyển</Button>
                          <Button size="sm" variant="success" onClick={() => handleUpdateShipment(ship.id, "DELIVERED", ship.trackingNumber)}>Đã giao</Button>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagement;
