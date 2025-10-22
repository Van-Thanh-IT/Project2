import React from "react";
import { Link } from "react-router-dom";
import { 
    FaFacebook, 
    FaInstagram, 
    FaPinterest, 
    FaEnvelope, 
    FaPhone, 
    FaMapMarkerAlt,
    FaHeart // Thêm icon trái tim cho phong cách
} from "react-icons/fa"; 

const Footer = () => {
  return (
    // Sử dụng màu nền tối và padding lớn hơn
    <footer className="bg-dark text-white pt-5 pb-3 shadow-lg"> 
      <div className="container">
        
        {/* HÀNG CHÍNH - Thông tin và Liên kết */}
        <div className="row justify-content-between">
          
          {/* 1. Logo & Mô tả (Phần Tự Giới Thiệu) */}
          <div className="col-md-5 col-lg-4 mb-5 mb-md-4 text-center text-md-start">
            {/* Logo nổi bật hơn */}
            <h3 className="fw-bolder mb-3 text-warning">
                HOME DECOR
            </h3>
            <p className="text-secondary small">
              "Nâng tầm không gian sống của bạn với những thiết kế nội thất 
              hiện đại và tinh tế nhất."
            </p>
            
            {/* Mạng xã hội */}
            <h6 className="fw-bold mt-4 mb-3">Kết nối</h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-4 fs-5">
              <a
                href="https://web.facebook.com/share/17BTXr2XKd/?mibextid=wwXIfr&_rdc=1&_rdr"
                className="text-white-50 transition-color" // Tạo hiệu ứng hover nhẹ
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="hover-text-primary" /> 
              </a>
              <a
                href="#"
                className="text-white-50 transition-color"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="hover-text-primary" /> 
              </a>
              <a
                href="#"
                className="text-white-50 transition-color"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaPinterest className="hover-text-primary" /> 
              </a>
            </div>
          </div>

          {/* 2. Menu nhanh (Cột Liên kết) */}
          <div className="col-6 col-md-3 col-lg-2 mb-4">
            <h5 className="fw-bold mb-3 text-uppercase border-bottom border-warning pb-2">Liên kết</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none hover-text-light small">
                  Trang chủ
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/product" className="text-white-50 text-decoration-none hover-text-light small">
                  Sản phẩm
                </Link>
              </li>
              <li className="mb-2">
<Link to="/desgin" className="text-white-50 text-decoration-none hover-text-light small">
                  Thiết kế
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-white-50 text-decoration-none hover-text-light small">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Thông tin liên hệ */}
          <div className="col-md-4 col-lg-3 mb-4">
            <h5 className="fw-bold mb-3 text-uppercase border-bottom border-warning pb-2">Liên hệ</h5>
            
            <p className="d-flex align-items-center mb-2 text-white-75 small">
                <FaMapMarkerAlt className="me-2 text-info" />
                123 Đường ABC, Quận XYZ, TP.HCM
            </p>
            
            <p className="d-flex align-items-center mb-2 text-white-75 small">
                <FaEnvelope className="me-2 text-info" />
                info@noithat.com
            </p>
            
            <p className="d-flex align-items-center mb-2 text-white-75 small">
                <FaPhone className="me-2 text-info" />
                0909 123 456
            </p>
          </div>
        </div>

        {/* ĐƯỜNG PHÂN CÁCH VÀ COPYRIGHT */}
        <hr className="my-4 border-secondary" /> 

        {/* Copyright - Căn giữa và Tối giản */}
        <div className="text-center small text-secondary">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Home Decor. All rights reserved. 
          </p>
          <p className="mt-1">
             Made with <FaHeart className="text-danger mx-1" /> by Team Dev.
          </p>
        </div>
      </div>
      
      {/* THÊM CUSTOM CSS CHO HIỆU ỨNG HOVER */}
      <style jsx="true">{`
        .hover-text-primary:hover {
          color: #0d6efd !important; /* Màu Primary của Bootstrap */
          transform: translateY(-2px);
          transition: all 0.2s ease-in-out;
        }
        .hover-text-light:hover {
          color: #fff !important;
          margin-left: 5px;
          transition: all 0.2s ease-in-out;
        }
        .text-white-75 {
            color: rgba(255, 255, 255, 0.75) !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;