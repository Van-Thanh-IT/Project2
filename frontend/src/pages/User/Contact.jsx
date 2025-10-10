import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  return (
    <section className="contact-page bg-light">
      {/* Banner */}
      <div className="bg-dark text-white text-center py-5 mb-4">
        <h1 className="fw-bold display-4">📞 Liên hệ với Chúng tôi</h1>
        <p className="lead">
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
        </p>
      </div>

      <Container>
        <Row className="g-4">
          {/* Thông tin liên hệ */}
          <Col md={4}>
            <Card className="shadow-sm h-100 text-center">
              <Card.Body>
                <FaPhoneAlt size={40} className="text-primary mb-3" />
                <h5>Hotline</h5>
                <p className="text-muted mb-0">+84 123 456 789</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm h-100 text-center">
              <Card.Body>
                <FaEnvelope size={40} className="text-danger mb-3" />
                <h5>Email</h5>
                <p className="text-muted mb-0">support@myshop.com</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm h-100 text-center">
              <Card.Body>
                <FaMapMarkerAlt size={40} className="text-success mb-3" />
                <h5>Địa chỉ</h5>
                <p className="text-muted mb-0">
                  123 Đường ABC, Quận 1, TP.HCM
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Bản đồ + Form */}
        <Row className="mt-5 g-4">
          {/* Bản đồ */}
          <Col md={6}>
            <div className="ratio ratio-16x9 shadow-sm rounded">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4679492499335!2d106.70042331533474!3d10.775658992322556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f35b0c5b16f%3A0x3d2b11a94f3e89d4!2zQ8O0bmcgVmluaCBUaMOgbmggUXXhuq1uIDE!5e0!3m2!1svi!2s!4v1637073972710!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Bản đồ"
              ></iframe>
            </div>
          </Col>

          {/* Form liên hệ */}
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <h4 className="mb-4 text-center text-primary fw-bold">
                  Gửi tin nhắn cho chúng tôi
                </h4>
                <Form>
                  <Form.Group className="mb-3" controlId="contactName">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control type="text" placeholder="Nhập họ và tên" />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="contactEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Nhập email" />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="contactMessage">
                    <Form.Label>Tin nhắn</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Nhập tin nhắn của bạn..."
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button variant="primary" size="lg">
                      Gửi tin nhắn
                    </Button>
              
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Contact;
