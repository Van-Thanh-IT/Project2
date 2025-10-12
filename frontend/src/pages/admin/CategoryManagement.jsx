import React, { useEffect, useState } from "react";
import { Table, Button, Container, Form } from "react-bootstrap";
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
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [form, setForm] = useState({
    categoryName: "",
    parentId: "",
    imageFile: null,
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      
      setCategories(data);
      setFilteredCategories(data);
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
      toast.error(error.response?.data?.messages || "Có lỗi xảy ra khi lưu danh mục!");
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

    const normalize = (str) =>
    str
      .toString()             // đảm bảo là string
      .trim()                 // bỏ khoảng trắng đầu/cuối
      .replace(/\s+/g, " ")   // chuẩn hóa khoảng trắng giữa các từ
      .toLowerCase();         // chuyển về chữ thường

    const handleSearch = (e) => {
      const term = normalize(e.target.value);
      setSearchTerm(e.target.value);

      const filtered = categories.filter((c) => {
        const parentName = c.parentId
          ? categories.find(p => p.categoryId === c.parentId)?.categoryName
          : "Danh mục cha";
        const status = c.isActive ? "hoạt động" : "ẩn";

        return (
          normalize(c.categoryName).includes(term) ||
          normalize(parentName).includes(term) ||
          normalize(status).includes(term)
        );
      });

      setFilteredCategories(filtered);
    };



  return (
    <Container className="mt-4">
      <h2 className="mb-3">Quản lý Danh mục</h2>

      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-50"
        />
        <Button
          variant="success"
          onClick={() => {
            setEditingCategory(null);
            setForm({ categoryName: "", parentId: "", imageFile: null });
            setShowModal(true);
          }}
        >
          Thêm danh mục
        </Button>
      </div>

      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        <Table striped bordered hover className="table-dark">
          <thead>
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
            {filteredCategories.map((c) => (
              <tr key={c.categoryId}>
                <td>{c.categoryId}</td>
                <td>{c.categoryName}</td>
                <td>
                  {c.parentId
                    ? categories.find((p) => p.categoryId === c.parentId)?.categoryName
                    : "Danh mục cha"}
                </td>
                <td>
                  {c.imageUrl && (
                    <img
                      src={c.imageUrl}
                      alt={c.categoryName}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>
                  {c.isActive ? (
                    <span className="badge bg-success">Hoạt động</span>
                  ) : (
                    <span className="badge bg-danger">đã xóa</span>
                  )}
                </td>
                <td>
                  <Button size="sm" variant="primary" className="me-2" onClick={() => handleEdit(c)}>
                    Sửa
                  </Button>
                  <Button size="sm" variant={c.isActive ? "danger" : "success"} onClick={() => handleToggleStatus(c)}>
                    {c.isActive ? "Xóa" : "Khôi phục"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <CategoryModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        form={form}
        handleChange={handleChange}
        editingCategory={editingCategory}
        categories={categories}
      />
    </Container>
  );
};

export default CategoryManagement;
