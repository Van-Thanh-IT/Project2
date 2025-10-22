import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import {
  getProductVariants,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "../../services/productService";
import { toast } from "react-toastify";

function ProductVariantModal({ show, onHide, product }) {
  const [variants, setVariants] = useState([]);
  const [formData, setFormData] = useState({ size: "", color: "", price: "", weight: "" });
  const [editingVariant, setEditingVariant] = useState(null);

  useEffect(() => {
    if (show && product?.productId) loadVariants(product.productId);
  }, [show, product]);

  const loadVariants = async (productId) => {
    try {
      const res = await getProductVariants(productId);
      setVariants(res.data || []);
    } catch (err) {
      console.error("Lỗi load variant:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
  if (!formData.size || !formData.color || !formData.price || !formData.weight) {
    toast.warning("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const payload = {
    ...formData,
    price: Number(formData.price),
    weight: Number(formData.weight),
  };

  if (editingVariant) {
    try {
      const res = await updateProductVariant(editingVariant.variantId, payload);
      toast.success(res?.data?.messages || "Cập nhật biến thể thành công!");
      setEditingVariant(null);
      setFormData({ size: "", color: "", price: "", weight: "" });
      await loadVariants(product.productId); 
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.messages || "Cập nhật thất bại!");
    }
  } else {
    try {
      const res = await createProductVariant(product.productId, payload);
      toast.success(res?.messages || "Thêm biến thể thành công!");
      setFormData({ size: "", color: "", price: "", weight: "" });
      setEditingVariant(null);
      await loadVariants(product.productId);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.messages || "Thêm biến thể thất bại!");
    }
  }
};

  const handleEdit = (variant) => {
    setEditingVariant(variant);
    setFormData({
      size: variant.size,
      color: variant.color,
      price: variant.price,
      weight: variant.weight,
    });
  };

  const handleDelete = async (variantId, isActive) => {
    const exits = isActive ? "Xóa mềm biến thể sản phẩm thành công!" :"Khôi phục biến thể thành công!";
    try {
    await deleteProductVariant(variantId,!isActive);
    toast.success(exits);
    await loadVariants(product.productId);
  } catch (err) {
    console.error(err);
  }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Quản lý biến thể - {product?.productName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mb-3 d-flex gap-2 flex-wrap">
          <Form.Control
            placeholder="Kích thước"
            name="size"
            value={formData.size}
            onChange={handleChange}
            style={{ width: "300px" }}
          />
          <Form.Control
            placeholder="Màu"
            name="color"
            value={formData.color}
            onChange={handleChange}
            style={{ width: "120px" }}
          />
          <Form.Control
            placeholder="Giá"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            style={{ width: "120px" }}
          />
          <Form.Control
            placeholder="Cân nặng"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            style={{ width: "120px" }}
          />
          <Button onClick={handleSubmit}>
            {editingVariant ? "Cập nhật" : "Thêm"}
          </Button>
        </Form>

        <Table bordered hover className="text-center">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Kích thước</th>
              <th>Màu</th>
              <th>Giá</th>
              <th>Cân nặng</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.variantId}>
                <td>{v.variantId}</td>
                <td>{v.size}</td>
                <td>{v.color}</td>
                <td>{v.price.toLocaleString()} VNĐ</td>
                <td>{v.weight} kg</td>
                <td>{v.isActive ? (<p>Hoạt động</p>) : (<p>Đã xóa mềm</p>)}</td>
                <td className="d-flex gap-2 justify-content-center">
                  <Button size="sm" variant="primary" onClick={() => handleEdit(v)}>
                    Sửa
                  </Button>
                  <Button size="sm" variant={v.isActive ? "danger" : "success"} onClick={() => handleDelete(v.variantId, v.isActive)}>
                     {v.isActive ? "Xóa" : "Khôi phục"}
                  </Button>
                </td>
              </tr>
            ))}
            {variants.length === 0 && (
              <tr>
                <td colSpan={6}>Chưa có biến thể</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductVariantModal;
