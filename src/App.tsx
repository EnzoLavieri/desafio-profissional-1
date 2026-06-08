import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import DashboardFinanceiro from "./pages/FinancialDashboard";
import EditCompany from "./pages/EditCompany";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/editcompany" element={<EditCompany />} />
      <Route
        path="/dashboardfinanceiro/:cnpj"
        element={<DashboardFinanceiro />}
      />
      {/* Redireciona rotas inexistentes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}