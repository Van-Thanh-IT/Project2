import { Container, Row, Col, Card } from "react-bootstrap";
import { FaTruck, FaSyncAlt, FaShieldAlt, FaPaintBrush } from "react-icons/fa";

const HomeIntro = () => {
  const benefits = [
    { icon: <FaTruck size={30} />, title: "Miễn phí vận chuyển & lắp đặt", desc: "Nhanh chóng – chuyên nghiệp – an toàn" },
    { icon: <FaSyncAlt size={30} />, title: "Đổi trả linh hoạt 7 ngày", desc: "An tâm mua sắm, thoải mái trải nghiệm" },
    { icon: <FaShieldAlt size={30} />, title: "Bảo hành chính hãng 3 năm", desc: "Cam kết chất lượng, đồng hành lâu dài" },
    { icon: <FaPaintBrush size={30} />, title: "Tư vấn thiết kế miễn phí", desc: "Đội ngũ kiến trúc sư hỗ trợ tối ưu không gian" },
  ];

  const furnitures = [
    {
      img: "https://picsum.photos/400/250?random=1",
      title: "Phòng khách hiện đại",
      desc: "Sofa, bàn trà, kệ TV với thiết kế sang trọng, phù hợp mọi không gian.",
    },
    {
      img: "https://picsum.photos/400/250?random=2",
      title: "Phòng ngủ ấm cúng",
      desc: "Giường ngủ, tủ quần áo, tab đầu giường chất lượng cao, tối ưu diện tích.",
    },
    {
      img: "https://picsum.photos/400/250?random=3",
      title: "Bếp tiện nghi",
      desc: "Bộ bàn ăn, tủ bếp, phụ kiện nhà bếp hiện đại, dễ dàng sử dụng.",
    },
    {
      img: "https://picsum.photos/400/250?random=4",
      title: "Văn phòng tiện lợi",
      desc: "Bàn làm việc, ghế xoay, tủ hồ sơ giúp bạn làm việc hiệu quả hơn.",
    },
  ];

  return (
    <>
      {/* Benefits */}
      <Container className="my-5">
        <Row className="g-4">
          {benefits.map((item, i) => (
            <Col key={i} xs={12} sm={6} md={3}>
              <Card className="text-center h-100 shadow-sm border-0">
                <Card.Body>
                  <div className="mb-3 text-primary">{item.icon}</div>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Furniture Showcase */}
      <Container className="my-5">
        <h3 className="text-center mb-4">Khám phá nội thất nổi bật</h3>
        <Row className="g-4">
          {furnitures.map((item, i) => (
            <Col key={i} xs={12} md={6} lg={3}>
              <Card className="h-100 shadow-sm">
                <Card.Img variant="top" src={item.img} />
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default HomeIntro;
