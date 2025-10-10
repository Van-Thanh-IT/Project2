import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

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

const TransactionModal = ({ show, onHide, payload, onChange, onSubmit, variants }) => {
  if (!payload) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Nhập/Xuất kho</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/*Chọn biến thể sản phẩm */}
          <Form.Group className="mb-3">
            <Form.Label>Biến thể sản phẩm</Form.Label>
            <Form.Select
              value={payload.variantId || ""}
              onChange={(e) =>
                onChange({ ...payload, variantId: parseInt(e.target.value) })
              }
            >
              <option value="">-- Chọn biến thể --</option>
              {variants.map((v) => (
                <option key={v.variantId} value={v.variantId}>
                  {v.productName} - {v.color}/{v.size}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

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

          <Form.Group className="mb-3">
            <Form.Label>Số lượng</Form.Label>
            <Form.Control
              type="number"
              value={payload.quantity}
              onChange={(e) => onChange({ ...payload, quantity: parseInt(e.target.value) })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Đơn giá</Form.Label>
            <Form.Control
              type="number"
              value={payload.unitCost}
              onChange={(e) => onChange({ ...payload, unitCost: parseFloat(e.target.value) })}
            />
          </Form.Group>

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

          <Form.Group className="mb-3">
            <Form.Label>Tham chiếu (ID đơn hàng, phiếu,...)</Form.Label>
            <Form.Control
              type="number"
              value={payload.referenceId || ""}
              onChange={(e) => onChange({ ...payload, referenceId: parseInt(e.target.value) || null })}
            />
          </Form.Group>

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
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button
          variant="success"
          onClick={onSubmit}
          disabled={!payload.variantId} // Bắt buộc chọn variant
        >
          Thực hiện
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionModal;
