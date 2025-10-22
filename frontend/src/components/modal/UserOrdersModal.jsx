import React, { useState } from "react";
import { Modal, Table, Button, Badge, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { createReview } from "../../services/ReviewService"; // service đánh giá

const UserOrdersModal = ({ show, handleClose, orders = [] }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewModalOrder, setReviewModalOrder] = useState(null);
  const [reviewData, setReviewData] = useState({});
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

  const handleChangeReview = (itemId, field, value) => {
    setReviewData(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const handleSubmitReview = async (item) => {
    const data = reviewData[item.orderItemId];
    if (!data?.rating) {
      toast.error("Vui lòng chọn số sao!");
      return;
    }

    try {
      const userId = reviewModalOrder?.user?.userId;
      const productId = item?.product?.productId || item?.productId;

      if (!userId || !productId) {
        console.error("Thiếu userId hoặc productId:", { userId, productId });
        toast.error("Không thể gửi đánh giá vì thiếu thông tin sản phẩm hoặc người dùng!");
        return;
      }

      await createReview({
        userId,
        productId,
        rating: parseFloat(data.rating),
        comment: data.comment || ""
      });

      toast.success("Đánh giá thành công!");
      setReviewData(prev => {
        const newData = { ...prev };
        delete newData[item.orderItemId];
        return newData;
      });
      item.reviewed = true;
      setReviewModalOrder({ ...reviewModalOrder });
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      toast.error("Đánh giá thất bại!");
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
                                : p.method === "VNPAY" ?
                                 "Thanh toán Vnpay" 
                                : p.method} 
                                
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
                      <td className="d-flex gap-2 justify-content-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Xem chi tiết
                        </Button>
                        {order.status === "DELIVERED" && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => setReviewModalOrder(order)}
                          >
                            Đánh giá
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={handleClose}>Đóng</Button>
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

      {/* Modal đánh giá đơn hàng */}
      {reviewModalOrder && (
        <Modal
          show={!!reviewModalOrder}
          onHide={() => setReviewModalOrder(null)}
          size="lg"
          centered
          scrollable
        >
          <Modal.Header closeButton className="bg-success text-white">
            <Modal.Title>⭐ Đánh giá đơn: {reviewModalOrder.code}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-light">
            {reviewModalOrder.items?.length > 0 ? (
              <div className="space-y-3">
                {reviewModalOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 mb-3 bg-white rounded shadow-sm border border-light d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3"
                  >
                    {/* Ảnh sản phẩm */}
                    <img
                      src={item.product?.imageUrl || "https://via.placeholder.com/80"}
                      alt={item.productName}
                      width={80}
                      height={80}
                      className="rounded border"
                    />

                    {/* Thông tin + đánh giá */}
                    <div className="flex-grow-1 w-100">
                      <h6 className="fw-bold text-dark">{item.productName}</h6>
                      <p className="mb-1 text-muted small">
                        Màu: {item.variantColor || "—"} | Size: {item.variantSize || "—"}
                      </p>

                      {item.reviewed ? (
                        <div className="text-success fw-semibold mt-2">
                          ✅ Đã đánh giá
                        </div>
                      ) : (
                        <>
                          {/* Chọn sao */}
                          <div className="d-flex align-items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                style={{
                                  fontSize: "1.8rem",
                                  color:
                                    star <= (reviewData[item.orderItemId]?.rating || 0)
                                      ? "#fadb14"
                                      : "#ccc",
                                  cursor: "pointer",
                                  transition: "color 0.2s ease"
                                }}
                                onClick={() =>
                                  handleChangeReview(item.orderItemId, "rating", star)
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>

                          {/* Nhận xét */}
                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                            value={reviewData[item.orderItemId]?.comment || ""}
                            onChange={(e) =>
                              handleChangeReview(item.orderItemId, "comment", e.target.value)
                            }
                            className="mb-2"
                          />

                          <Button
                            size="sm"
                            variant="success"
                            className="mt-1"
                            onClick={() => handleSubmitReview(item)}
                          >
                            Gửi đánh giá
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted">
                Đơn hàng không có sản phẩm để đánh giá
              </p>
            )}
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setReviewModalOrder(null)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default UserOrdersModal;
