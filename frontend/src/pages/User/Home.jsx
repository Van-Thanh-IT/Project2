import React, { useEffect, useState } from "react";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import ProductCard from "../../components/product/ProductCard";
import {
  getAllHomeProducts,
  getTopSellingProducts,
  getAllCategories,
} from "../../services/HomeService";
import Banner from "../../components/layouts/user_layout/Banner";
import CategoryMenu from "../../components/layouts/user_layout/CategoryMenu";

function Home() {
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load sản phẩm tất cả
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProducts, resTop] = await Promise.all([
          getAllHomeProducts(),
          getTopSellingProducts(),
        ]);
        setProducts(resProducts.data);
        setTopProducts(resTop.data);
        console.log(resTop.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Load danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <>
      {/* 🖼️ Banner */}
      <section className="bg-light">
        <Banner />
      </section>

      {/* 📂 Danh mục */}
      <section className="py-4 bg-white border-bottom">
        <Container>
          <CategoryMenu categories={categories} />
        </Container>
      </section>

      {/* 🛋️ Tất cả sản phẩm */}
      <section className="py-5 bg-light">
        <Container fluid>
          <h2 className="mb-4 text-center text-uppercase fw-bold">
            Tất cả sản phẩm
          </h2>
          <Row xs={2} sm={3} md={4} lg={4} className="g-4">
            {products.length > 0 ? (
              products.map((product) => (
                <Col key={product.productId}>
                  <ProductCard product={product} />
                </Col>
              ))
            ) : (
              <p className="text-center text-muted">Không có sản phẩm nào.</p>
            )}
          </Row>
        </Container>
      </section>

      {/* 🌟 Sản phẩm nổi bật */}
      <section className="py-5 bg-white">
        <Container fluid>
          <h2 className="mb-4 text-center text-uppercase fw-bold text-warning">
            Sản phẩm bán chạy 
          </h2>
          <Row xs={2} sm={3} md={4} lg={4} className="g-4">
            {topProducts.length > 0 ? (
              topProducts.map((product) => (
                <Col key={product.productId}>
                  <ProductCard product={product} />
                </Col>
              ))
            ) : (
              <p className="text-center text-muted">Chưa có sản phẩm nổi bật.</p>
            )}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Home;
