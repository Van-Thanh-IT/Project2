// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { register } from "../../services/Authentication";
// import { toast } from "react-toastify";

// const Register = () => {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [phone, setPhone] = useState("");

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
    
//     try {
//       const res = await register({ fullName, email, password, confirmPassword, phone });
//       toast.success(res.messages || "Đăng ký thành công!");
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err) {
//       setError(err.response?.data?.messages);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center  bg-light">
//       <div className="card shadow p-4" style={{ width: 350 }}>
//         <h3 className="text-center mb-3">Đăng ký</h3>
//         {error && <div className="alert alert-danger">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-1">
//             <label className="form-label">Họ và tên</label>
//             <input type="text" className="form-control" value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Nhập họ và tên..." required />
//           </div>

//           <div className="mb-1">
//             <label className="form-label">Email</label>
//             <input type="email" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Nhập email..." required />
//           </div>

//           <div className="mb-1">
//             <label className="form-label">Mật khẩu</label>
//             <input type="password" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Nhập mật khẩu..." required />
//           </div>

//           <div className="mb-1">
//             <label className="form-label">Xác nhận mật khẩu</label>
//             <input type="password" className="form-control" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu..." required />
//           </div>

//           <div className="mb-1">
//             <label className="form-label">Số điện thoại</label>
//             <input type="text" className="form-control" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Nhập số điện thoại..." required />
//           </div>

//           <button type="submit" className="btn btn-success w-100" disabled={loading}>
//             {loading ? "Đang đăng ký..." : "Đăng ký"}
//           </button>
//         </form>

//         <p className="text-center mt-3">
//           Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;
