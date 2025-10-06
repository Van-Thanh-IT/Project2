import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.slug}`); // chuyển sang trang chi tiết
  };

  return (
    <Card
      className="shadow-sm border-0 rounded-3 h-100"
      onClick={handleClick}
      style={{ cursor: "pointer" }} // thêm con trỏ tay
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
        <h5 className="text-danger fw-bold mb-3">{product.price} VNĐ</h5>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
