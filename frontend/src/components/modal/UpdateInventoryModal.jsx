import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const UpdateInventoryModal = ({ show, onHide, inventory, onSubmit, onChange }) => {
  if (!inventory) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật tồn kho</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Số lượng</Form.Label>
            <Form.Control
              type="number"
              value={inventory.quantity}
              onChange={(e) => onChange({ ...inventory, quantity: parseInt(e.target.value) })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Safety Stock</Form.Label>
            <Form.Control
              type="number"
              value={inventory.safetyStock}
              onChange={(e) => onChange({ ...inventory, safetyStock: parseInt(e.target.value) })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateInventoryModal;
