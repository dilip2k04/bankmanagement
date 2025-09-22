import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import UserTransactions from "./pages/UserTransactions";

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  // Error Boundary Component
  function ErrorBoundary({ children }) {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
      return <h1 style={{ textAlign: "center", padding: "2rem", color: "#dc2626" }}>
        Something went wrong. Please try again later.
      </h1>;
    }

    return children;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <Login user={user} setUser={setUser} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/register"
          element={
            <ErrorBoundary>
              <Register />
            </ErrorBoundary>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ErrorBoundary>
              <Dashboard user={user} setUser={setUser} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/admin"
          element={
            <ErrorBoundary>
              <AdminPanel user={user} setUser={setUser} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/admin/user/:username/transactions"
          element={
            <ErrorBoundary>
              <UserTransactions user={user} setUser={setUser} />
            </ErrorBoundary>
          }
        />
      </Routes>
    </Router>
  );
}