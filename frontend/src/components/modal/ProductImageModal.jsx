import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table, Image, Badge } from "react-bootstrap";
import {
  getProductImages,
  createProductImage,
  updateProductImage,
  deleteProductImage,
} from "../../services/productService";
import { toast } from "react-toastify";

function ProductImageModal({ show, onHide, product }) {
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [isPrimaryAvailable, setIsPrimaryAvailable] = useState(true);
  const [updatedFiles, setUpdatedFiles] = useState({});

  useEffect(() => {
    if (show && product?.productId) loadImages(product.productId);
  }, [show, product]);

  const loadImages = async (productId) => {
    try {
      const res = await getProductImages(productId);
      setImages(res);
      // kiểm tra xem đã có ảnh chính chưa
      const hasPrimary = res.some((img) => img.isPrimary);
      setIsPrimaryAvailable(!hasPrimary);
    } catch (err) {
      console.error("Lỗi load ảnh:", err);
    }
  };

  // === Thêm ảnh mới ===
  const handleAddImage = async (isPrimary = false) => {
    if (!newImage) return alert("Vui lòng chọn ảnh trước!");
    const formData = new FormData();
    formData.append("image", newImage);
    formData.append("isPrimary", isPrimary);
    try {
      await createProductImage(product.productId, formData);
      toast.success("Thêm ảnh thành công!");
      setNewImage(null);
      await loadImages(product.productId);
    } catch (err) {
      const msg = err.response?.data?.messages || err.messages;
      toast.error(msg.includes("Ảnh chính") ? msg : "Lỗi thêm ảnh!");
      console.error("Lỗi thêm ảnh:", err);
    }
  };

  // === Sửa ảnh ===
  const handleUpdateImage = async (imageId, data, isPrimary = false) => {
    if (!data?.file) return alert("Vui lòng chọn file mới!");
    const formData = new FormData();
    formData.append("image", data.file);
    formData.append("isPrimary", isPrimary);
    try {
      await updateProductImage(imageId, formData);
      toast.success("Cập nhật ảnh thành công!");
      await loadImages(product.productId);
      setUpdatedFiles((prev) => ({ ...prev, [imageId]: null }));
    } catch (err) {
      const msg = err.response?.data?.messages || err.messages;
      toast.error(msg.includes("Ảnh chính") ? msg : "Lỗi cập nhật ảnh!");
      console.error("Lỗi update ảnh:", err);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if(!window.confirm("Bạn có chắc chẵn muốn xóa ảnh này không?")) return;
    try {
      await deleteProductImage(imageId);
      await loadImages(product.productId);
    } catch (err) {
      console.error("Lỗi xóa ảnh:", err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Quản lý ảnh - {product?.productName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Thêm ảnh mới */}
        <Form.Group className="mb-3">
          <Form.Label>Chọn ảnh mới</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setNewImage(e.target.files[0])}
          />
        </Form.Group>

        <div className="d-flex gap-2 mb-3">
          <Button
            onClick={() => handleAddImage(false)}
            disabled={!newImage}
            variant="secondary"
          >
            Thêm ảnh phụ
          </Button>
          <Button
            onClick={() => handleAddImage(true)}
            disabled={!newImage || !isPrimaryAvailable}
            variant="success"
          >
            {isPrimaryAvailable ? "Thêm ảnh chính" : "Đã có ảnh chính"}
          </Button>
        </div>

        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Loại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {images.map((img) => (
              <tr key={img.imageId}>
                <td>{img.imageId}</td>
                <td>
                  <Image src={img.imageUrl} thumbnail width={100} />
                </td>
                <td>
                  {img.isPrimary ? (
                    <Badge bg="success">Chính</Badge>
                  ) : (
                    <Badge bg="warning">Phụ</Badge>
                  )}
                </td>
                <td>
                  <Form.Control
                    type="file"
                    className="mb-2"
                    onChange={(e) =>
                      setUpdatedFiles((prev) => ({
                        ...prev,
                        [img.imageId]: {
                          file: e.target.files[0],
                        },
                      }))
                    }
                  />
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() =>
                        handleUpdateImage(
                          img.imageId,
                          updatedFiles[img.imageId],
                          false
                        )
                      }
                      disabled={!updatedFiles[img.imageId]?.file}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="success"
                      disabled={!isPrimaryAvailable || img.isPrimary}
                      onClick={() =>
                        handleUpdateImage(
                          img.imageId,
                          updatedFiles[img.imageId],
                          true
                        )
                      }
                    >
                      {img.isPrimary
                        ? "Là ảnh chính"
                        : isPrimaryAvailable
                        ? "Đặt làm ảnh chính"
                        : "Đã có ảnh chính"}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteImage(img.imageId)}
                    >
                      Xóa
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {images.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center">
                  Chưa có ảnh nào
                </td>
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

export default ProductImageModal;
