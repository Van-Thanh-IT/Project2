import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table, Image } from "react-bootstrap";
import { getProductImages, createProductImage, updateProductImage, deleteProductImage } from "../../services/productService";

function ProductImageModal({ show, onHide, product }) {
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [newImageType, setNewImageType] = useState(false);
  const [updatedFiles, setUpdatedFiles] = useState({});

  useEffect(() => { if (show && product?.productId) loadImages(product.productId); }, [show, product]);

  const loadImages = async (productId) => {
    try { const res = await getProductImages(productId); setImages(res); } 
    catch (err) { console.error("Lỗi load ảnh:", err); }
  };

  const handleAddImage = async () => {
    if (!newImage) return;
    const formData = new FormData();
    formData.append("image", newImage);
    formData.append("isPrimary", newImageType);
    try { await createProductImage(product.productId, formData); setNewImage(null); setNewImageType(false); await loadImages(product.productId); }
    catch (err) { console.error("Lỗi thêm ảnh:", err); }
  };

  const handleUpdateImage = async (imageId, data) => {
    if (!data?.file) return;
    const formData = new FormData();
    formData.append("image", data.file);
    formData.append("isPrimary", data.isPrimary);
    try { await updateProductImage(imageId, formData); await loadImages(product.productId); setUpdatedFiles(prev => ({ ...prev, [imageId]: null })); }
    catch (err) { console.error("Lỗi update ảnh:", err); }
  };

  const handleDeleteImage = async (imageId) => { try { await deleteProductImage(imageId); await loadImages(product.productId); } catch (err) { console.error("Lỗi xóa ảnh:", err); } };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton><Modal.Title>Quản lý ảnh - {product?.productName}</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3"><Form.Label>Chọn ảnh mới</Form.Label><Form.Control type="file" onChange={e => setNewImage(e.target.files[0])} /></Form.Group>
        <Form.Group className="mb-3"><Form.Label>Loại ảnh</Form.Label>
          <Form.Select value={newImageType ? "true" : "false"} onChange={e => setNewImageType(e.target.value === "true")}>
            <option value="true">Chính</option><option value="false">Phụ</option>
          </Form.Select>
        </Form.Group>
        <Button className="mb-3" onClick={handleAddImage} disabled={!newImage}>Thêm ảnh</Button>
        <Table bordered hover >
          <thead><tr><th>ID</th><th>Ảnh</th><th>Chính / Phụ</th><th>Hành động</th></tr></thead>
          <tbody>
            {images.map(img => (
              <tr key={img.imageId}>
                <td>{img.imageId}</td>
                <td><Image src={img.imageUrl} thumbnail width={100} /></td>
                <td>{img.isPrimary ? <span className="badge bg-success">Chính</span> : <span className="badge bg-warning">Phụ</span>}</td>
                <td>
                  <Form.Control type="file" onChange={e => setUpdatedFiles(prev => ({ ...prev, [img.imageId]: { file: e.target.files[0], isPrimary: prev[img.imageId]?.isPrimary ?? img.isPrimary } }))} />
                  <Form.Select className="mt-2" value={updatedFiles[img.imageId]?.isPrimary ? "true" : "false"} onChange={e => setUpdatedFiles(prev => ({ ...prev, [img.imageId]: { file: prev[img.imageId]?.file ?? null, isPrimary: e.target.value === "true" } }))}>
                    <option value="true">Chính</option><option value="false">Phụ</option>
                  </Form.Select>
                  <Button size="sm" variant="warning" className="mt-2 me-2" onClick={() => handleUpdateImage(img.imageId, updatedFiles[img.imageId])} disabled={!updatedFiles[img.imageId]?.file}>Sửa</Button>
                  <Button size="sm" variant="danger" className="mt-2" onClick={() => handleDeleteImage(img.imageId)}>Xóa</Button>
                </td>
              </tr>
            ))}
            {images.length === 0 && <tr><td colSpan={4} className="text-center">Chưa có ảnh nào</td></tr>}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer><Button variant="secondary" onClick={onHide}>Đóng</Button></Modal.Footer>
    </Modal>
  );
}

export default ProductImageModal;
