// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { login } from "../../services/Authentication";
// import { getInfo } from "../../services/UserService";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
 
//       const res = await login(email, password);
//       const token = res?.data?.token;
//       if (token) {
//         localStorage.setItem("token", token);
//         navigate("/admin");
//       } else {
//         setError(res?.data?.messages || "Đăng nhập thất bại!");
//       }
//     } catch (err) {
//       if (err.response && err.response.data) {
//         setError(err.response.data.messages);  
//       } else {
//         setError("Có lỗi xảy ra, vui lòng thử lại!");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//    return (
//     <div className="d-flex justify-content-center bg-light">
//       <div className="card shadow p-4" style={{ width: 400 }}>
//         <h3 className="text-center mb-4">Đăng nhập</h3>
//         {error && <div className="text-danger">{error}</div>}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">Email</label>
//             <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Nhập email..." required/>
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Mật khẩu</label>
//             <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Nhập mật khẩu..." required/>
//           </div>
//           <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</button>
//         </form>
//         <p className="text-center mt-3 mb-0">Chưa có tài khoản? <Link to="/register" className="text-decoration-none">Đăng ký ngay</Link></p>
//       </div>
//     </div>
//   );
// };

// export default Login;
