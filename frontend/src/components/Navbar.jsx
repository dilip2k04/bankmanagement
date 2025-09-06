import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">Bank App</h1>
      <div className="space-x-4">
        {user?.role === "USER" && <Link to="/dashboard">Dashboard</Link>}
        {user?.role === "ADMIN" && <Link to="/admin">Admin Panel</Link>}
        {user && <button onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
}
