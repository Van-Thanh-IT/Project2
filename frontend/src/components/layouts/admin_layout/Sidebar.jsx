import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hàm check active link
  const isActive = (path) => location.pathname === path;

  // Hàm đăng xuất
  const handleLogout = () => {
   if(!window.confirm("Bạn có muốn đăng xuất không?")){
      return;
   }
    localStorage.removeItem("token"); // Xóa token
    navigate("/"); 
    
  };

  return (
    <div
      className="d-flex flex-column bg-dark text-white p-3"
      style={{ width: "200px", minHeight: "100vh" }}
    >
      <h4 className="text-center mb-4">Admin</h4>
      <ul className="nav nav-pills flex-column gap-2">
        <li className="nav-item">
          <Link
            to="/admin/dashboard"
            className={`nav-link ${isActive("/admin/dashboard") ? "active" : "text-white"}`}
          >
            Trang chủ
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/admin/products"
            className={`nav-link ${isActive("/admin/products") ? "active" : "text-white"}`}
          >
            Quản lý sản phẩm
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/admin/category"
            className={`nav-link ${isActive("/admin/category") ? "active" : "text-white"}`}
          >
            Quản lý Danh mục
          </Link>
        </li>
        <li className="nav-item">
          <button
            onClick={handleLogout}
            className="nav-link btn btn-link text-white text-start p-0"
            style={{ textDecoration: "none" }}
          >
            Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
