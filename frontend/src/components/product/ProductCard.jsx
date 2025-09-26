import React from "react";
import { Card, Button } from "react-bootstrap";

function ProductCard({ product }) {
  const imageUrl = product?.images?.[0]?.imageUrl || "/default.png"; 
  
  return (
    <Card className="shadow-sm border-0 rounded-3 h-100">
      <Card.Img
        variant="top"
        src={`http://localhost:8080/${product.imageUrl}`}
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
        <h5 className="text-danger fw-bold mb-3">{product.price} ₫</h5>
        <Button variant="warning" className="me-2">
          Thêm vào giỏ
        </Button>
        <Button variant="outline-dark">Xem chi tiết</Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
