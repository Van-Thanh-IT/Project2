import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "admin" hoặc "user"

  if (!token) {
    // Chưa login → chuyển về login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Có quyền hạn nhưng role không được phép → redirect về home
    return <Navigate to="/" replace />;
  }

  // Nếu login và role hợp lệ → render children
  return children;
}

export default ProtectedRoute;
