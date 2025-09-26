import React, { useEffect, useState } from "react";
import { Table, Button, Container} from "react-bootstrap";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
} from "../../services/CategoryService";
import CategoryModal from "../../components/modal/CategoryModal";
import { toast } from "react-toastify";
import "../../styles/global.scss";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    categoryName: "",
    parentId: "",
    imageFile: null,
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Không thể tải danh mục!");
      console.error("Lỗi load categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setForm({ ...form, imageFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("categoryName", form.categoryName);
    formData.append("parentId", form.parentId ? Number(form.parentId) : "");
    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.categoryId, formData);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await createCategory(formData);
        toast.success("Thêm danh mục thành công!");
      }

      setForm({ categoryName: "", parentId: "", imageFile: null });
      setEditingCategory(null);
      setShowModal(false);
      await loadCategories();
    } catch (error) {
      console.error("Lỗi khi submit:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu danh mục!");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setForm({
      categoryName: category.categoryName,
      parentId: category.parentId || "",
      imageFile: null,
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (category) => {
    try {
      const res = await toggleCategoryStatus(category.categoryId, { isActive: !category.isActive });
      toast.success(res.messages);
     
      await loadCategories();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.messages);
    }
  };
  return (
   <Container className="mt-4">
      <h2 className="mb-3">Quản lý Danh mục</h2>
      <Button variant="success" className="mb-3" onClick={() => { setEditingCategory(null); setForm({ categoryName: "", parentId: "", imageFile: null }); setShowModal(true); }}>Thêm danh mục</Button>
      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        <Table striped bordered hover className="table-dark">
          <thead >
            <tr>
              <th>ID</th>
              <th>Tên danh mục</th>
              <th>Danh mục cha & con</th>
              <th>Ảnh</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.categoryId}>
                <td>{c.categoryId}</td>
                <td>{c.categoryName}</td>
                <td>{c.parentId ? categories.find(p => p.categoryId === c.parentId)?.categoryName : "Danh mục cha"}</td>
                <td>{c.imageUrl && <img src={`http://localhost:8080${c.imageUrl}`} alt={c.categoryName} style={{ width: "50px", height: "50px", objectFit: "cover" }} />}</td>
                <td>{c.isActive ? <span className="badge bg-success">Hoạt động</span> : <span className="badge bg-secondary">Ẩn</span>}</td>
                <td>
                  <Button size="sm" variant="primary" className="me-2" onClick={() => handleEdit(c)}>Sửa</Button>
                  <Button size="sm" variant={c.isActive ? "warning" : "success"} onClick={() => handleToggleStatus(c)}>{c.isActive ? "Ẩn" : "Hiện"}</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <CategoryModal show={showModal} onHide={() => setShowModal(false)} onSubmit={handleSubmit} form={form} handleChange={handleChange} editingCategory={editingCategory} categories={categories} />
    </Container>
  );
};

export default CategoryManagement;
