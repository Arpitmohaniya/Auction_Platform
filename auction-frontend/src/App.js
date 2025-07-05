import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddAuctionPage from "./pages/AddAuctionPage";
import PaymentPage from "./pages/PaymentPage";

// Inside <Routes>
function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/payment" element={<PaymentPage />} />
  
  {/* Protected Routes */}
  
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
</Routes>
    </Router>
    
  );
}

export default App;
