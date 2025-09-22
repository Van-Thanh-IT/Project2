import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5">
      <div className="container">
        <div className="row">

          {/* Logo & Mô tả */}
          <div className="col-md-4 mb-4">
            <h3 className="fw-bold">Nội Thất</h3>
            <p>
              Chuyên cung cấp nội thất sang trọng, hiện đại, chất lượng cao cho
              ngôi nhà của bạn.
            </p>
          </div>

          {/* Menu nhanh */}
          <div className="col-md-2 mb-4">
            <h5 className="fw-bold mb-3">Liên kết</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-light text-decoration-none">Home</Link>
              </li>
              <li>
                <Link to="/product" className="text-light text-decoration-none">Sản phẩm</Link>
              </li>
              <li>
                <Link to="/desgin" className="text-light text-decoration-none">Desgin</Link>
              </li>
              <li>
                <Link to="/contact" className="text-light text-decoration-none">Liên hệ</Link>
              </li>
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Liên hệ</h5>
            <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
            <p>Email: info@noithat.com</p>
            <p>Hotline: 0909 123 456</p>
          </div>

          {/* Mạng xã hội */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Theo dõi chúng tôi</h5>
            <div className="d-flex gap-3 fs-4">
              <a href="#" className="text-light text-decoration-none">Facebook</a>
              <a href="#" className="text-light text-decoration-none">Instagram</a>
              <a href="#" className="text-light text-decoration-none">Pinterest</a>
            </div>
          </div>

        </div>

        <hr className="border-light" />

        {/* Copyright */}
        <div className="text-center pb-3">
          &copy; {new Date().getFullYear()} Nội Thất. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
