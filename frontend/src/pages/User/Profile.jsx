import React, { useEffect, useState } from "react";
import { getInfo } from "../../services/UserService";
import { getOrderByUser } from "../../services/OrderService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Table, Button, Modal, Badge } from "react-bootstrap";
import team from "../../assets/images/team.jpg";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState("");
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if(window.confirm("Bạn có muốn đăng xuất không?")) return;
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("login"));
    toast.info("Bạn đã đăng xuất!");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getInfo();
        const roles = res.data.roles.map((r) => r.roleName);

        if (!res.data.active) {
          toast.error("Tài khoản của bạn đã bị khóa!");
          handleLogout();
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
        handleLogout(); // tự động logout nếu token hết hạn
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

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

  const renderStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge bg="secondary">Đang chờ xác nhận</Badge>;
      case "CONFIRMED":
        return <Badge bg="info">Đã xác nhận</Badge>;
      case "SHIPPED":
        return <Badge bg="warning">Đang vận chuyển</Badge>;
      case "DELIVERED":
        return <Badge bg="success">Đã giao</Badge>;
      case "CANCELLED":
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">Không hợp lệ</Badge>;
    }
  };

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (messages) return <div className="container mt-4">{messages}</div>;

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm mb-4 d-flex align-items-center" style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* Ảnh đại diện */}
        <div className="profile-avatar mb-3">
          <img
            src={team || "/images/default-avatar.png"}
            alt="avatar"
            className="rounded-circle"
            style={{ width: 300, height: 300, objectFit: "cover", border: "5px solid #0a0909ff" }}
          />
        </div>

        {/* Thông tin */}
        <p><strong>Họ tên:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Số điện thoại:</strong> {user.phone}</p>
        <p>
          <strong>Trạng thái:</strong>{" "}
          {user.active ? <span className="text-success">Đã kích hoạt</span> : <span className="text-danger">Chưa kích hoạt</span>}
        </p>
        <p>
          <strong>Vai trò:</strong>{" "}
          {user.roles.map((role) => (
            <span key={role.roleId} className="badge bg-primary me-1">
              {role.roleName}
            </span>
          ))}
        </p>

        {/* Nút hành động */}
        <div className="d-flex gap-2 mt-3">
          <Button variant="primary" onClick={handleViewOrders}>Xem đơn hàng</Button>
          <Button variant="danger" onClick={handleLogout}>Đăng xuất</Button>
        </div>
      </div>

      {/* Modal danh sách đơn hàng */}
      <Modal show={showOrdersModal} onHide={() => setShowOrdersModal(false)} size="lg" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Đơn hàng của bạn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orders.length === 0 ? (
            <p className="text-center">Bạn chưa có đơn hàng nào.</p>
          ) : (
            <Table striped bordered hover responsive className="text-center">
              <thead className="table-info">
                <tr>
                  <th>Mã đơn</th>
                  <th>Trạng thái</th>
                  <th>Tổng tiền</th>
                  <th>Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.orderId}>
                    <td>{order.code}</td>
                    <td>{renderStatusBadge(order.status)}</td>
                    <td>{order.total.toLocaleString()}₫</td>
                    <td>{new Date(order.placedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrdersModal(false)}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
