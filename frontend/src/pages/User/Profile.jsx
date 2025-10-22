import React, { useEffect, useState } from "react";
import { getInfo } from "../../services/UserService";
import { getOrderByUser } from "../../services/OrderService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Badge, Spinner } from "react-bootstrap";
import team from "../../assets/images/team.jpg";
import UserOrdersModal from "../../components/modal/UserOrdersModal";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState("");
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getInfo();
        const roles = res.data.roles.map((r) => r.roleName);

        if (!res.data.active) {
          toast.error("Tài khoản của bạn đã bị khóa!");
          navigate("/login");
          return;
        }

        if (!roles.includes("USER")) {
          setMessages("Bạn không có quyền truy cập trang này");
          setUser(null);
        } else {
          setUser(res.data);
          setMessages("");
        }
      } catch (error) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

 const handleLogout = () => {
    if (!window.confirm("Bạn có chắc muốn đăng xuất không?")) return;
    localStorage.removeItem("token");
    toast.info("Đã đăng xuất!");
    
    // 🔔 Phát sự kiện để Header biết
    window.dispatchEvent(new Event("logout"));

    navigate("/login");
  };


  const handleViewOrders = async () => {
    if (!user?.userId) return;
    try {
      const data = await getOrderByUser(user.userId);
      setOrders(data || []);
      setShowOrdersModal(true);
    } catch (err) {
      toast.error("Không thể lấy đơn hàng của bạn");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Đang tải...</span>
      </div>
    );

  if (messages) return <div className="container mt-4">{messages}</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="card-header text-center bg-gradient-primary text-white py-5">
              <div
                className="mx-auto mb-3"
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "5px solid #fff",
                  boxShadow: "0 0 15px rgba(0,0,0,0.2)",
                }}
              >
                <img
                  src={team || "/images/default-avatar.png"}
                  alt="avatar"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h3 className="mb-0 text-black">{user.fullName}</h3>
              <p className="mb-0 text-black">{user.email}</p>
            </div>

            <div className="card-body">
              <div className="row mb-3">
                <div className="col-6">
                  <h6 className="text-muted">Số điện thoại</h6>
                  <p>{user.phone || "Chưa cập nhật"}</p>
                </div>
                <div className="col-6">
                  <h6 className="text-muted">Trạng thái</h6>
                  <p className={user.active ? "text-success" : "text-danger"}>
                    {user.active ? "Đã kích hoạt" : "Chưa kích hoạt"}
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <h6 className="text-muted">Vai trò</h6>
                <div>
                  {user.roles.map((role) => (
                    <Badge key={role.roleId} bg="primary" className="me-2">
                      {role.roleName}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-center mt-4 d-flex flex-column gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleViewOrders}
                  className="rounded-pill px-5 shadow-sm"
                >
                  📦 Xem đơn hàng
                </Button>

                {/* 🔒 Nút Đăng xuất */}
                <Button
                  variant="danger"
                  size="lg"
                  onClick={handleLogout}
                  className="rounded-pill px-5 shadow-sm"
                >
                  🚪 Đăng xuất
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal hiển thị đơn hàng */}
      <UserOrdersModal
        show={showOrdersModal}
        handleClose={() => setShowOrdersModal(false)}
        orders={orders}
      />
    </div>
  );
};

export default Profile;
