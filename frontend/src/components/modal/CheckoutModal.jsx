import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { createVnpayPayment } from "../../services/axiosPublic";
import { getLocations, createOrder } from "../../services/HomeService";
import { toast } from "react-toastify";

function CheckoutModal({ show, onHide, cartItems, userId, onOrderSuccess }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [locations, setLocations] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  // validation state
  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    address: "",
    location: "",
  });

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

  const districts = locations
    .filter((l) => l.province === province)
    .map((l) => l.district);
  const wards = locations
    .filter((l) => l.district === district)
    .map((l) => l.ward);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  const phoneRegex = /^(0)(3|5|7|8|9)\d{8}$/;

  useEffect(() => {
    const newErrors = { ...errors };

    newErrors.fullName = !fullName.trim()
      ? "Họ và tên không được để trống."
      : fullName.trim().length < 2
      ? "Họ và tên quá ngắn."
      : "";

    newErrors.phone = !phone.trim()
      ? "Số điện thoại không được để trống."
      : !phoneRegex.test(phone.trim())
      ? "Số điện thoại không hợp lệ. Ví dụ: 0912345678"
      : "";

    newErrors.address = !address.trim()
      ? "Địa chỉ không được để trống."
      : address.trim().length < 5
      ? "Địa chỉ quá ngắn."
      : "";

    newErrors.location =
      !province || !district || !ward
        ? "Vui lòng chọn đầy đủ Tỉnh/Quận/Phường."
        : "";

    setErrors(newErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, phone, address, province, district, ward]);

  const hasErrors = Object.values(errors).some((e) => e);

  const handleCheckout = async () => {
    if (hasErrors) {
      toast.warning("Vui lòng kiểm tra lại thông tin giao hàng!");
      return;
    }

    // ✅ Tìm locationId từ 3 ô select
    const selectedLocation = locations.find(
      (l) =>
        l.province === province && l.district === district && l.ward === ward
    );

    if (!selectedLocation) {
      toast.warning("Không tìm thấy địa chỉ hợp lệ!");
      return;
    }

    const orderData = {
      userId,
      orderId: Math.floor(Date.now() / 1000),
      code: `ORD-${crypto.randomUUID()}`,
      subtotal,
      shippingFee,
      total,
      placedAt: new Date().toISOString(),
      shippingAddress: address,
      fullName,
      phone,
      locationId: selectedLocation.locationId, // ✅ gửi đúng ID
      items: cartItems.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity,
        price: i.price,
      })),
    };

    try {
      if (paymentMethod === "CASH") {
        // Thanh toán khi nhận hàng
        await createOrder({
          ...orderData,
          payments: [
            {
              method: "CASH",
              amount: total,
              paidAt: new Date().toISOString(),
            },
          ],
          shipments: [
            {
              carrier: "J&T",
              trackingNumber: `GHN${Math.floor(Math.random() * 1e9)}`,
            },
          ],
        });

        toast.success("Đặt hàng thành công!");
        onHide();
        onOrderSuccess();
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/profile");
      } else if (paymentMethod === "VNPAY") {
        // Thanh toán qua VNPAY
        const paymentData = await createVnpayPayment(orderData);
        if (paymentData && paymentData.url) {
          window.location.href = paymentData.url;
        } else {
          toast.error("Không lấy được URL thanh toán VNPAY!");
        }
      }
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      toast.error("Đặt hàng thất bại, vui lòng thử lại!");
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
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              isInvalid={!!errors.fullName}
              placeholder="Ví dụ: Nguyễn Văn A"
            />
            <Form.Control.Feedback type="invalid">
              {errors.fullName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\s+/g, ""))}
              isInvalid={!!errors.phone}
              placeholder="Ví dụ: 0912345678"
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              isInvalid={!!errors.address}
              placeholder="Số nhà, tên đường..."
            />
            <Form.Control.Feedback type="invalid">
              {errors.address}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex gap-2 mb-2">
            <Form.Select
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                setDistrict("");
                setWard("");
              }}
            >
              <option value="">Chọn Tỉnh/TP</option>
              {[...new Set(locations.map((l) => l.province))].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Form.Select>

            <Form.Select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setWard("");
              }}
              disabled={!province}
            >
              <option value="">Chọn Quận/Huyện</option>
              {[...new Set(districts)].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Form.Select>

            <Form.Select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              disabled={!district}
            >
              <option value="">Chọn Phường/Xã</option>
              {[...new Set(wards)].map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </Form.Select>
          </div>
          {errors.location && (
            <div className="text-danger mb-2">{errors.location}</div>
          )}

          <Form.Group className="mt-3">
            <Form.Label>Phương thức thanh toán</Form.Label>
            <div className="d-flex flex-column mt-2">
              <Form.Check
                type="radio"
                label="Thanh toán khi nhận hàng"
                name="paymentMethod"
                value="CASH"
                checked={paymentMethod === "CASH"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <Form.Check
                type="radio"
                label="Thanh toán VNPAY"
                name="paymentMethod"
                value="VNPAY"
                checked={paymentMethod === "VNPAY"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </div>
          </Form.Group>

          <div className="mt-3">
            <strong>Tạm tính:</strong> {subtotal.toLocaleString()} VNĐ<br />
            <strong>Phí ship:</strong> {shippingFee.toLocaleString()} VNĐ<br />
            <strong className="text-danger">
              Tổng: {total.toLocaleString()} VNĐ
            </strong>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="success" onClick={handleCheckout} disabled={hasErrors}>
          Đặt hàng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CheckoutModal;
