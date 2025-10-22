import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Button, Alert } from "react-bootstrap";
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
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inStock, setInStock] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // Lấy thống kê đánh giá
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

  // Kiểm tra tồn kho khi variant thay đổi
  useEffect(() => {
    if (!selectedVariant) return;
    const checkStock = async () => {
      try {
        const available = await checkProductStock(selectedVariant.variantId, quantity);
        setInStock(available);
      } catch {
        setInStock(false);
      }
    };
    checkStock();
  }, [selectedVariant, quantity]);

  // Khi chọn màu hoặc size
  useEffect(() => {
    if (!product) return;

    const matchedVariant = product.variants.find(
      (v) =>
        v.color === selectedColor &&
        v.size === selectedSize &&
        v.isActive
    );

    if (matchedVariant) {
      setSelectedVariant(matchedVariant);
      setInStock(true);
    } else {
      setSelectedVariant(null);
      setInStock(false);
    }
  }, [selectedColor, selectedSize, product]);

  // Thêm vào giỏ
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.info("Vui lòng chọn màu và kích thước!");
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
        imageUrl: mainImage,
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
  
  // Lấy danh sách màu và kích thước duy nhất
  const colors = [...new Set(product.variants.filter(v => v.isActive === true).map(v => v.color))];
  const sizes = [...new Set(product.variants.filter(v => v.isActive === true).map(v => v.size))];

  console.log("mau", colors);
   console.log("size", sizes);
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
                  border:
                    mainImage === img.imageUrl ? "2px solid blue" : "1px solid #ddd",
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
            {selectedVariant
              ? selectedVariant.price.toLocaleString()
              : product.price.toLocaleString()}{" "}
            VND
          </h4>

          {/* Chọn màu */}
          <div className="mb-3">
            <h6>Chọn màu:</h6>
            {colors.map((color) => (
              <Button
                key={color}
                className="me-2 mb-2"
                variant={selectedColor === color ? "primary" : "outline-primary"}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </Button>
            ))}
          </div>

          {/* Chọn kích thước */}
          <div className="mb-3">
            <h6>Chọn kích thước:</h6>
            {sizes.map((size) => (
              <Button
                key={size}
                className="me-2 mb-2"
                variant={selectedSize === size ? "primary" : "outline-primary"}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>

          {/* Hiển thị biến thể đã chọn */}
          {selectedVariant && (
            <div className="mb-2">
              <strong>Đã chọn:</strong> {selectedVariant.color} - {selectedVariant.size}
            </div>
          )}

          {/* Số lượng */}
          <div className="mb-3 d-flex align-items-center">
            <Button
              variant="outline-secondary"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </Button>
            <span className="mx-3">{quantity}</span>
            <Button
              variant="outline-secondary"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            >
              +
            </Button>
          </div>

          {/* Nút thêm vào giỏ */}
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
    </div>
  );
}

export default ProductDetail;
