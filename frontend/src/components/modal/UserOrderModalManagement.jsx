import React, { useState } from "react";
import { Modal, Table, Button, Badge } from "react-bootstrap";

const UserOrderModalManagement = ({ show, handleClose, orders = [] }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const renderStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge bg="secondary">⏳ Đang chờ xác nhận</Badge>;
      case "CONFIRMED":
        return <Badge bg="info">📦 Đã xác nhận</Badge>;
      case "SHIPPED":
        return <Badge bg="warning" text="dark">🚚 Đang vận chuyển</Badge>;
      case "DELIVERED":
        return <Badge bg="success">✅ Đã giao</Badge>;
      case "CANCELLED":
        return <Badge bg="danger">❌ Đã hủy</Badge>;
      default:
        return <Badge bg="dark">Không xác định</Badge>;
    }
  };

  return (
    <>
      {/* Modal danh sách đơn hàng */}
      <Modal show={show} onHide={handleClose} size="xl" centered scrollable>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>🛍️ Đơn hàng</Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-light">
          {!orders || orders.length === 0 ? (
            <div className="text-center text-muted py-4">
              Chưa có đơn hàng nào.
            </div>
          ) : (
            <div className="table-responsive shadow-sm rounded">
              <Table
                hover
                bordered
                className="align-middle text-center table-striped table-bordered mb-0 bg-white rounded"
              >
                <thead className="table-primary text-uppercase">
                  <tr>
                    <th>Mã đơn</th>
                    <th>Trạng thái</th>
                    <th>Thanh toán</th>
                    <th>Tổng tiền</th>
                    <th>Ngày đặt</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="fw-bold">{order.code}</td>
                      <td>{renderStatusBadge(order.status)}</td>
                      <td>
                        {order.payments?.length > 0 ? (
                          order.payments.map((p, i) => (
                            <div key={i}>
                              💳 {p.method === "CREDIT_CARD"
                                ? "Thẻ tín dụng"
                                : p.method === "COD"
                                ? "Thanh toán khi nhận hàng"
                                : p.method === "CASH"
                                ? "Tiền mặt"
                                : p.method}{" "}
                              ({p.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"})
                            </div>
                          ))
                        ) : (
                          "Không có thông tin"
                        )}
                      </td>
                      <td className="text-danger fw-bold">
                        {order.total?.toLocaleString()} ₫
                      </td>
                      <td>{order.placedAt ? new Date(order.placedAt).toLocaleString() : "Không rõ"}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Xem chi tiết
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <Modal
          show={!!selectedOrder}
          onHide={() => setSelectedOrder(null)}
          size="lg"
          centered
          scrollable
        >
          <Modal.Header closeButton className="bg-warning text-white">
            <Modal.Title>📦 Chi tiết đơn: {selectedOrder.code}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder.fullName && (
              <>
                <h6 className="text-primary mb-3">Thông tin người đặt</h6>
                <p><strong>Họ tên:</strong> {selectedOrder.fullName}</p>
              </>
            )}
            {selectedOrder.user?.email && <p><strong>Email:</strong> {selectedOrder.user.email}</p>}
            {selectedOrder.phone && <p><strong>SĐT:</strong> {selectedOrder.phone}</p>}

            {(selectedOrder.shippingAddress || selectedOrder.location) && (
              <>
                <h6 className="text-primary mt-4 mb-3">Giao hàng</h6>
                {selectedOrder.shippingAddress && <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}</p>}
                {selectedOrder.location && (
                  <p>
                    <strong>Khu vực:</strong> {selectedOrder.location.ward}, {selectedOrder.location.district}, {selectedOrder.location.province}
                  </p>
                )}
              </>
            )}

            {selectedOrder.shipments?.[0] && (
              <p>
                <strong>Đơn vị vận chuyển:</strong> {selectedOrder.shipments[0].carrier || "-"} ({selectedOrder.shipments[0].trackingNumber || "-"})<br/>
                <strong>Trạng thái vận chuyển:</strong> {selectedOrder.shipments[0].status || "Chưa cập nhật"}
              </p>
            )}

            {selectedOrder.items?.length > 0 && (
              <>
                <h6 className="text-primary mt-4 mb-3">Sản phẩm</h6>
                <Table bordered hover responsive>
                  <thead className="table-light">
                    <tr>
                      <th>Tên sản phẩm</th>
                      <th>Màu</th>
                      <th>Kích thước</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.productName}</td>
                        <td>{item.variantColor}</td>
                        <td>{item.variantSize}</td>
                        <td>{item.price.toLocaleString()} ₫</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}

            {selectedOrder.shippingFee && (
              <h6 className="text-end mt-4"><strong>Phí ship:</strong> {selectedOrder.shippingFee.toLocaleString()} ₫</h6>
            )}
            {selectedOrder.total && (
              <h5 className="text-end text-danger"><strong>Tổng cộng:</strong> {selectedOrder.total.toLocaleString()} ₫</h5>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedOrder(null)}>Đóng</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default UserOrderModalManagement;
