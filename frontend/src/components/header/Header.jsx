import React from "react";
import "../../styles/header.css";
import { Link } from "react-router-dom";
function Header() {

  return (
    <header style={{ padding: "20px", background: "#f2f2f2" }}>
        <div className="header_logo">
            <Link className="" to="/">Nội Thất</Link>
            <form action="">
                <input type="text" placeholder="Tìm kiếm sản phẩm..."/>
                <button type="btn" className="">Tìm Kiếm</button>
            </form>
            <div>
                <Link className="text-decoration-none text-dark fs-1 fw-bold p-1" to="/cart">Cart</Link>
            </div>
            <div className="acout_style">
                <Link className="text_regiter text-light bg-warning fs-5 p-1  px-3 text-decoration-none border border-2 border-warning" to="/regiter">Regiter</Link>
                <Link className="text_login text-light bg-danger fs-5 p-1 ms-2 px-3 text-decoration-none border border-2 border-danger" to="/login">Login</Link>
            </div>
        </div>
      <nav style={{ display: "flex", gap: "15px" }}>
        <Link className="text-decoration-none text-dark fs-5 fw-bold p-1 " to="/">Home</Link>
        <Link className="text-decoration-none text-dark fs-5 fw-bold p-1 " to="/product">Product</Link>
        <Link className="text-decoration-none text-dark fs-5 fw-bold p-1 " to="/desgin">Desgin</Link>
        <Link className="text-decoration-none text-dark fs-5 fw-bold p-1 " to="/contact">Contact</Link>
      </nav>
    </header>
  );
}

export default Header;
