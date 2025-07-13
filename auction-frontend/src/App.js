import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddAuctionPage from "./pages/AddAuctionPage";
import PaymentPage from "./pages/PaymentPage";
import AuctionDetail from "./pages/AuctionDetail"; // ✅ Make sure to import this!

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/payment" element={<PaymentPage />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddAuctionPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ ✅ ✅ Add Auction Detail Route */}
        <Route
          path="/auction/:id"
          element={
            <ProtectedRoute>
              <AuctionDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
