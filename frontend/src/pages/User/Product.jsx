import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert, Pagination, Form} from "react-bootstrap";

import ProductCard from "../../components/product/ProductCard";
import { getAllCategories, getAllHomeProducts } from "../../services/HomeService";
import { getProductsByCategorySlug } from "../../services/axiosPublic";
import CategorySidebar from "../../components/layouts/user_layout/CategorySidebar";

const Product = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const productsPerPage = 12;
  // Lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();

        // Lọc chỉ lấy danh mục cha
        const parentCategories = res.data.filter(cat => !cat.parentId);

        setCategories(parentCategories);
      } catch (err) {
        console.error("Lỗi lấy danh mục:", err);
      }
    };

    fetchCategories();
  }, []);


  // Lấy sản phẩm theo slug
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        if (slug) {
          const res = await getProductsByCategorySlug(slug);
          setProducts(res);
        } else {
          const res = await getAllHomeProducts();
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Lỗi lấy sản phẩm:", err);
        setError("Không thể tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);

  // Sắp xếp
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "priceAsc") return a.price - b.price;
    if (sortOption === "priceDesc") return b.price - a.price;
    return 0;
  });

  // Phân trang
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  return (
    <section className="py-4 bg-light">
      <Container fluid>
        <Row>
          <Col md={3}>
            <CategorySidebar categories={categories} />
          </Col>

          {/* Sản phẩm */}
          <Col md={9}>
            <div className="mb-4">
              <Form.Select
                style={{ width: "200px" }}
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sắp xếp</option>
                <option value="priceAsc">Giá: Thấp → Cao</option>
                <option value="priceDesc">Giá: Cao → Thấp</option>
              </Form.Select>
            </div>

            {loading ? (
              <div className="text-center">
                <Spinner animation="border" />
              </div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : currentProducts.length === 0 ? (
              <p className="text-center text-muted">Không tìm thấy sản phẩm</p>
            ) : (
              <Row xs={2} md={3} lg={4} className="g-4">
                {currentProducts.map((product) => (
                  <Col key={product.productId}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            )}

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  {[...Array(totalPages)].map((_, idx) => (
                    <Pagination.Item
                      key={idx + 1}
                      active={idx + 1 === currentPage}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Product;
