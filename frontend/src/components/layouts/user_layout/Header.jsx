import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Form, FormControl, Button, Badge, InputGroup } from "react-bootstrap";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { getCart } from "../../../services/CartService";
import { getAllHomeProducts } from "../../../services/HomeService";
import CategoryNavDropdown from "./CategoryNavDropdown";
import { getInfo } from "../../../services/UserService";

function Header() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [cartCount, setCartCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  // Lấy thông tin người dùng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getInfo();
        setUser(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin user:", err);
      }
    };
    if (isLoggedIn) fetchUser();
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      try {
        const res = await getCart(user.userId);
        setCartCount(res.items.length);
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      }
    };
    fetchCart();
  }, [user]);

  // Cập nhật auth + load sản phẩm tìm kiếm
  useEffect(() => {
    const updateAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", updateAuth);
    window.addEventListener("login", updateAuth);
    window.addEventListener("cartUpdated", () => {
      if (user) getCart(user.userId).then(res => setCartCount(res.items.length));
    });

    const fetchProducts = async () => {
      try {
        const res = await getAllHomeProducts();
        if (res?.data) setProducts(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", err);
      }
    };
    fetchProducts();

    return () => {
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("login", updateAuth);
      window.removeEventListener("cartUpdated", () => {});
    };
  }, [user]);

  // Đăng xuất
  const handleLogout = () => {
    if (!window.confirm("Bạn có muốn đăng xuất không!")) return;
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    setCartCount(0);
    navigate("/login");
  };

  // Tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const filtered = products.filter(p =>
      p.productName.toLowerCase().includes(value.toLowerCase()) ||
      p.brand.toLowerCase().includes(value.toLowerCase()) ||
      (p.material && p.material.toLowerCase().includes(value.toLowerCase()))
    );

    setSuggestions(filtered.slice(0, 5));
  };

  const handleSelectSuggestion = (keyword) => {
    setSearchKeyword(keyword);
    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchKeyword) return;
    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(searchKeyword)}`);
  };

  return (
    <Navbar expand="lg" className="shadow-sm sticky-top" style={{ backgroundColor: "#111" }}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-2 text-white me-4">
          Nội Thất
        </Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link as={Link} to="/" className="fw-bold text-white">Trang chủ</Nav.Link>
          <CategoryNavDropdown />
          <Nav.Link as={Link} to="/desgin" className="fw-bold text-white">Thiết kế</Nav.Link>
          <Nav.Link as={Link} to="/contact" className="fw-bold text-white">Liên hệ</Nav.Link>
          {isLoggedIn && (
            <Nav.Link as={Link} to="/user/profile" className="fw-bold text-white">Trang cá nhân</Nav.Link>
          )}
        </Nav>

        {/* Search */}
        <Form className="position-relative mx-auto" style={{ width: "500px" }} onSubmit={handleSearch}>
          <InputGroup>
            <FormControl
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchKeyword}
              onChange={handleSearchChange}
              className="bg-white text-black"
            />
            <Button variant="danger" type="submit">
              <FaSearch />
            </Button>
          </InputGroup>

          {suggestions.length > 0 && (
            <div className="position-absolute bg-white border w-100 shadow"
                 style={{ top: "100%", left: 0, zIndex: 1000, borderRadius: "0 0 5px 5px" }}>
              {suggestions.map(p => (
                <div
                  key={p.productId}
                  className="p-2 d-flex justify-content-between align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectSuggestion(p.productName)}
                  onMouseEnter={(e) => e.currentTarget.classList.add("bg-light")}
                  onMouseLeave={(e) => e.currentTarget.classList.remove("bg-light")}
                >
                  <span>{p.productName}</span>
                  {p.brand && <small className="text-muted">{p.brand}</small>}
                </div>
              ))}
            </div>
          )}
        </Form>

        {/* Cart & Auth */}
        <Nav className="align-items-center ms-3">
          {isLoggedIn && (
             <Nav.Link as={Link} to="/cart" className="position-relative text-white me-3">
            <FaShoppingCart size={25} />
            <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
              {cartCount}
            </Badge>
          </Nav.Link>
          )}

          {!isLoggedIn ? (
            <>
              <Button as={Link} to="/register" variant="success" className="me-2 fw-bold">Register</Button>
              <Button as={Link} to="/login" variant="primary" className="fw-bold">Login</Button>
            </>
          ) : (
            <Button variant="danger" onClick={handleLogout} className="fw-bold">Logout</Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
