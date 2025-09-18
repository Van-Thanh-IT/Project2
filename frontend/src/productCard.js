import React from "react";

const ProductCard = () => {
  return (
    <div className="col-md-3">
      <div className="card product position-relative">
        <span className="discount-badge">-22%</span>

        <img
          src="https://picsum.photos/600/400?random=18"
          className="product-img"
          alt="Ghế Thư Giãn"
        />

        <div className="card-body">
          <h6 className="card-title">Ghế Thư Giãn</h6>

          <p>
            <span className="price-new">2,900,000₫</span>
            <span className="price-old ms-2">3,700,000₫</span>
          </p>

          <div className="d-flex align-items-center">
            <div className="stars">
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <span className="reviews-count">(50)</span>
            </div>
            <div className="sold-count ms-auto">Đã bán 100</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
