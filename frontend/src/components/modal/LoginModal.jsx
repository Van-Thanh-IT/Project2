import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/Authentication";
import { getInfo } from "../../services/UserService";

const LoginModal = ({ show, handleClose,  openRegister }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        // 1️⃣ Login trước
        const res = await login(email, password);
        const token = res?.data?.token;

        if (token) {
          localStorage.setItem("token", token);
         
          const userRes = await getInfo();
          const roles = userRes.data.roles.map(r => r.roleName); 
          if (roles.includes("ADMIN")) {
            handleClose();
            navigate("/admin");
          } else {
            handleClose();
            navigate("/profile");
          }
        } else {
          setError(res?.data?.messages || "Đăng nhập thất bại!");
        }
      } catch (err) {
        if (err.response && err.response.data) {
          setError(err.response.data.messages);
        } else {
          setError("Có lỗi xảy ra, vui lòng thử lại!");
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Đăng nhập</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="text-danger mb-2">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Đăng nhập"}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <p className="mb-0">
          Chưa có tài khoản?{" "}
          <span onClick={openRegister} className="text-primary" style={{ cursor: "pointer" }}>
            Đăng ký ngay
          </span>
        </p>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
