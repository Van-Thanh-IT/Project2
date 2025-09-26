import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const CategoryModal = ({ show, onHide, onSubmit, form, handleChange, editingCategory, categories }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton><Modal.Title>{editingCategory ? "Sửa danh mục" : "Thêm danh mục"}</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tên danh mục</Form.Label>
            <Form.Control type="text" name="categoryName" value={form.categoryName} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Danh mục cha</Form.Label>
            <Form.Select name="parentId" value={form.parentId} onChange={handleChange}>
              <option value="">-- Không có --</option>
              {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ảnh (chọn từ máy)</Form.Label>
            {editingCategory && editingCategory.imageUrl && (
              <div className="mb-2">
                <img src={`http://localhost:8080${editingCategory.imageUrl}`} alt={editingCategory.categoryName} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                <p>Ảnh hiện tại. Chọn file mới để thay đổi.</p>
              </div>
            )}
            <Form.Control type="file" name="imageFile" accept="image/*" onChange={handleChange} required={!editingCategory} />
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={onHide}>Hủy</Button>{" "}
            <Button variant="success" type="submit">{editingCategory ? "Cập nhật" : "Thêm"}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CategoryModal;
