import React from "react";
import { Modal, Button, Row, Col, Card } from "react-bootstrap";

function ProductDetailModal({ show, onHide, product }) {
  if (!product) return null;

  const primaryImg = product.images?.find((img) => img.isPrimary)?.imageUrl;
  const otherImgs = product.images?.filter((img) => !img.isPrimary) || [];

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      dialogClassName="modal-90w" // mở rộng modal
      aria-labelledby="product-detail-modal"
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title id="product-detail-modal">Chi tiết sản phẩm</Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="bg-light"
        style={{ maxHeight: "85vh", overflowY: "auto", padding: "20px 25px" }}
      >
        <Row className="align-items-start">
          {/* --- Cột ảnh sản phẩm --- */}
          <Col md={5} lg={5} className="text-center">
            {primaryImg ? (
              <img
                src={primaryImg}
                alt={product.productName}
                className="img-fluid rounded shadow mb-3"
                style={{
                  maxHeight: "400px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            ) : (
              <div className="text-muted py-5">Chưa có ảnh chính</div>
            )}

            {otherImgs.length > 0 && (
              <div
                className="d-flex justify-content-start gap-2 flex-wrap px-2"
                style={{ maxHeight: "150px", overflowX: "auto" }}
              >
                {otherImgs.map((img) => (
                  <img
                    key={img.imageId}
                    src={img.imageUrl}
                    alt="preview"
                    className="shadow-sm"
                    style={{
                      width: "85px",
                      height: "85px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                ))}
              </div>
            )}
          </Col>

          {/* --- Cột thông tin sản phẩm --- */}
          <Col md={7} lg={7}>
            <h3 className="fw-bold mb-3">{product.productName}</h3>
            <p><strong>Thương hiệu:</strong> {product.brand}</p>
            <p><strong>Chất liệu:</strong> {product.material}</p>
            <p>
              <strong>Giá:</strong>{" "}
              <span className="text-danger fw-bold">
                {product.price.toLocaleString()} VNĐ
              </span>
            </p>
            <p><strong>Danh mục:</strong> {product.categoryName || "Không có"}</p>
            <p><strong>Mô tả:</strong> {product.description}</p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {product.isActive ? (
                <span className="badge bg-success">Hoạt động</span>
              ) : (
                <span className="badge bg-secondary">Đã xóa</span>
              )}
            </p>
          </Col>
        </Row>

        {/* --- Biến thể sản phẩm --- */}
        {product.variants && product.variants.length > 0 && (
          <>
            <hr />
            <h5 className="fw-bold mb-3">Biến thể sản phẩm</h5>

            <div
              className="d-flex gap-3 flex-nowrap overflow-auto pb-2"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {product.variants.map((v) => (
                <Card
                  key={v.variantId}
                  className="shadow-sm border-0 flex-shrink-0"
                  style={{
                    width: "250px",
                    scrollSnapAlign: "start",
                    borderRadius: "15px",
                  }}
                >
                  <Card.Body>
                    <p><strong>Màu:</strong> {v.color}</p>
                    <p><strong>Kích cỡ:</strong> {v.size}</p>
                    <p><strong>Giá:</strong> {v.price.toLocaleString()} VNĐ</p>
                    <p><strong>Khối lượng:</strong> {v.weight} kg</p>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductDetailModal;
