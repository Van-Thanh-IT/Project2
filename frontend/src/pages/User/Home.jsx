import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import ProductCard from "../../components/product/ProductCard";
import { getAllHomeProducts } from "../../services/HomeService";
import {getAllCategories } from "../../services/HomeService";
import Banner from "../../components/layouts/user_layout/Banner";
import CategoryMenu from "../../components/layouts/user_layout/CategoryMenu";
function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await   getAllHomeProducts();
        setProducts(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Load toàn bộ danh mục
    const fetchCategories = async () => {
      const data = await getAllCategories();
    
      console.log("Danh mục",data.data);
      setCategories(data.data);
    };
    fetchCategories();
  }, []);

  return (
    <>
      <section className="bg-light">
        <Banner />
      </section>
      
      <section className="py-4 bg-white">
          <CategoryMenu categories={categories}/>
      </section>

      <section className="py-5 bg-light">
        <Container fluid>
          <h2 className="mb-4 text-center">Sản phẩm nổi bật</h2>
          <Row xs={2} sm={3} md={4} lg={5} className="g-4">
            {products.map((product) => (
              <Col key={product.productId}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Home;
