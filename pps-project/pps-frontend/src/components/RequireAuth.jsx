import { Navigate } from "react-router-dom";

export default function RequireAuth({ children, allowedRoles }) {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // role yetkisizse basit yönlendirme
    return <Navigate to={user.role === "staff" ? "/staff/schedule" : "/booking"} replace />;
  }

  return children;
}
