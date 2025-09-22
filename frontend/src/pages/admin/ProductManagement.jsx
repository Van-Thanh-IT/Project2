import React, { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { getAllProducts, createProducts, updateProduct, deleteProduct } from "../../services/productService";
import { getAllCategories } from "../../services/CategoryService";
import ProductModal from "../../components/modal/ProductModal";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

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
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
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
      ...formData,
      categoryId: Number(formData.categoryId),
      price: Number(formData.price)
    };
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.productId, formData);
      } else {
        await createProducts(payload);
      }
      fetchProducts();
      handleCloseModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId, { isActive: false });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Quản lý sản phẩm</h2>
      <Button className="mb-3" onClick={() => handleShowModal()}>
        Thêm sản phẩm
      </Button>

      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th style={{ position: "sticky", top: 0, backgroundColor: "#343a40", zIndex: 1 }}>ID</th>
              <th style={{ position: "sticky", top: 0, backgroundColor: "#343a40", zIndex: 1 }}>Tên sản phẩm</th>
              <th style={{ position: "sticky", top: 0, backgroundColor: "#343a40", zIndex: 1 }}>Brand</th>
              <th style={{ position: "sticky", top: 0, backgroundColor: "#343a40", zIndex: 1 }}>Material</th>
              <th style={{ position: "sticky", top: 0, backgroundColor: "#343a40", zIndex: 1 }}>Danh mục</th>
              <th style={{ position: "sticky", top: 0, backgroundColor: "#343a40", zIndex: 1 }}>Price</th>
              <th style={{ position: "sticky", top: 0, backgroundColor: "#343a40", zIndex: 1 }}>Description</th>
              <th style={{ position: "sticky", top: 0, backgroundColor: "#343a40", zIndex: 1 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.productId}>
                <td>{p.productId}</td>
                <td>{p.productName}</td>
                <td>{p.brand}</td>
                <td>{p.material}</td>
                <td>{categories.find((c) => c.categoryId === p.categoryId)?.categoryName || "-"}</td>
                <td>{p.price.toLocaleString()} ₫</td>
                <td>{p.description}</td>
                <td className="d-flex gap-2">
                  <Button size="sm" variant="primary" onClick={() => handleShowModal(p)}>Sửa</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(p.productId)}>Xóa</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <ProductModal
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        editingProduct={editingProduct}
        categories={categories}
      />
    </Container>
  );
}

export default ProductManagement;


            