import React, { useEffect, useState } from "react";
import { getCart, removeCartItem, addToCart } from "../../services/CartService";
import { Button, Spinner, Alert, Image, Form } from "react-bootstrap";
import CheckoutModal from "../../components/modal/CheckoutModal";
import { getInfo } from "../../services/UserService";

const Cart = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Lấy thông tin user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await getInfo();
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch current user", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Lấy giỏ hàng
  useEffect(() => {
    if (!user?.userId) return;

    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await getCart(user.userId);
        setCart(res);
      } catch (err) {
        console.error(err);
        alert("Không thể tải giỏ hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // Khi cart thay đổi, mặc định chọn tất cả sản phẩm
  useEffect(() => {
    if (cart?.items) {
      const defaultSelected = new Set(
        cart.items.map((item) => item.cartItemId)
      );
      setSelectedItems(defaultSelected);
    }
  }, [cart]);

  // Xoá sản phẩm
  const handleRemove = async (cartItemId) => {
    if (!window.confirm("Xác nhận xóa?")) return;
    try {
      const updated = await removeCartItem(user.userId, cartItemId);
      setCart(updated);
      window.dispatchEvent(new Event("cartUpdated"));
      setSelectedItems((prev) => {
        const copy = new Set(prev);
        copy.delete(cartItemId);
        return copy;
      });
    } catch (err) {
      console.error(err);
      alert("Xoá sản phẩm thất bại");
    }
  };

  // Toggle chọn sản phẩm
  const handleSelectItem = async (cartItemId) => {
    const prevSet = selectedItems;
    const newSet = new Set(prevSet);
    if (newSet.has(cartItemId)) {
      newSet.delete(cartItemId);
    } else {
      newSet.add(cartItemId);
    }
    setSelectedItems(newSet);
  };

  // Tính tổng tiền live
  const totalPayment = cart?.items
    .filter((item) => selectedItems.has(item.cartItemId))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!user) return <Spinner animation="border" />;
  if (loading) return <Spinner animation="border" />;

  return (
    <div className="container mt-4">
      <h2>🛒 Giỏ hàng của bạn</h2>

      {cart && cart.items.length > 0 ? (
        <>
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Chọn</th>
                <th>Hình ảnh</th>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.cartItemId}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedItems.has(item.cartItemId)}
                      onChange={() => handleSelectItem(item.cartItemId)}
                      style={{
                        width: "22px",
                        height: "22px",
                        cursor: "pointer",
                        accentColor: "#198754", // màu xanh giống button success
                      }}
                      className="fw-bold"
                    />
                  </td>
                  <td>
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                      rounded
                    />
                  </td>
                  <td>
                    {item.productName}
                    <br />
                    <small className="text-muted">
                      Màu: {item.color} | Size: {item.size}
                    </small>
                  </td>
                  <td>{item.price.toLocaleString()} VNĐ</td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toLocaleString()} VNĐ</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemove(item.cartItemId)}
                    >
                      Xoá
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-end mt-3">
            <h4>
              Tổng thanh toán:{" "}
              <span className="text-danger">
                {totalPayment?.toLocaleString() || 0} VNĐ
              </span>
            </h4>
            <Button
              variant="success"
              size="lg"
              className="mt-2"
              disabled={selectedItems.size === 0}
              onClick={() => setShowCheckout(true)}
            >
              Thanh toán ngay
            </Button>
          </div>

          <CheckoutModal
            show={showCheckout}
            onHide={() => setShowCheckout(false)}
            cartItems={cart.items.filter((item) =>
              selectedItems.has(item.cartItemId)
            )}
            userId={user.userId}
            onOrderSuccess={() => {
              getCart(user.userId).then((res) => setCart(res));
              setSelectedItems(new Set());
            }}
          />
        </>
      ) : (
        <Alert variant="info">Giỏ hàng trống</Alert>
      )}
    </div>
  );
};

export default Cart;
