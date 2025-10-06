import React, { useEffect, useState } from "react";
import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllCategories } from "../../../services/HomeService";

const CategoryNavDropdown = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllCategories();
        console.log(res.data);
        // Lọc chỉ danh mục cha (không có parentId)
        const parentCategories = res.data.filter(cat => !cat.parentId);
        console.log(parentCategories);
        setCategories(parentCategories);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <NavDropdown
      title={<span className="fw-bold text-white">Sản phẩm</span>}
      id="basic-nav-dropdown"
    >
      {/* Mục Tất cả sản phẩm */}
      <NavDropdown.Item as={Link} to="/product">
        Tất cả sản phẩm
      </NavDropdown.Item>

      {/* Danh mục cha */}
      {categories.map(cat => (
        <NavDropdown.Item
          key={cat.categoryId}
          as={Link}
          to={`/product/category/${cat.slug}`}
        >
          {cat.categoryName}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};

export default CategoryNavDropdown;
