import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  function logout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="flex items-center justify-between border-b bg-white px-6 py-4">
      <div className="flex items-center gap-6">
        <span className="font-semibold">PulsePilates</span>

        {user?.role === "client" && (
          <>
            <Link to="/booking" className="hover:underline">
              Book
            </Link>
            <Link to="/clientDashboard" className="hover:underline">
              Dashboard
            </Link>
          </>
        )}

        {user?.role === "staff" && (
          <>
            <Link to="/staff/schedule" className="hover:underline">
              Staff Schedule
            </Link>
            <Link to="/dashboard" className="hover:underline">
                Dashboard
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-gray-500">
              {user.name} ({user.role})
            </span>
            <button
              onClick={logout}
              className="rounded-xl border px-3 py-2 hover:bg-gray-50"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
