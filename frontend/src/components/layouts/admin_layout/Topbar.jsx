import React, { useState, useEffect } from "react";
import { getInfo } from "../../../services/UserService";

const Topbar = () => {
  const [user, setUser] = useState(null); 
  const [message, setMessage] = useState(""); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getInfo();
        const roles = res.data.roles.map(r => r.roleName);

        // Kiểm tra quyền ADMIN
        if (roles.includes("ADMIN")) {
          setUser(res.data);
          setMessage("");
        } else {
          setUser(null);
          setMessage("Bạn không có quyền truy cập trang này!");
        }
      } catch (error) {
        setMessage("Lỗi khi lấy thông tin người dùng!");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <nav className="navbar navbar-light border-bottom shadow-sm px-4" style={{ height: "60px" }}>
        <div>Loading...</div>
      </nav>
    );
  }
  return (
    <nav className="navbar navbar-light border-bottom shadow-sm px-4" style={{ height: "60px" }}>
      {message && <h1 className="bg-danger text-white text-center mb-2">{message}</h1>}
      <div className="container-fluid justify-content-end">
        <div className="d-flex align-items-center">
          {user && <span className="me-2 fw-semibold">Xin chào: {user.fullName}</span>}
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
