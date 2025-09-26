import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { getAllUsers, updateUser, deleteUser, toggleUserActive } from "../../services/UserService";
import { getOrderByUser } from "../../services/OrderService";
import UserModal from "../../components/modal/UserModal";
import UserOrdersModal from "../../components/modal/UserOrdersModal";
import { toast } from "react-toastify";
import "../../styles/global.scss";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      console.log(res.data);
      setUsers(res.data || []);
    } catch (err) {
      toast.error("Lỗi tải danh sách người dùng");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEdit = (user) => { setSelectedUser(user); setShowModal(true); };

  const handleSave = async (formData) => {
    if (!selectedUser) return;
    try {
      const res = await updateUser(selectedUser.userId, formData);
      toast.success(res.messages || "Cập nhật thành công");
      setShowModal(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.messages || "Cập nhật thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      const res = await deleteUser(id);
      toast.success(res.messages || "Xóa thành công");
      await fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.messages || "Xóa thất bại");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await toggleUserActive(id);
      toast.success("Cập nhật trạng thái thành công");
      await fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.messages || "Thao tác thất bại");
    }
  };

  // Hàm lấy đơn hàng
  const handleViewOrders = async (user) => {
    try {
      const data = await getOrderByUser(user.userId);
      setUserOrders(data || []);
      console.log(data);
      setShowOrdersModal(true);
    } catch (err) {
      toast.error("Không thể lấy đơn hàng của người dùng");
      console.error("Lỗi", err.response.data.messages);
    }
  };


  return (
    <div className="container mt-4">
      <h2>Quản lý người dùng</h2>
      <div className="table-responsive" style={{ maxHeight: "75vh", overflowY: "auto" }}>
        <Table striped bordered hover className="table-dark">
            <thead>
                <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Họ tên</th>
                <th>SĐT</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày đăng ký</th>
                <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {users.map((u) => (
                <tr key={u.userId}>
                    <td>{u.userId}</td>
                    <td>{u.email}</td>
                    <td>{u.fullName}</td>
                    <td>{u.phone}</td>
                    <td>{u.roles[0].roleName === "ADMIN" ? "Quản lý" : "Người dùng"}</td>
                    <td>{u.active ? "Đang hoạt động" : "Tài khoản bị khóa"}</td>
                    <td>
                    {new Date(u.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })}
                    </td>
                    <td>
                    <Button variant="warning" size="sm" onClick={() => handleEdit(u)} className="me-2">Sửa</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(u.userId)} className="me-2">Xóa</Button>
                    {u.roles[0].roleName === "USER" && (
                        <Button
                        variant={u.active ? "secondary" : "success"}
                        size="sm"
                        className="me-2"
                        onClick={() => handleToggleActive(u.userId)}>{u.active ? "Khóa" : "Mở khóa"}</Button>
                    )}
                    <Button variant="info" size="sm" onClick={() => handleViewOrders(u)}>
                      Xem đơn hàng
                    </Button>

                    </td>
                </tr>
                ))}
            </tbody>
        </Table>
    </div>

      <UserModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSave}
        selectedUser={selectedUser}
      />

      <UserOrdersModal
        show={showOrdersModal}
        handleClose={() => setShowOrdersModal(false)}
        orders={userOrders}
      />

    </div>
  );
};

export default UserManagement;
