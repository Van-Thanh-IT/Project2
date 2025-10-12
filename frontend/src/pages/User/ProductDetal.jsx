import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Button, Alert, Modal } from "react-bootstrap";
import { getProductDetail, checkProductStock } from "../../services/HomeService";
import { addToCart } from "../../services/CartService"; 
import { toast } from "react-toastify";
import { getInfo } from "../../services/UserService";
import { getProductReviewStats } from "../../services/axiosPublic";
import { FaStar } from "react-icons/fa"; 

function ProductDetail() {
  const { slug } = useParams();
  const [user, setUser] = useState(null); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inStock, setInStock] = useState(true); 
  // ⭐ Thêm state cho đánh giá
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // Lấy rating & review count
  useEffect(() => {
    if (!product) return;

    const fetchReviewStats = async () => {
      try {
        const res = await getProductReviewStats(product.productId);
        setRating(res.averageRating || 0);
        setReviewCount(res.reviewCount || 0);
      } catch (error) {
        console.error("Lỗi khi lấy thống kê đánh giá:", error);
      }
    };
    fetchReviewStats();
  }, [product]);

  // Lấy thông tin user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getInfo(); 
        setUser(res.data); 
      } catch (err) {
        console.error("Lỗi khi lấy thông tin user:", err);
      }
    };
    fetchUser();
  }, []);

  // Lấy sản phẩm theo slug
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductDetail(slug);
        setProduct(res.data);

        if (res.data.images?.length > 0) {
          setMainImage(res.data.images[0].imageUrl);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Kiểm tra tồn kho khi quantity thay đổi
  useEffect(() => {
    if (!selectedVariant) return;

    const checkStock = async () => {
      try {
        const available = await checkProductStock(selectedVariant.variantId, quantity);
        setInStock(available); // true/false
      } catch (err) {
        console.error("Lỗi khi kiểm tra tồn kho:", err);
        setInStock(false);
      }
    };

    checkStock();
  }, [selectedVariant, quantity]);


  // Thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.info("Vui lòng chọn màu/kích thước trước khi thêm vào giỏ hàng!");
      return;
    }
    if (!inStock) {
      toast.error("Sản phẩm này đã hết hàng!");
      return;
    }
    try {
      await addToCart(user.userId, {
        variantId: selectedVariant.variantId,
        quantity: quantity,
        price: selectedVariant.price,
        imageUrl: mainImage  
      });
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (err) {
      console.error("Thêm vào giỏ thất bại!", err);
      toast.info("Bạn chưa đăng nhập");
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!product) return <Alert variant="warning">Không tìm thấy sản phẩm</Alert>;

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Hình ảnh */}
        <div className="col-md-5">
          <img
            src={mainImage}
            alt={product.productName}
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <div className="mt-2 d-flex">
            {product.images.map((img) => (
              <img
                key={img.imageId}
                src={img.imageUrl}
                alt=""
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  marginRight: "10px",
                  border: mainImage === img.imageUrl ? "2px solid blue" : "1px solid #ddd",
                  cursor: "pointer",
                }}
                onClick={() => setMainImage(img.imageUrl)}
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-md-7">
          <h3>{product.productName}</h3>
          <p>{product.description}</p>

          {/* ⭐ Hiển thị đánh giá */}
          <div className="mb-3 d-flex align-items-center">
            <FaStar color="gold" className="me-2" />
            <span className="fw-bold">{rating.toFixed(1)}</span>
            <span className="text-muted ms-2">({reviewCount} lượt đánh giá)</span>
          </div>

          <h4 className="text-danger">
            {selectedVariant ? selectedVariant.price.toLocaleString() : product.price.toLocaleString()} VND
          </h4>

          <div className="mb-3">
            <Button onClick={() => setShowModal(true)}>Chọn màu/kích thước</Button>
            {selectedVariant && (
              <span className="ms-3">
                Đã chọn: {selectedVariant.color} - {selectedVariant.size}
              </span>
            )}
          </div>

          <div className="mb-3 d-flex align-items-center">
            <Button
              variant="outline-secondary"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >-</Button>
            <span className="mx-3">{quantity}</span>
            <Button
              variant="outline-secondary"
              onClick={() => setQuantity(q => Math.min(20, q + 1))}
            >+</Button>
          </div>

          {/* Nút thêm vào giỏ và cảnh báo hết hàng */}
          <div className="mb-3">
            <Button
              variant="danger"
              size="lg"
              onClick={handleAddToCart}
              disabled={!selectedVariant || !inStock}
            >
              🛒 {inStock ? "Thêm vào giỏ" : "Hết hàng"}
            </Button>
          </div>
        </div>
      </div>

      {/* Modal chọn variant */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chọn biến thể</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {product.variants.map(v => (
            <Button
              key={v.variantId}
              className="me-2 mb-2"
              variant={selectedVariant?.variantId === v.variantId ? "primary" : "outline-primary"}
              onClick={async () => {
                setSelectedVariant(v);
                setShowModal(false);
                // Kiểm tra tồn kho
                try {
                  const available = await checkProductStock(v.variantId, quantity);
                  setInStock(available);
                } catch {
                  setInStock(false);
                }
              }}
            >
              {v.color} - {v.size} - {v.price.toLocaleString()} VNĐ
            </Button>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ProductDetail;
