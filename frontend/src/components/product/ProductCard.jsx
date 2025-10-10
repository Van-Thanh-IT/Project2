import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getProductReviewStats } from "../../services/axiosPublic";
import { FaStar } from "react-icons/fa";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // Lấy rating & review count
  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const res = await getProductReviewStats(product.productId);
        console.log("dl đánh giá:", res);
        setRating(res.averageRating || 0);
        setReviewCount(res.reviewCount || 0);
      } catch (error) {
        console.error("Lỗi khi lấy thống kê đánh giá:", error);
      }
    };

    fetchReviewStats();
  }, [product.productId]);

  const handleClick = () => {
    navigate(`/product/${product.slug}`);
  };

  return (
    <Card
      className="shadow-sm border-0 rounded-3 h-100"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <Card.Img
        variant="top"
        src={`http://localhost:8080${product.imageUrl}`}
        alt={product.productName}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <Card.Body>
        <Card.Title className="fw-bold fs-5">{product.productName}</Card.Title>

        <Card.Text className="text-muted small mb-1">
          {product.brand} · {product.material}
        </Card.Text>

        <Card.Text className="text-truncate" style={{ maxWidth: "250px" }}>
          {product.description}
        </Card.Text>

        {/* ⭐ Đánh giá */}
        <div className="d-flex align-items-center mb-2 ">
        {reviewCount > 0 ? (
          <>
            <FaStar color="gold" className="me-1" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-muted ms-2">
              ({reviewCount} đánh giá)
            </span>
          </>
        ) : (
          <span>Chưa có đánh giá</span>
        )}
      </div>

        {/* Giá */}
        <h5 className="text-danger fw-bold mb-0">
          {product.price.toLocaleString("vi-VN")} VNĐ
        </h5>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
