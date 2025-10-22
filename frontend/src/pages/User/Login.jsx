import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  login,
  loginWithGoogle,
  loginWithFacebook,
} from "../../services/Authentication";
import { getInfo } from "../../services/UserService";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import ForgotPasswordModal from "../../components/modal/ForgotPasswordModal";
import { Button } from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLoginSuccess = async (token) => {
    try {
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("login"));

      const userRes = await getInfo();

      const user = userRes?.data;
      if (!user) {
        toast.error("Không lấy được thông tin người dùng!");
        return;
      }

      const roles = user.roles.map((r) => r.roleName);
      if (roles.includes("USER") && user.active === false) {
        toast.error("TÀI KHOẢN CỦA BẠN ĐÃ BỊ KHÓA!");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("login"));
        return;
      }

      if (roles.includes("ADMIN")) navigate("/admin");
      else navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi khi lấy thông tin người dùng!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      const token = res?.data?.token;
      if (!token) {
        setError(res?.messages || "Đăng nhập thất bại!");
        return;
      }
      await handleLoginSuccess(token);
      toast.success("Đăng nhập thành công!");
    } catch (err) {
      setError(err.response?.data?.messages || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const res = await loginWithGoogle(idToken);
      const token = res?.data?.token;

      if (!token) {
        toast.error("Đăng nhập Google thất bại!");
        return;
      }
      await handleLoginSuccess(token);
    } catch (err) {
      console.error(err);
      toast.error("Đăng nhập Google thất bại!");
    }
  };

  const handleGoogleError = () =>
    toast.error("Không thể đăng nhập bằng Google!");

  const handleFacebookResponse = async (response) => {
    console.log("Facebook Response:", response);

    try {
      const res = await loginWithFacebook(response.accessToken);
      const token = res?.data?.token;

      if (!token) {
        toast.error("Đăng nhập Facebook thất bại!");
        return;
      }
      await handleLoginSuccess(token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow-lg p-5"
        style={{ maxWidth: 450, width: "100%" }}
      >
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

          <div className="d-flex justify-content-between mb-3">
            <Button variant="link" onClick={() => setShowForgotModal(true)}>
              Quên mật khẩu?
            </Button>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="text-center my-3 text-muted">
          --- Hoặc đăng nhập với ---
        </div>

        <div className="d-flex flex-column gap-2">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
          <FacebookLogin
            appId="2016734672462629"
            onSuccess={handleFacebookResponse}
            onFail={() => toast.error("Đăng nhập Facebook thất bại!")}
            onProfileSuccess={handleFacebookResponse}
            render={({ onClick }) => (
              <button
                onClick={onClick}
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#1877f2",
                  border: "none",
                  fontWeight: "500",
                  borderRadius: "6px",
                  padding: "10px",
                }}
              >
                <i className="bi bi-facebook me-2 fs-5"></i>
                Đăng nhập với Facebook
              </button>
            )}
          />
        </div>

        <p className="text-center mt-4 mb-0">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-decoration-none fw-bold">
            Đăng ký ngay
          </Link>
        </p>
      </div>

      {/* modal quên mk */}
      <ForgotPasswordModal
        show={showForgotModal}
        handleClose={() => setShowForgotModal(false)}
      />
    </div>
  );
};

export default Login;
