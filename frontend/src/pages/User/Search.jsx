import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import ProductCard from "../../components/product/ProductCard";
import { getAllHomeProducts } from "../../services/HomeService";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Search() {
  const query = useQuery();
  const [products, setProducts] = useState([]);

  const keyword = query.get("q")?.toLowerCase();

  useEffect(() => {
    if (!keyword) return;

    const fetchProducts = async () => {
      try {
        const res = await getAllHomeProducts();
        if (res?.data) {
          const filtered = res.data.filter(
            (p) =>
              p.productName.toLowerCase().includes(keyword) ||
              p.brand.toLowerCase().includes(keyword) ||
              (p.material && p.material.toLowerCase().includes(keyword))
          );
          setProducts(filtered);
        }
      } catch (err) {
        console.error("Lỗi lấy sản phẩm:", err);
      }
    };

    fetchProducts();
  }, [keyword]); // Chỉ chạy khi keyword thay đổi


  return (
    <div>
      <h4>Kết quả tìm kiếm</h4>
      <Row xs={1} sm={2} md={3} lg={4} className="g-3 mt-3">
        {products.map((product) => (
          <Col key={product.productId}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Search;
