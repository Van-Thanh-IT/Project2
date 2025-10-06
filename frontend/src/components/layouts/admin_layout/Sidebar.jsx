import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaListAlt,
  FaUsers,
  FaShoppingCart,
  FaMoneyCheckAlt,
  FaStar,
  FaWarehouse,
  FaChartBar,
  FaSignOutAlt
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (!window.confirm("Bạn có muốn đăng xuất không?")) return;
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { name: "Trang chủ", path: "/admin/dashboard", icon: <FaHome /> },
    { name: "Quản lý sản phẩm", path: "/admin/products", icon: <FaBoxOpen /> },
    { name: "Quản lý Danh mục", path: "/admin/category", icon: <FaListAlt /> },
    { name: "Quản lý người dùng", path: "/admin/user", icon: <FaUsers /> },
    { name: "Quản lý đơn hàng", path: "/admin/order", icon: <FaShoppingCart /> },
    { name: "Quản lý Thanh toán", path: "/admin/payment", icon: <FaMoneyCheckAlt /> },
    { name: "Quản lý đánh giá", path: "/admin/review", icon: <FaStar /> },
    { name: "Quản lý kho hàng", path: "/admin/inventory", icon: <FaWarehouse /> },
    { name: "Báo cáo & thống kê", path: "/admin/report_statistics", icon: <FaChartBar /> },
  ];

  return (
    <div className="d-flex flex-column bg-dark text-white p-3" style={{ width: 250, minHeight: "100vh" }}>
     <div
      className="d-flex flex-column bg-dark text-white p-3"
      style={{
        width: 250,
        height: "100vh", 
        position: "fixed",  
        top: 0,           
        left: 0, 
        overflowY: "auto"
        }}>
      <h4 className="text-center mb-4">Admin</h4>
      <ul className="nav nav-pills flex-column gap-2">
        {menuItems.map((item, index) => (
          <li className="nav-item" key={index}>
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center gap-2 ${
                isActive(item.path) ? "active" : "text-white"
              }`}
            >
              {item.icon} <span>{item.name}</span>
            </Link>
          </li>
        ))}
        <li className="nav-item mt-2">
          <button
            onClick={handleLogout}
            className="nav-link btn btn-link text-white text-start d-flex align-items-center gap-2 p-0 ms-3"
            style={{ textDecoration: "none" }}
          >
            <FaSignOutAlt /> <span>Đăng xuất</span>
          </button>
        </li>
      </ul>
    </div>

    </div>
  );
};

export default Sidebar;
