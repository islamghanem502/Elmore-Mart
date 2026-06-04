import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import AuthGuard from "./components/AuthGuard";
import AdminGuard from "./components/AdminGuard";
import Navbar from "./components/layout/Navbar";
import CartDrawer from "./components/layout/CartDrawer";
import ChatBot from "./components/ui/ChatBot";

// Customer Pages
import Landing from "./pages/customer/Landing";
import Home from "./pages/customer/Home";
import Categories from "./pages/customer/Categories";
import ProductDetails from "./pages/customer/ProductDetails";
import Checkout from "./pages/customer/Checkout";
import AddAddress from "./pages/customer/AddAddress";
import OrderTracking from "./pages/customer/OrderTracking";
import MyOrders from "./pages/customer/MyOrders";
import Profile from "./pages/customer/Profile";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/Products";
import OrdersAdmin from "./pages/admin/Orders";
import CategoriesAdmin from "./pages/admin/Categories";

import AdminSidebar from "./components/layout/AdminSidebar";

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAuthPage = ["/login", "/register", "/add-address"].includes(location.pathname);
  const isLandingPage = location.pathname === "/";

  return (
    <div className="app" style={{ display: isAdminPage ? "flex" : "block" }}>
      {isAdminPage && <AdminSidebar />}

      <div style={{ flex: 1 }}>
        {!isLandingPage && !isAdminPage && !isAuthPage && <Navbar />}

        <Routes>
          {/* Auth Routes — public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Address — only accessible after login */}
          <Route path="/add-address" element={
            <AuthGuard><AddAddress /></AuthGuard>
          } />

          {/* Customer Routes — public */}
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/track" element={<OrderTracking />} />

          {/* Customer Routes — protected */}
          <Route path="/checkout" element={
            <AuthGuard><Checkout /></AuthGuard>
          } />
          <Route path="/orders" element={
            <AuthGuard><MyOrders /></AuthGuard>
          } />
          <Route path="/profile" element={
            <AuthGuard><Profile /></AuthGuard>
          } />

          {/* Admin Routes — admin role only */}
          <Route path="/admin" element={
            <AdminGuard><Dashboard /></AdminGuard>
          } />
          <Route path="/admin/products" element={
            <AdminGuard><ProductsAdmin /></AdminGuard>
          } />
          <Route path="/admin/orders" element={
            <AdminGuard><OrdersAdmin /></AdminGuard>
          } />
          <Route path="/admin/categories" element={
            <AdminGuard><CategoriesAdmin /></AdminGuard>
          } />
        </Routes>
      </div>

      {!isLandingPage && !isAdminPage && !isAuthPage && <CartDrawer />}
      {!isLandingPage && !isAdminPage && !isAuthPage && <ChatBot />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
