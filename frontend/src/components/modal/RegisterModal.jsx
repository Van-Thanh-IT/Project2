import React, { useState } from "react";
import { register } from "../../services/Authentication";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap"; 

const RegisterModal = ({ show, handleClose}) => {
   const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await register({ fullName, email, password, confirmPassword, phone });
      toast.success(res.messages || "Đăng ký thành công!");
      handleClose();
    } catch (err) {
      setError(err.response?.data?.messages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton><Modal.Title>Đăng ký</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" className="form-control mb-2" value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Họ và tên" required/>
          <input type="email" className="form-control mb-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required/>
          <input type="password" className="form-control mb-2" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mật khẩu" required/>
          <input type="password" className="form-control mb-2" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Xác nhận mật khẩu" required/>
          <input type="text" className="form-control mb-3" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Số điện thoại" required/>
          <Button type="submit" variant="success" className="w-100" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </form> 
      </Modal.Body>
    </Modal>
    
  );
};

export default RegisterModal;
