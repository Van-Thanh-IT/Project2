import React, { useEffect, useState } from "react";
import { Table, Button, Container, Form } from "react-bootstrap";
import { getAllProducts, createProduct, updateProduct, softDeleteProduct } from "../../services/productService";
import { getAllCategories } from "../../services/CategoryService";
import ProductModal from "../../components/modal/ProductModal";
import ProductImageModal from "../../components/modal/ProductImageModal";
import ProductVariantModal from "../../components/modal/ProductVariantModal";
import { toast } from "react-toastify";
import ProductDetailModal from "../../components/modal/ProductDetailModal";

function ProductManagement() {

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
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
      setFilteredProducts(product.data);
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

    // hàm xử lý
  const handleShowDetail = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedProduct(null);
    setShowDetailModal(false);
  };

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
    if(!window.confirm("Bạn có chắc chẵn muốn xóa không?")) return;
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
  

  const normalize = (str) =>
  str?.toString().trim().replace(/\s+/g, " ").toLowerCase();

  const handleSearch = (e) => {
    const term = normalize(e.target.value);
    setSearchTerm(e.target.value);

    const filtered = products.filter((p) => {
      const categoryName = categories.find(c => Number(c.categoryId) === Number(p.categoryId))?.categoryName || "";
      return (
        normalize(p.productName).includes(term) ||
        normalize(p.brand).includes(term) ||
        normalize(p.material).includes(term) ||
        normalize(categoryName).includes(term)
      );
    });

    setFilteredProducts(filtered);
  };
  return (
    <Container className="">
      <h2 className="mb-4 page-title">Quản lý sản phẩm</h2>
      <div className="d-flex justify-content-between">
        <Form.Control
          type="text"
          className="form-control mb-3 w-50"
          placeholder="Tìm kiếm theo tên, thương hiệu, chất liệu, danh mục..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <Button className="mb-3" onClick={() => handleShowModal()}>Thêm sản phẩm</Button>
      </div>
 

      <div style={{ maxHeight: "600px", overflowY: "auto" }}>
        <Table striped bordered hover className=" align-middle">
          <thead className="table-primary" >
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Trạng thái</th>
              <th style={{ width: "240px" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.productId}>
                <td>{p.productId}</td>
                <td>{p.productName}</td>
                <td>
                  {categories.find((c) => Number(c.categoryId) === Number(p.categoryId))?.categoryName || "-"}
                </td>
                <td>{p.price.toLocaleString()} VNĐ</td>
                <td>
                  {p.isActive ? (
                    <span className="badge bg-success">Hoạt động</span>
                  ) : (
                    <span className="badge bg-secondary">Đã xóa</span>
                  )}
                </td>
              <td className="d-flex flex-wrap gap-2 justify-content-between">
                <Button size="sm" className="flex-fill" variant="info" onClick={() => handleShowDetail(p)}>👁 Xem chi tiết</Button>
                <Button size="sm" className="flex-fill" variant="primary" onClick={() => handleShowModal(p)}>✏ Sửa</Button>
                <Button size="sm" className="flex-fill" variant="warning" onClick={() => handleShowImageModal(p)}>Ảnh</Button>
                <Button size="sm" className="flex-fill" variant={p.isActive ? "danger" : "success"} onClick={() => handleDelete(p.productId, p.isActive)}>
                  {p.isActive ? "Xóa" : "Khôi phục"}
                </Button>
                <Button size="sm" className="flex-fill" variant="secondary" onClick={() => handleShowVariantModal(p)}>Biến thể</Button>
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
      
      <ProductDetailModal show={showDetailModal} onHide={handleCloseDetailModal} product={selectedProduct}/>

    </Container>
  );
}

export default ProductManagement;
