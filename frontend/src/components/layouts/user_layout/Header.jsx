import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
  Badge,
  InputGroup,
  Offcanvas,
} from "react-bootstrap";
import { FaUserCircle} from "react-icons/fa";
import { FaShoppingCart, FaSearch, FaHome, FaUser,FaSignInAlt, FaUserPlus  } from "react-icons/fa";
import { getCart } from "../../../services/CartService";
import { getAllHomeProducts } from "../../../services/HomeService";
import CategoryNavDropdown from "./CategoryNavDropdown";
import { getInfo } from "../../../services/UserService";

function Header() {
  const [user, setUser] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [cartCount, setCartCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const navigate = useNavigate();

  // Lấy thông tin user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getInfo();
        setUser(res.data);
        console.log(res.data)
      } catch (err) {
        console.error("Lỗi khi lấy thông tin user:", err);
      }
    };
    if (isLoggedIn) fetchUser();
  }, [isLoggedIn]);

  // Lấy giỏ hàng
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      try {
        const res = await getCart(user.userId);
        setCartCount(res.items?.length || 0);
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      }
    };
    fetchCart();
  }, [user]);

        // Đăng xuất
  const handleLogout = () => {
    if (!window.confirm("Bạn có muốn đăng xuất không?")) return;
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    setCartCount(0);
    navigate("/login");
  };

  // Cập nhật auth + load sản phẩm tìm kiếm
  useEffect(() => {
    const updateAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", updateAuth);
    window.addEventListener("login", updateAuth);
    window.addEventListener("logout", updateAuth);
    

    window.addEventListener("cartUpdated", () => {
      if (user)
        getCart(user.userId).then((res) =>
          setCartCount(res.items?.length || 0)
        );
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
      window.removeEventListener("logout", updateAuth);
    };
  }, [user]);


  // Search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const filtered = products.filter(
      (p) =>
        p.productName.toLowerCase().includes(value.toLowerCase()) ||
        p.brand?.toLowerCase().includes(value.toLowerCase()) ||
        p.material?.toLowerCase().includes(value.toLowerCase())
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
    setSearchKeyword("");
  };

  // Toggle Offcanvas
  const handleToggleOffcanvas = () => setShowOffcanvas(true);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);

  return (
    <Navbar
      expand="lg"
      className="shadow-sm sticky-top"
      style={{ backgroundColor: "#111", zIndex: 1050 }}
    >
      <Container fluid>
        {/* 1️⃣ Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-2 text-white d-flex align-items-center"
        >
          <FaHome size={30} className="text-danger me-2" />
          NTShop
        </Navbar.Brand>

        {/* 2️⃣ Menu Desktop */}
        <Nav className="me-lg-4 d-none d-lg-flex">
          <Nav.Link as={Link} to="/" className="fw-bold text-white">
            Trang chủ
          </Nav.Link>
          <CategoryNavDropdown toggleClassName="nav-link" />
          <Nav.Link as={Link} to="/desgin" className="fw-bold text-white">
            Thiết kế
          </Nav.Link>
          <Nav.Link as={Link} to="/contact" className="fw-bold text-white">
            Liên hệ
          </Nav.Link>
        </Nav>

        {/* 3️⃣ Ô tìm kiếm */}
        <Form
          className="mx-lg-auto position-relative my-2"
          style={{ maxWidth: "500px", flexGrow: 1 }}
          onSubmit={handleSearch}
        >
          <InputGroup>
            <FormControl
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchKeyword}
              onChange={handleSearchChange}
            />
            <Button variant="danger" type="submit">
              <FaSearch />
            </Button>
          </InputGroup>

          {suggestions.length > 0 && (
            <div
              className="position-absolute bg-white border w-100 shadow"
              style={{
                top: "100%",
                left: 0,
                zIndex: 1000,
                borderRadius: "0 0 5px 5px",
              }}
            >
              {suggestions.map((p) => (
                <div
                  key={p.productId}
                  className="p-2 d-flex justify-content-between align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectSuggestion(p.productName)}
                  onMouseEnter={(e) =>
                    e.currentTarget.classList.add("bg-light")
                  }
                  onMouseLeave={(e) =>
                    e.currentTarget.classList.remove("bg-light")
                  }
                >
                  <span>{p.productName}</span>
                  {p.brand && <small className="text-muted">{p.brand}</small>}
                </div>
              ))}
            </div>
          )}
        </Form>

        {/* 4️⃣ Cart + Auth */}
        <Nav className="align-items-center ms-3 d-none d-lg-flex">
          {isLoggedIn && (
            <Nav.Link as={Link} to="/cart" className="position-relative me-3">
              <FaShoppingCart size={25} className="text-white" />
              <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                {cartCount}
              </Badge>
            </Nav.Link>
          )}

        {!isLoggedIn && (
          <>
            <Button
              as={Link}
              to="/register"
              variant="success"
              className="me-2 d-flex align-items-center"
            >
              <FaUserPlus className="me-2" size={20} />
              Đăng ký
            </Button>
            <Button
              as={Link}
              to="/login"
              variant="primary"
              className="d-flex align-items-center"
            >
              <FaSignInAlt className="me-2" size={20} />
              Đăng nhập
            </Button>
          </>
        )}
  
         {isLoggedIn && (
              <Nav.Link as={Link} to="/profile" className="text-white d-flex align-items-center">
                <FaUserCircle size={35} className="me-1" />{user.fullName}
              </Nav.Link>
            )}
        </Nav>

        {/* 5️⃣ Nút Toggle (Mobile) */}
        <Button
          onClick={handleToggleOffcanvas}
          className="d-lg-none border-0 ms-3"
          variant="outline-light"
        >
          ☰
        </Button>
      </Container>

      {/* 6️⃣ Offcanvas Menu (Mobile) */}
      <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="end" className="bg-dark text-white">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="text-white d-flex align-items-center">
            <FaHome size={24} className="text-danger me-2" />
            NTShop
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" onClick={handleCloseOffcanvas} className="text-white">
              Trang chủ
            </Nav.Link>
            <CategoryNavDropdown onClick={handleCloseOffcanvas} />
            <Nav.Link as={Link} to="/desgin" onClick={handleCloseOffcanvas} className="text-white">
              Thiết kế
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={handleCloseOffcanvas} className="text-white">
              Liên hệ
            </Nav.Link>
            {isLoggedIn && (
              <Nav.Link as={Link} to="/profile" onClick={handleCloseOffcanvas} className="text-white">
                <FaUser className="me-2" />{user.fullName}
              </Nav.Link>
            )}
          </Nav>

          <div className="mt-4 border-top border-secondary pt-3">
            {!isLoggedIn ? (
              <>
                <Button as={Link} to="/register" variant="success" onClick={handleCloseOffcanvas} className="mb-2 w-100">
                  Register
                </Button>
                <Button as={Link} to="/login" variant="primary" onClick={handleCloseOffcanvas} className="w-100">
                  Login
                </Button>
              </>
            ) : (
              <Button variant="danger" onClick={handleLogout} className="w-100 mb-3">
                Logout
              </Button>
            )}

            {isLoggedIn && (
              <Nav.Link as={Link} to="/cart" onClick={handleCloseOffcanvas} className="text-white">
                <FaShoppingCart className="me-2" />
                Giỏ hàng
                <Badge bg="danger" pill className="ms-2">
                  {cartCount}
                </Badge>
              </Nav.Link>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </Navbar>
  );
}

export default Header;
