import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission refresh
    try {
      const response = await api.post("/login", null, {
        params: { username, password },
      });
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate(response.data.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <>
      <style>
        {`
          .login-page {
            min-height: 100vh;
            background: linear-gradient(to bottom right, #e0e7ff, #f3e8ff);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
          }

          .login-container {
            max-width: 400px;
            width: 100%;
            background: #ffffff;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 2rem;
          }

          .title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .login-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .login-input {
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            outline: none;
            transition: all 0.2s ease;
          }

          .login-input:focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.5);
          }

          .login-button {
            padding: 0.75rem;
            background: #2563eb;
            color: #ffffff;
            font-size: 1rem;
            font-weight: 500;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .login-button:hover {
            background: #1d4ed8;
            transform: scale(1.05);
          }

          .register-link {
            text-align: center;
            color: #2563eb;
            text-decoration: none;
            font-size: 1rem;
            margin-top: 1rem;
            display: block;
          }

          .register-link:hover {
            text-decoration: underline;
            color: #1d4ed8;
          }

          @media (max-width: 640px) {
            .login-container {
              padding: 1.5rem;
            }

            .title {
              font-size: 1.5rem;
            }

            .login-input,
            .login-button {
              font-size: 0.875rem;
            }
          }
        `}
      </style>

      <Navbar user={null} setUser={setUser} />
      <div className="login-page">
        <div className="login-container">
          <h2 className="title">Login</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="Username"
            />
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <a href="/register" className="register-link">
            Don't have an account? Register
          </a>
        </div>
      </div>
    </>
  );
}