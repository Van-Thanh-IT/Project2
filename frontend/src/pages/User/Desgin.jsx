// src/pages/Desgin.jsx
import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaCouch, FaPaintRoller, FaRulerCombined, FaPhoneAlt } from "react-icons/fa";

function Desgin() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-primary text-white text-center py-5">
        <Container>
          <h1 className="display-4 fw-bold">Thiết Kế Nội Thất Chuyên Nghiệp</h1>
          <p className="lead mt-3">
            Mang đến không gian sống sang trọng, hiện đại và phù hợp phong cách của bạn.
          </p>
        </Container>
      </div>
      {/* Services */}
      <Container className="py-5">
        <h2 className="text-center fw-bold mb-4">Dịch Vụ Của Chúng Tôi</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 text-center shadow-sm">
              <Card.Body>
                <FaCouch size={50} className="text-primary mb-3" />
                <Card.Title>Thiết kế phòng khách</Card.Title>
                <Card.Text>
                  Không gian phòng khách sang trọng, ấm cúng và hiện đại.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 text-center shadow-sm">
              <Card.Body>
                <FaPaintRoller size={50} className="text-primary mb-3" />
                <Card.Title>Thiết kế phòng ngủ</Card.Title>
                <Card.Text>
                  Mang lại cảm giác thư giãn và tinh tế với màu sắc hài hòa.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 text-center shadow-sm">
              <Card.Body>
                <FaRulerCombined size={50} className="text-primary mb-3" />
                <Card.Title>Thiết kế văn phòng</Card.Title>
                <Card.Text>
                  Không gian làm việc tối ưu, hiện đại, tăng hiệu suất làm việc.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* CTA */}
      <div className="bg-primary text-white text-center py-5">
        <Container>
          <h2 className="fw-bold">Liên Hệ Ngay</h2>
          <p className="mt-2">
            Hãy bắt đầu dự án thiết kế nội thất của bạn cùng chúng tôi!
          </p>
          <Button
            variant="light"
            className="text-primary fw-bold d-inline-flex align-items-center gap-2 mt-3"
          >
            <FaPhoneAlt /> Gọi: 0123-456-789
          </Button>
        </Container>
      </div>
    </div>
  );
}

export default Desgin;
