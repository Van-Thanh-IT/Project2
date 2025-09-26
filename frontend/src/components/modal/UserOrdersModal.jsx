import React from "react";
import { Modal, Table, Button , Badge} from "react-bootstrap";

const UserOrdersModal = ({ show, handleClose, orders }) => {
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
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Đơn hàng của người dùng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {orders.length === 0 ? (
          <p className="text-center">Người dùng chưa có đơn hàng nào.</p>
        ) : (
          <Table striped bordered hover responsive className="text-center">
            <thead className="table-dark">
              <tr>
                <th>Mã đơn</th>
                <th>Trạng thái đơn</th>
                 <th>Trạng thái thanh toán</th>
                <th>Tổng tiền</th>
                <th>Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.code}</td>
                  <td>{renderStatusBadge(order.status)}</td>
                  <td>{order.payments.map(p => p.method)}</td>
                  <td>{order.total.toLocaleString()}VNĐ</td>
                  <td>{new Date(order.placedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserOrdersModal;
