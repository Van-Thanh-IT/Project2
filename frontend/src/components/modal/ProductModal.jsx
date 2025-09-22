import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ProductModal = ({
  show,
  onHide,
  onSubmit,
  formData,
  handleChange,
  editingProduct,
  categories, // danh mục truyền từ parent
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Tên sản phẩm</Form.Label>
            <Form.Control
              name="productName"
              value={formData.productName}
              onChange={handleChange}
            />
          </Form.Group>

         <Form.Group className="mb-2">
            <Form.Label>Danh mục</Form.Label>
            <Form.Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
            >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                </option>
                ))}
            </Form.Select>
        </Form.Group>


          <Form.Group className="mb-2">
            <Form.Label>Brand</Form.Label>
            <Form.Control name="brand" value={formData.brand} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Material</Form.Label>
            <Form.Control name="material" value={formData.material} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="success" onClick={onSubmit}>
          {editingProduct ? "Cập nhật" : "Tạo"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
