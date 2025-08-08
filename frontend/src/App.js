import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import components
import LandingPage from "./pages/LandingPage";
import ProfessionalSignup from "./pages/ProfessionalSignup";
import CustomerRequest from "./pages/CustomerRequest";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminProfessionals from "./pages/AdminProfessionals";
import AdminLeads from "./pages/AdminLeads";
import Login from "./pages/Login";
import Credits from "./pages/Credits";
import FullPricing from "./pages/FullPricing";
import AllLeads from "./pages/AllLeads";
import AssignedLeads from "./pages/AssignedLeads";
import CreditSuccess from "./pages/CreditSuccess";
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
            <Route path="/professional/profile" element={<ProfessionalProfile />} />
            <Route path="/professional/leads" element={<AllLeads />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/professionals" element={<AdminProfessionals />} />
            <Route path="/admin/leads" element={<AdminLeads />} />
            <Route path="/login" element={<Login />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/pricing" element={<FullPricing />} />
            <Route path="/credits/success" element={<CreditSuccess />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;