import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ClientBooking from "./pages/ClientBooking";
import ClientDashboard from "./pages/ClientDashboard";
import StaffSchedule from "./pages/StaffSchedule";
import RequireAuth from "./components/RequireAuth";
import Dashboard from "./pages/Dashboard";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      {/* Client protected routes */}
      <Route
        path="/booking"
        element={
          <RequireAuth allowedRoles={["client"]}>
            <ClientBooking />
          </RequireAuth>
        }
      />
      <Route
        path="/clientDashboard"
        element={
          <RequireAuth allowedRoles={["client"]}>
            <ClientDashboard />
          </RequireAuth>
        }
      />

      <Route path="/dashboard" element={<Dashboard />} />

      {/* Staff protected route */}
      <Route
        path="/staff/schedule"
        element={
          <RequireAuth allowedRoles={["staff"]}>
            <StaffSchedule />
          </RequireAuth>
        }
      />

      <Route path="*" element={<div className="p-6">404</div>} />
    </Routes>
  );
}
