import React, { useState, useEffect } from "react";
import "../../../styles/header.css";
import { Link } from "react-router-dom";
import RegisterModal from "../../modal/RegisterModal";
import LoginModal from "../../modal/LoginModal";
import { Button } from "react-bootstrap";

function Header() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const openRegisterFromLogin = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  // Lắng nghe thay đổi token
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Hàm logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <header style={{ padding: "20px", background: "#f2f2f2" }}>
      <div className="header_logo">
        <Link to="/">Nội Thất</Link>
        <form action="">
          <input type="text" placeholder="Tìm kiếm sản phẩm..." />
          <button type="submit">Tìm Kiếm</button>
        </form>
        <div>
          <Link className="text-decoration-none text-dark fs-1 fw-bold p-1" to="/cart">Cart</Link>
        </div>
        <div className="acout_style">
          {!isLoggedIn ? (
            <>
              <Button className="btn btn-success" onClick={() => setShowRegister(true)}>Register</Button>
              <Button className="btn btn-primary ms-3" onClick={() => setShowLogin(true)}>Login</Button>
            </>
          ) : (
            <Button className="btn btn-danger" onClick={handleLogout}>Logout</Button>
          )}
        </div>
      </div>

      <nav style={{ display: "flex", gap: "15px" }}>
        <Link className="text-decoration-none text-dark fs-5 fw-bold p-1" to="/">Home</Link>
        <Link className="text-decoration-none text-dark fs-5 fw-bold p-1" to="/product">Product</Link>
        <Link className="text-decoration-none text-dark fs-5 fw-bold p-1" to="/desgin">Desgin</Link>
        <Link className="text-decoration-none text-dark fs-5 fw-bold p-1" to="/contact">Contact</Link>
        {isLoggedIn && (
          <Link className="text-decoration-none text-dark fs-5 fw-bold p-1" to="/profile">Profile</Link>
        )}
      </nav>

      {/* Render modal */}
      <RegisterModal show={showRegister} handleClose={() => setShowRegister(false)} />
      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} openRegister={openRegisterFromLogin} setIsLoggedIn={setIsLoggedIn} />
    </header>
  );
}

export default Header;
