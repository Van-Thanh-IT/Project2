import React, { useEffect, useState } from "react";
import { getInfo } from "../../services/UserService"; // API gọi /user/info
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState("");
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Bạn đã đăng xuất!");
    navigate("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getInfo();
        const roles = res.data.roles.map(r => r.roleName);

        if (!roles.includes("USER")) {
          setMessages("Bạn không có quyền truy cập trang này");
          setUser(null);
        } else {
          setUser(res.data);
          setMessages("");
        }
      } catch (error) {
        handleLogout(); // tự động logout nếu token hết hạn
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (messages) return <div className="container mt-4">{messages}</div>;

  return (
    <div className="container mt-4">
      <h2>Trang cá nhân</h2>
      <div className="card p-3 shadow-sm" style={{ maxWidth: 600 }}>
        <p><strong>Họ tên:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Số điện thoại:</strong> {user.phone}</p>
        <p>
          <strong>Trạng thái:</strong>{" "}
          {user.active ? (
            <span className="text-success">Đã kích hoạt</span>
          ) : (
            <span className="text-danger">Chưa kích hoạt</span>
          )}
        </p>
        <p>
          <strong>Vai trò:</strong>{" "}
          {user.roles.map((role) => (
            <span key={role.roleId} className="badge bg-primary me-1">
              {role.roleName}
            </span>
          ))}
        </p>
        <button 
          className="btn btn-danger mt-3"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Profile;
