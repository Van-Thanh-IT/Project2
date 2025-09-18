import React from "react";
import { Card, Button } from "react-bootstrap";
import image from "../../assets/images/Tu-quan-ao.jpg";

function ProductCard({ name, price, description, brand, material }) {
  return (
    <Card className="shadow-sm border-0 rounded-3 h-100">
      <Card.Img
        variant="top"
        src={image}
        alt={name}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title className="fw-bold fs-5">{name}</Card.Title>
        <Card.Text className="text-muted small mb-1">
          {brand} · {material}
        </Card.Text>
        <Card.Text className="text-truncate" style={{ maxWidth: "250px" }}>
          {description}
        </Card.Text>
        <h5 className="text-danger fw-bold mb-3">
          {price} ₫
        </h5>
        <Button variant="warning" className="me-2">
          Thêm vào giỏ
        </Button>
        <Button variant="outline-dark">Xem chi tiết</Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
