import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button, Badge } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", updateAuth);
    window.addEventListener("login", updateAuth);
    return () => {
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("login", updateAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="shadow-sm sticky-top" style={{ backgroundColor: "#111" }}>
      <Container fluid className="d-flex align-items-center">
        {/* Logo to góc trái */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-2 text-white me-4">
          Nội Thất
        </Navbar.Brand>

        {/* Menu nav ở giữa */}
        <Nav className="me-auto align-items-center">
          <Nav.Link as={Link} to="/" className="fw-bold text-white">Trang chủ</Nav.Link>
          <NavDropdown title={<span className="fw-bold text-white">Sản phẩm</span>} id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/product">Tất cả sản phẩm</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/product/kfrgvs">Phòng Khách</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/product/bedroom">Phòng Ngủ</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/product/phong-bep">Phòng Bếp</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/product/nha-tam">Nhà Tắm</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link as={Link} to="/desgin" className="fw-bold text-white">Thiết kế</Nav.Link>
          <Nav.Link as={Link} to="/contact" className="fw-bold text-white">Liên hệ</Nav.Link>
          {isLoggedIn && <Nav.Link as={Link} to="/profile" className="fw-bold text-white">Trang cá nhân</Nav.Link>}
        </Nav>

        {/* Search dài và cụm giỏ hàng + login/register/logout ở góc phải */}
        <div className="d-flex align-items-center ms-3">
          <Form className="d-flex me-5 ">
            <FormControl
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="me-2 bg-white text-black"
              style={{width:"400px"}}
            />
            <Button variant="primary">Tìm</Button>
          </Form>

          <Nav className="align-items-center">
            <Nav.Link as={Link} to="/cart" className="position-relative text-white me-3">
              <FaShoppingCart size={25} />
              <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                0
              </Badge>
            </Nav.Link>

            {!isLoggedIn ? (
              <>
                <Button as={Link} to="/register" variant="success" className="me-2 fw-bold">Register</Button>
                <Button as={Link} to="/login" variant="primary" className="fw-bold">Login</Button>
              </>
            ) : (
              <Button variant="danger" onClick={handleLogout} className="fw-bold">Logout</Button>
            )}
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
