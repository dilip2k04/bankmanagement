import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Input validation
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/login", null, {
        params: { username, password },
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      if (res.data.role === "ADMIN") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials or server error");
    } finally {
      setIsLoading(false);
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
            background: #ffffff;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            width: 100%;
            max-width: 400px;
          }

          .login-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .input-group {
            margin-bottom: 1rem;
          }

          .login-input {
            width: 100%;
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
            width: 100%;
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

          .login-button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            transform: none;
          }

          .error-message {
            color: #dc2626;
            font-size: 0.875rem;
            margin-bottom: 1rem;
            text-align: center;
          }

          .register-link {
            margin-top: 1rem;
            text-align: center;
            font-size: 1rem;
            color: #4b5563;
          }

          .register-link a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s ease;
          }

          .register-link a:hover {
            color: #1d4ed8;
            text-decoration: underline;
          }

          @media (max-width: 640px) {
            .login-container {
              padding: 1.5rem;
              max-width: 90%;
            }

            .login-title {
              font-size: 1.5rem;
            }

            .login-input {
              padding: 0.5rem;
              font-size: 0.875rem;
            }

            .login-button {
              padding: 0.5rem;
              font-size: 0.875rem;
            }

            .register-link {
              font-size: 0.875rem;
            }
          }
        `}
      </style>

      <div className="login-page">
        <div className="login-container">
          <h2 className="login-title">Login</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleLogin}
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <p className="register-link">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
}