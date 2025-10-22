import React from "react";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import Select from "react-select";

const transactionTypeVN = {
  IMPORT: "Nhập",
  EXPORT: "Xuất",
};

const transactionSourceVN = {
  PURCHASE: "Mua hàng",
  SALE: "Bán hàng",
  RETURN: "Trả hàng",
  ADJUSTMENT: "Điều chỉnh",
};

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

const TransactionModal = ({ show, onHide, payload, onChange, onSubmit, variants, orders }) => {
  if (!payload) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Nhập/Xuất kho</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Biến thể sản phẩm */}
          <Form.Group className="mb-3">
            <Form.Label>Biến thể sản phẩm</Form.Label>
            <Select
              options={variants.map(v => ({
                value: v.variantId,
                label: `${v.productName} - ${v.color}/${v.size}`,
              }))}
              value={
                payload.variantId
                  ? {
                      value: payload.variantId,
                      label: `${variants.find(v => v.variantId === payload.variantId)?.productName} - ${variants.find(v => v.variantId === payload.variantId)?.color}/${variants.find(v => v.variantId === payload.variantId)?.size}`
                    }
                  : null
              }
              onChange={(selected) =>
                onChange({ ...payload, variantId: selected ? selected.value : null })
              }
              placeholder="Tìm kiếm và chọn biến thể..."
              isClearable
            />
          </Form.Group>

          {/* Loại giao dịch */}
          <Form.Group className="mb-3">
            <Form.Label>Loại giao dịch</Form.Label>
            <Form.Select
              value={payload.transactionType}
              onChange={(e) => onChange({ ...payload, transactionType: e.target.value })}
            >
              {Object.entries(transactionTypeVN).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Số lượng */}
          <Form.Group className="mb-3">
            <Form.Label>Số lượng</Form.Label>
            <Form.Control
              type="number"
              value={payload.quantity}
              onChange={(e) => onChange({ ...payload, quantity: parseInt(e.target.value) })}
            />
          </Form.Group>

          {/* Đơn giá */}
          <Form.Group className="mb-3">
            <Form.Label>Đơn giá</Form.Label>
            <Form.Control
              type="number"
              value={payload.unitCost}
              onChange={(e) => onChange({ ...payload, unitCost: parseFloat(e.target.value) })}
            />
          </Form.Group>

          {/* Nguồn giao dịch */}
          <Form.Group className="mb-3">
            <Form.Label>Nguồn giao dịch</Form.Label>
            <Form.Select
              value={payload.transactionSource}
              onChange={(e) => onChange({ ...payload, transactionSource: e.target.value })}
            >
              {Object.entries(transactionSourceVN).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Tham chiếu đơn hàng */}
          <Form.Group className="mb-3">
            <Form.Label>Tham chiếu (ID đơn hàng)</Form.Label>
            <Select
              options={orders.map(o => ({
                value: o.orderId,
                label: (
                  <div className="d-flex align-items-center justify-content-between">
                    <span>
                      Mã: {o.orderId} - khách hàng: {o.fullName}
                    </span>
                    <span>{renderStatusBadge(o.status)}</span>
                  </div>
                )
              }))}
              value={
                payload.referenceId
                  ? {
                      value: payload.referenceId,
                      label: (
                        <div className="d-flex align-items-center justify-content-between">
                          <span>
                            Mã: {payload.referenceId} - Khách hàng: {orders.find(o => o.orderId === payload.referenceId)?.fullName}
                          </span>
                          <span>
                            {renderStatusBadge(orders.find(o => o.orderId === payload.referenceId)?.status)}
                          </span>
                        </div>
                      )
                    }
                  : null
              }
              onChange={(selected) =>
                onChange({ ...payload, referenceId: selected ? selected.value : null })
              }
              placeholder="Tìm kiếm và chọn đơn..."
              isClearable
            />
          </Form.Group>


          {/* Ghi chú */}
          <Form.Group className="mb-3">
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control
              type="text"
              value={payload.note}
              onChange={(e) => onChange({ ...payload, note: e.target.value })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Hủy</Button>
        <Button
          variant="success"
          onClick={onSubmit}
          disabled={!payload.variantId} // bắt buộc chọn biến thể
        >
          Thực hiện
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionModal;
