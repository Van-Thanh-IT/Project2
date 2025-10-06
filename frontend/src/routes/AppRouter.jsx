// AppRouter.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserMainLayout from "../components/layouts/user_layout/UserMainLayout.jsx";
import AdminMainLayout from "../components/layouts/admin_layout/AdminMainLayout.jsx";

// users
import Home from "../pages/User/Home.jsx";
import Product from "../pages/User/Product.jsx";
import Desgin from "../pages/User/Desgin.jsx";
import Contact from "../pages/User/Contact.jsx";
import Login from "../pages/User/Login.jsx";
import Regiter from "../pages/User/Register.jsx";
import Cart from "../pages/User/Cart.jsx";
import Profile from "../pages/User/Profile.jsx";
import ProductDetail from "../pages/User/ProductDetal.jsx";
import Search from "../pages/User/Search.jsx";

// admin
import DashboardPage from "../pages/admin/DashboardPage.jsx";
import ProductManagement from "../pages/admin/ProductManagement.jsx";
import CategoryManagement from "../pages/admin/CategoryManagement.jsx";
import UserManagement from "../pages/admin/UserManagement.jsx";
import OrderManagement from "../pages/admin/OrderManagement.jsx";
import PaymentManagement from "../pages/admin/PaymentManagement.jsx";
import ReviewManageMent from "../pages/admin/ReviewManageMent.jsx";
import InventoryManagement from "../pages/admin/InventoryManagement.jsx";
import ReportStatisticsManagement from "../pages/admin/Report_StatisticsManagement.jsx";

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* user routes */}
        <Route path="/" element={<UserMainLayout />}>
          <Route index element={<Home />} />

          {/* Trang sản phẩm */}
          <Route path="product" element={<Product />} />
          <Route path="product/category/:slug" element={<Product />} />
          <Route path="product/:slug" element={<ProductDetail />} />

          <Route path="desgin" element={<Desgin />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Regiter />} />
          <Route path="cart" element={<Cart />} />
          <Route path="user/profile" element={<Profile />} />
          <Route path="search" element={<Search />} />
        </Route>

        {/* admin routes */}
        <Route path="/admin" element={<AdminMainLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="category" element={<CategoryManagement />} />
          <Route path="user" element={<UserManagement />} />
          <Route path="order" element={<OrderManagement />} />
          <Route path="payment" element={<PaymentManagement />} />
          <Route path="review" element={<ReviewManageMent />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="report_statistics" element={<ReportStatisticsManagement />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<div>Trang không tồn tại</div>} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
