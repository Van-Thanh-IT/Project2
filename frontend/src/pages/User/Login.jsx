import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/Authentication";
import { getInfo } from "../../services/UserService";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      const token = res?.data?.token;

      if (!token) {
        setError(res?.data?.messages || "Đăng nhập thất bại!");
        return;
      }

      // Lưu token
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("login"));

      // Lấy thông tin user
      const userRes = await getInfo();
      const user = userRes?.data;

      if (!user) {
        setError("Không lấy được thông tin người dùng!");
        return;
      }

      const roles = user.roles.map((r) => r.roleName);
      // Kiểm tra tài khoản bị khóa
      if (roles.includes("USER") && user.active === false) {
        toast.error("TÀI KHOẢN CỦA BẠN ĐÃ BỊ KHÓA!");
        localStorage.removeItem("token"); 
        window.dispatchEvent(new Event("login"));
        return;
      }

      // Điều hướng theo role
      if (roles.includes("ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data.messages);
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center bg-light" style={{ minHeight: "80vh", alignItems: "center" }}>
      <div className="card shadow p-4" style={{ width: 400 }}>
        <h3 className="text-center mb-4">Đăng nhập</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-decoration-none">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
