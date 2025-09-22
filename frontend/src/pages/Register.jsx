import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("CHECKING");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Input validation
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (!["CHECKING", "SAVINGS", "FIXED_DEPOSIT"].includes(accountType)) {
      setError("Please select a valid account type");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await api.post("/register", null, {
        params: { username: username.trim(), password: password.trim(), accountType },
      });
      alert("Registration request submitted! Wait for admin approval.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          .register-page {
            min-height: 100vh;
            background: linear-gradient(to bottom right, #e0e7ff, #f3e8ff);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
          }

          .register-container {
            background: #ffffff;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            width: 100%;
            max-width: 400px;
          }

          .register-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .input-group {
            margin-bottom: 1rem;
          }

          .register-input,
          .register-select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            outline: none;
            transition: all 0.2s ease;
          }

          .register-input:focus,
          .register-select:focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.5);
          }

          .register-button {
            width: 100%;
            padding: 0.75rem;
            background: #16a34a;
            color: #ffffff;
            font-size: 1rem;
            font-weight: 500;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .register-button:hover {
            background: #15803d;
            transform: scale(1.05);
          }

          .register-button:disabled {
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

          .login-link {
            margin-top: 1rem;
            text-align: center;
            font-size: 1rem;
            color: #4b5563;
          }

          .login-link a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s ease;
          }

          .login-link a:hover {
            color: #1d4ed8;
            text-decoration: underline;
          }

          @media (max-width: 640px) {
            .register-container {
              padding: 1.5rem;
              max-width: 90%;
            }

            .register-title {
              font-size: 1.5rem;
            }

            .register-input,
            .register-select {
              padding: 0.5rem;
              font-size: 0.875rem;
            }

            .register-button {
              padding: 0.5rem;
              font-size: 0.875rem;
            }

            .login-link {
              font-size: 0.875rem;
            }
          }
        `}
      </style>

      <div className="register-page">
        <div className="register-container">
          <h2 className="register-title">Register</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              className="register-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              aria-label="Username"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              className="register-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              aria-label="Password"
            />
          </div>
          <div className="input-group">
            <select
              className="register-select"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              disabled={isLoading}
              aria-label="Account Type"
            >
              <option value="CHECKING">Checking</option>
              <option value="SAVINGS">Savings</option>
              <option value="FIXED_DEPOSIT">Fixed Deposit</option>
            </select>
          </div>
          <button
            onClick={handleRegister}
            className="register-button"
            disabled={isLoading}
            aria-label={isLoading ? "Registering" : "Register"}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          <p className="login-link">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}