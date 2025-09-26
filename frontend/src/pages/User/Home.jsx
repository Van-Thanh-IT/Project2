import React, { useEffect, useState } from "react";
import { Row, Col, Container, Carousel } from "react-bootstrap";
import ProductCard from "../../components/product/ProductCard";
import { getAllHomeProducts } from "../../services/productService";

import img1 from "../../assets/images/img1.png";
import img2 from "../../assets/images/img2.jpg";
import img3 from "../../assets/images/img3.jpg";

function Home() {
  const [products, setProducts] = useState([]);
  console.log(products);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllHomeProducts();
        setProducts(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Carousel */}
      <Carousel>
        <Carousel.Item interval={10000}>
          <img className="d-block w-100" src={img1} alt="Slide 1" />
        </Carousel.Item>
        <Carousel.Item interval={2000}>
          <img className="d-block w-100" src={img2} alt="Slide 2" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={img3} alt="Slide 3" />
        </Carousel.Item>
      </Carousel>

      {/* Products */}
      <Container className="my-4">
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {products.map((product) => (
            <Col key={product.productId}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Home;
