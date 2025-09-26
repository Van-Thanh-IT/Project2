import React, { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { getAllProducts, createProduct, updateProduct, softDeleteProduct } from "../../services/productService";
import { getAllCategories } from "../../services/CategoryService";
import ProductModal from "../../components/modal/ProductModal";
import ProductImageModal from "../../components/modal/ProductImageModal";
import ProductVariantModal from "../../components/modal/ProductVariantModal";
import { toast } from "react-toastify";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    material: "",
    brand: "",
    description: "",
    categoryId: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const product = await getAllProducts();
      setProducts(product.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải sản phẩm!");
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh mục!");
    }
  };

  const handleShowModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      setFormData({
        productName: product.productName,
        price: product.price,
        material: product.material,
        brand: product.brand,
        description: product.description,
        categoryId: product.categoryId || "",
      });
    } else {
      setFormData({
        productName: "",
        price: "",
        material: "",
        brand: "",
        description: "",
        categoryId: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      productName: formData.productName,
      price: Number(formData.price),
      material: formData.material,
      brand: formData.brand,
      description: formData.description,
      categoryId: Number(formData.categoryId),
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.productId, payload);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await createProduct(payload);
        toast.success("Thêm sản phẩm thành công!");
      }
      fetchProducts();
      handleCloseModal();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.messages);
    }
  };

  const handleDelete = async (productId, isActive) => {
    try {
      const body = isActive ? false : true;
      await softDeleteProduct(productId, { isActive: body });
      toast.success(isActive ? "Xóa sản phẩm thành công!" : "Khôi phục sản phẩm thành công!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật trạng thái sản phẩm!");
    }
  };

  const handleShowImageModal = (product) => { setSelectedProduct(product); setShowImageModal(true); };
  const handleCloseImageModal = () => { setShowImageModal(false); setSelectedProduct(null); };
  const handleShowVariantModal = (product) => { setSelectedProduct(product); setShowVariantModal(true); };
  const handleCloseVariantModal = () => { setShowVariantModal(false); setSelectedProduct(null); };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Quản lý sản phẩm</h2>
      <Button className="mb-3" onClick={() => handleShowModal()}>Thêm sản phẩm</Button>

      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        <Table striped bordered hover  className="table-dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Thương hiệu</th>
              <th>Chất liệu</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
             <th style={{ width: "220px" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.productId}>
                <td>{p.productId}</td>
                <td>{p.productName}</td>
                <td>{p.brand}</td>
                <td>{p.material}</td>
                <td>{categories.find((c) => Number(c.categoryId) === Number(p.categoryId))?.categoryName || "-"}</td>
                <td>{p.price.toLocaleString()} VNĐ</td>
                <td>{p.description}</td>
                <td>{p.isActive ? <span className="badge bg-success">Hoạt động</span> : <span className="badge bg-secondary">Đã xóa</span>}</td>
                <td className="d-flex gap-2">
                  <Button size="sm" variant="primary" onClick={() => handleShowModal(p)}>Sửa</Button>
                  <Button size="sm" variant="warning" onClick={() => handleShowImageModal(p)}>Ảnh</Button>
                  <Button size="sm" variant={p.isActive ? "danger" : "success"} onClick={() => handleDelete(p.productId, p.isActive)}>
                    {p.isActive ? "Xóa" : "Khôi phục"}
                  </Button>
                  <Button size="sm" variant="info" onClick={() => handleShowVariantModal(p)}>Biến thể</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* modal product */}
      <ProductModal show={showModal} onHide={handleCloseModal} onSubmit={handleSubmit} formData={formData} handleChange={handleChange} editingProduct={editingProduct} categories={categories} />
      {/* modal product image */}
      <ProductImageModal show={showImageModal} onHide={handleCloseImageModal} product={selectedProduct} />
      {/* modal product variant */}
      <ProductVariantModal show={showVariantModal} onHide={handleCloseVariantModal} product={selectedProduct} />
    </Container>
  );
}

export default ProductManagement;
