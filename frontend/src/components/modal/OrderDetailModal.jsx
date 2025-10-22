import React from "react";
import { Modal, Button, Badge, Stack, Row, Col, Card } from "react-bootstrap";

const OrderDetailModal = ({
  show,
  onHide,
  order,
  onUpdateStatus,
  onCancelOrder,
  onUpdateShipment,
}) => {
  if (!order) return null;

  const renderStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge bg="secondary">Đang chờ xác nhận</Badge>;
      case "CONFIRMED":
        return <Badge bg="info">Đã xác nhận</Badge>;
      case "SHIPPED":
        return <Badge bg="warning" text="dark">Đang vận chuyển</Badge>;
      case "DELIVERED":
        return <Badge bg="success">Đã giao</Badge>;
      case "CANCELLED":
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="dark">Không hợp lệ</Badge>;
    }
  };

  const renderShipmentStatusBadge = (status) => {
    switch (status) {
      case "PREPARING":
        return <Badge bg="secondary">Chuẩn bị hàng</Badge>;
      case "SHIPPED":
        return <Badge bg="warning" text="dark">Đang vận chuyển</Badge>;
      case "DELIVERED":
        return <Badge bg="success">Đã giao</Badge>;
      case "RETURNED":
        return <Badge bg="danger">Trả hàng</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Chi tiết đơn hàng #{order.code}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-light">
        {/* Thông tin chung */}
        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Người đặt:</strong> {order.user?.fullName || "Khách vãng lai"}</p>
                <p><strong>Số điện thoại:</strong> {order.phone || "-"}</p>
                <p><strong>Địa chỉ:</strong> {order.shippingAddress}</p>
              </Col>
              <Col md={6}>
                <p><strong>Ngày đặt:</strong> {new Date(order.placedAt).toLocaleString()}</p>
                <p><strong>Tổng tiền:</strong> <span className="text-danger fw-bold">{order.total.toLocaleString()}₫</span></p>
                <p><strong>Trạng thái:</strong> {renderStatusBadge(order.status)}</p>
              </Col>
            </Row>

            <div className="mt-3">
              <Stack direction="horizontal" gap={2}>
                  {order.status === "PENDING" && (
                    <Button size="sm" variant="info" onClick={() => onUpdateStatus(order.orderId, "CONFIRMED")}>
                      Xác nhận
                    </Button>
                  )}
                  {order.status === "CONFIRMED" && (
                    <Button size="sm" variant="warning" onClick={() => onUpdateStatus(order.orderId, "SHIPPED")}>
                      Đang vận chuyển
                    </Button>
                  )}
                  {order.status === "SHIPPED" && (
                    <Button size="sm" variant="success" onClick={() => onUpdateStatus(order.orderId, "DELIVERED")}>
                      Đã giao
                    </Button>
                  )}
                  {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                    <Button size="sm" variant="danger" onClick={() => onCancelOrder(order.orderId)}>
                      Hủy đơn
                    </Button>
                  )}
                </Stack>
            </div>
          </Card.Body>
        </Card>

        {/* Sản phẩm */}
        <h5 className="fw-bold mb-3">🛒 Sản phẩm trong đơn</h5>
        <Row className="g-3">
          {order.items.map((item) => (
            <Col md={6} key={item.orderItemId}>
              <Card className="border-0 shadow-sm rounded">
                <Card.Body>
                  <h6 className="fw-bold mb-2">{item.productName}</h6>
                  <p className="mb-1"><strong>Màu:</strong> {item.variantColor}</p>
                  <p className="mb-1"><strong>Size:</strong> {item.variantSize}</p>
                  <p className="mb-1"><strong>Giá:</strong> {item.price.toLocaleString()}₫</p>
                  <p className="mb-1"><strong>Số lượng:</strong> {item.quantity}</p>
                  <p className="text-danger fw-bold mb-0">
                    Thành tiền: {(item.price * item.quantity).toLocaleString()}₫
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Thanh toán */}
        <h5 className="fw-bold mt-4 mb-3">💳 Thông tin thanh toán</h5>
        <Row className="g-3">
          {order.payments.map((pay) => (
            <Col md={6} key={pay.id}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <p><strong>Phương thức:</strong> {pay.method}</p>
                  <p><strong>Trạng thái:</strong> {pay.status || "Chưa thanh toán"}</p>
                  <p><strong>Số tiền:</strong> {pay.amount.toLocaleString()}₫</p>
                  <p><strong>Thời gian:</strong> {pay.paidAt ? new Date(pay.paidAt).toLocaleString() : "-"}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Vận chuyển */}
        <h5 className="fw-bold mt-4 mb-3">🚚 Vận chuyển</h5>
        <Row className="g-3">
          {order.shipments.map((ship) => (
            <Col md={6} key={ship.id}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <p><strong>Nhà vận chuyển:</strong> {ship.carrier}</p>
                  <p><strong>Mã theo dõi:</strong> {ship.trackingNumber || "-"}</p>
                  <p><strong>Trạng thái:</strong> {renderShipmentStatusBadge(ship.status)}</p>
                  <p><strong>Ngày gửi:</strong> {ship.shippedAt ? new Date(ship.shippedAt).toLocaleString() : "-"}</p>
                  <p><strong>Ngày giao:</strong> {ship.deliveredAt ? new Date(ship.deliveredAt).toLocaleString() : "-"}</p>
                  <Stack direction="horizontal" gap={2}>
                  {ship.status === "SHIPPED"  && (
                     <Button
                      size="sm"
                      variant="warning"
                      onClick={() => onUpdateShipment(ship.id, "SHIPPED", ship.trackingNumber)}
                    >
                      Đang vận chuyển
                    </Button>
                  )}
                  {ship.status === "SHIPPED"  && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => onUpdateShipment(ship.id, "DELIVERED", ship.trackingNumber)}
                    >
                      Đã giao
                    </Button>
                  )}
                   
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailModal;
