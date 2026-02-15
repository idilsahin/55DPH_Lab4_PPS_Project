import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { apiPost } from "../data/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" }); // idle|loading|error

  async function handleLogin() {
    setStatus({ type: "loading", message: "Logging in..." });

    try {
      const user = await apiPost("/login", { email, password });

      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "client") navigate("/booking");
      else navigate("/staff/schedule");

      setStatus({ type: "idle", message: "" });
    } catch (e) {
      setStatus({ type: "error", message: "Invalid email or password" });
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-semibold text-gray-900">
          PulsePilates Login
        </h1>

        {status.type === "error" && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
            {status.message}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-3"
          />

          <Button className="w-full py-3 text-lg" onClick={handleLogin}>
            {status.type === "loading" ? "Logging in..." : "Login"}
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Client: client@pulsepilates.com / 123456</p>
          <p>Staff: staff@pulsepilates.com / 123456</p>
        </div>
      </div>
    </div>
  );
}
