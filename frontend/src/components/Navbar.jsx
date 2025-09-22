import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <style>
        {`
          .navbar {
            background: linear-gradient(to right, #2563eb, #1e40af);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 50;
          }

          .navbar-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 1rem;
          }

          .navbar-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
          }

          .logo-container {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .logo {
            width: 2rem;
            height: 2rem;
            background: #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            font-weight: bold;
            color: #2563eb;
          }

          .title {
            font-size: 1.5rem;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.025em;
          }

          .nav-links {
            display: flex;
            align-items: center;
            gap: 1.5rem;
          }

          .nav-link {
            padding: 0.5rem 1rem;
            color: #ffffff;
            font-size: 1rem;
            font-weight: 500;
            text-decoration: none;
            border-radius: 0.5rem;
            transition: all 0.3s ease;
          }

          .nav-link:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
          }

          .logout-button {
            padding: 0.5rem 1.5rem;
            background: #ef4444;
            color: #ffffff;
            font-size: 1rem;
            font-weight: 500;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          .logout-button:hover {
            background: #dc2626;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            transform: scale(1.05);
          }

          @media (max-width: 640px) {
            .navbar-container {
              padding: 0.5rem;
            }

            .title {
              font-size: 1.25rem;
            }

            .nav-links {
              gap: 1rem;
            }

            .nav-link {
              padding: 0.5rem;
              font-size: 0.875rem;
            }

            .logout-button {
              padding: 0.5rem 1rem;
              font-size: 0.875rem;
            }
          }
        `}
      </style>

      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            {/* Logo/Title */}
            <div className="logo-container">
              <div className="logo">🏦</div>
              <h1 className="title">Bank App</h1>
            </div>

            {/* Navigation Links */}
            <div className="nav-links">
              {user?.role === "USER" && (
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              )}
              {user?.role === "ADMIN" && (
                <Link to="/admin" className="nav-link">
                  Admin Panel
                </Link>
              )}
              {user && (
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}