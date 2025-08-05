import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import components (we'll create these next)
import LandingPage from "./pages/LandingPage";
import ProfessionalSignup from "./pages/ProfessionalSignup";
import CustomerRequest from "./pages/CustomerRequest";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/professional/signup" element={<ProfessionalSignup />} />
            <Route path="/customer/request" element={<CustomerRequest />} />
            <Route path="/professional/dashboard" element={<ProfessionalDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;