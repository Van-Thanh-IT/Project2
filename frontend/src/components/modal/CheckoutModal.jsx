import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import { getLocations, createOrder } from "../../services/HomeService";
import { toast } from "react-toastify";

function CheckoutModal({ show, onHide, cartItems, userId, onOrderSuccess }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [locations, setLocations] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await getLocations();
        setLocations(res);
      } catch (err) {
        console.error("Lỗi lấy locations:", err);
      }
    };
    fetchLocations();
  }, []);

  const districts = locations.filter(l => l.province === province).map(l => l.district);
  const wards = locations.filter(l => l.district === district).map(l => l.ward);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  const handleCheckout = async () => {
    const orderData = {
      userId,
      code: `ORD${Date.now()}`,
      subtotal,
      shippingFee,
      total,
      placedAt: new Date().toISOString(),
      shippingAddress: address,
      fullName,
      phone,
      location: { province, district, ward },
      items: cartItems.map(i => ({
        variantId: i.variantId,
        quantity: i.quantity,
        price: i.price
      })),
      shipments: [
        {
          carrier: "J&T",
          trackingNumber: `GHN${Math.floor(Math.random() * 1e9)}`
        }
      ],
      payments: [
        {
          method: paymentMethod,
          amount: total,
          paidAt: new Date().toISOString()
        }
      ]
    };

    try {
      await createOrder(orderData);
      toast.success("Đặt hàng thành công!");
      onHide();
      onOrderSuccess();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
      toast.error("Đặt hàng thất bại");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Thanh toán</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control value={fullName} onChange={e => setFullName(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control value={phone} onChange={e => setPhone(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control value={address} onChange={e => setAddress(e.target.value)} />
          </Form.Group>

          <div className="d-flex gap-2 mb-2">
            <Form.Select value={province} onChange={e => { setProvince(e.target.value); setDistrict(""); setWard(""); }}>
              <option value="">Chọn Tỉnh/TP</option>
              {[...new Set(locations.map(l => l.province))].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Form.Select>

            <Form.Select value={district} onChange={e => { setDistrict(e.target.value); setWard(""); }} disabled={!province}>
              <option value="">Chọn Quận/Huyện</option>
              {[...new Set(districts)].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Form.Select>

            <Form.Select value={ward} onChange={e => setWard(e.target.value)} disabled={!district}>
              <option value="">Chọn Phường/Xã</option>
              {[...new Set(wards)].map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </Form.Select>
          </div>

          <Form.Group className="mt-3">
            <Form.Label>Phương thức thanh toán</Form.Label>
            <Form.Select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option value="CASH">Thanh toán khi nhận hàng</option>
              <option value="VNPAY">VNPAY</option>
            </Form.Select>
          </Form.Group>

          <div className="mt-3">
            <strong>Tạm tính:</strong> {subtotal.toLocaleString()} VNĐ<br/>
            <strong>Phí ship:</strong> {shippingFee.toLocaleString()} VNĐ<br/>
            <strong className="text-danger">Tổng: {total.toLocaleString()} VNĐ</strong>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Hủy</Button>
        <Button variant="success" onClick={handleCheckout}>Đặt hàng</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CheckoutModal;
