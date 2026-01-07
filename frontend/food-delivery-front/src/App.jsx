import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import RegisterPage from "./pages/RegisterPage";
import RestaurantList from "./pages/RestaurantList";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import LoginPage from "./pages/LoginPage";
import UserOrdersPage from "./pages/UserOrdersPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminMenuPage from "./pages/admin/AdminMenuPage";
import AdminRestaurantsPage from "./pages/admin/AdminRestaurantPage";
import AdminOrderManager from "./pages/admin/AdminOrderManager";
import Footer from "./components/Footer";
import { Box } from "@mui/material";
import ReactivatePage from "./pages/ReactivatePage.jsx";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/menu/:id" element={<MenuPage />} />

          {/* Protected Customer Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-status/:id"
            element={
              <ProtectedRoute>
                <OrderStatusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reactivate"
            element={
              <ProtectedRoute>
                <ReactivatePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <UserOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          {/* Protected Admin Routes */}
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminOrderManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/restaurants"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminRestaurantsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/restaurants/:id/menu"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminMenuPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<RestaurantList />} />
        </Routes>
      </Box>

      <Footer />
    </Box>
  );
}

export default App;
