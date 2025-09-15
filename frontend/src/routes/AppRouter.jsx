import {BrowserRouter as Router ,Routes, Route } from "react-router-dom";
import Header from "../components/header/Header.jsx";
import Home from "../pages/User/Home.jsx";
import Product from "../pages/User/Product.jsx";
import Desgin from "../pages/User/Desgin.jsx";
import Contact from "../pages/User/Contact.jsx";
import Login from "../pages/User/Login.jsx";
import Regiter from "../pages/User/Regiter.jsx";
import Cart from "../pages/User/Cart.jsx";

function AppRouter() {
  return (
     <Router>
        <Header></Header>
        <Routes>
          
            <Route path="/" element={<Home />} />
            <Route path="product" element={<Product />} />
            <Route path="desgin" element={<Desgin/>}/>
            <Route path="contact" element={<Contact/>}/>
              <Route path="login" element={<Login/>}/>
            <Route path="regiter" element={<Regiter/>}/>
            <Route path="cart" element={<Cart/>}/>

        </Routes>
    </Router>
  );
}
export default AppRouter;
