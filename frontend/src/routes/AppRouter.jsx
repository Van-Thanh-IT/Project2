import {BrowserRouter as Router ,Routes, Route, Navigate } from "react-router-dom";

import UserMainLayout from "../components/layouts/user_layout/UserMainLayout.jsx";
import AdminMainLayout from "../components/layouts/admin_layout/AdminMainLayout.jsx";

// users
import Home from "../pages/User/Home.jsx";
import Product from "../pages/User/Product.jsx";
import Desgin from "../pages/User/Desgin.jsx";
import Contact from "../pages/User/Contact.jsx";
// import Login from "../pages/User/Login.jsx";
// import Regiter from "../pages/User/Register.jsx";
import Cart from "../pages/User/Cart.jsx";
import Profile from "../pages/User/Profile.jsx";

// admin
import AdminRoute from "./AdminRouter.jsx";
import DashboardPage from "../pages/admin/DashboardPage.jsx";
import ProductManagement from "../pages/admin/ProductManagement.jsx";
import CategoryManagement from "../pages/admin/CategoryManagement.jsx";

function AppRouter() {
  return (
     <Router>
        <Routes>
            {/* user routes */}
            <Route path="/" element={<UserMainLayout/>}>
              <Route index element={<Home />} />
              <Route path="product" element={<Product />} />
              <Route path="desgin" element={<Desgin/>}/>
              <Route path="contact" element={<Contact/>}/>
              {/* <Route path="login" element={<Login/>}/>
              <Route path="register" element={<Regiter/>}/> */}
              <Route path="cart" element={<Cart/>}/>
              <Route path="profile" element={<Profile/>}/>
            </Route>
              
            {/* admin routes */}
              <Route path="/admin" element={<AdminMainLayout/>}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="products" element={<ProductManagement />} />
                 <Route path="category" element={<CategoryManagement />} />
              </Route>

            {/* Fallback: redirect bất kỳ path nào không khớp */}
            <Route path="*" element={<Navigate to="/user/login" replace />} />
        </Routes>
    </Router>
  );
}
export default AppRouter;
