import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function AdminPanel() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [requestFilter, setRequestFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") navigate("/");
    else {
      fetchUsers();
      fetchRequests();
    }
  }, []);

  // ---------------- Users ----------------
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to fetch users");
    }
  };

  const toggleSuspendUser = async (username, suspended) => {
    try {
      if (suspended) {
        await api.put(`/admin/user/${username}/unsuspend`);
      } else {
        await api.put(`/admin/user/${username}/suspend`);
      }
      fetchUsers();
    } catch (err) {
      console.error("Error toggling user suspension:", err);
      alert("Failed to update user status");
    }
  };

  const deleteUser = async (username) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/user/${username}`);
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user");
      }
    }
  };

  // ---------------- Registration Requests ----------------
  const fetchRequests = async () => {
    try {
      const res = await api.get("/admin/requests");
      setRequests(res.data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      alert("Failed to fetch requests");
    }
  };

  const approveRequest = async (id) => {
    try {
      await api.post(`/admin/request/${id}/approve`);
      fetchRequests();
      fetchUsers();
    } catch (err) {
      console.error("Error approving request:", err);
      alert("Failed to approve request");
    }
  };

  const rejectRequest = async (id) => {
    try {
      await api.delete(`/admin/request/${id}/reject`);
      fetchRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Failed to reject request");
    }
  };

  // ---------------- Search and Filter Logic ----------------
  const filteredRequests = requests.filter((r) => {
    const matchesSearch = r.username
      ? r.username.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    const matchesFilter =
      requestFilter === "all" || r.accountType === requestFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.username
      ? u.username.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    const matchesFilter =
      userFilter === "all" ||
      (userFilter === "active" && !u.suspended) ||
      (userFilter === "suspended" && u.suspended) ||
      u.role === userFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <style>
        {`
          .admin-panel {
            min-height: 100vh;
            background: linear-gradient(to bottom right, #e0e7ff, #f3e8ff);
            padding: 1rem;
          }

          .container {
            max-width: 1280px;
            margin: 0 auto;
          }

          .title {
            font-size: 2.5rem;
            font-weight: 800;
            color: #1f2937;
            margin-bottom: 2rem;
            letter-spacing: -0.025em;
          }

          .tabs {
            margin-bottom: 2rem;
          }

          .tab-buttons {
            display: flex;
            gap: 1rem;
            border-bottom: 2px solid #e5e7eb;
          }

          .tab-button {
            padding: 0.75rem 1.5rem;
            font-size: 1.125rem;
            font-weight: 500;
            background: #ffffff;
            color: #4b5563;
            border: none;
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .tab-button.active {
            background: #4f46e5;
            color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .tab-button:hover:not(.active) {
            background: #e0e7ff;
            color: #3730a3;
          }

          .search-filter {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }

          @media (min-width: 640px) {
            .search-filter {
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
            }
          }

          .search-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            outline: none;
            transition: all 0.2s ease;
          }

          .search-input:focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.5);
          }

          .filter-select {
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            background: #ffffff;
            font-size: 1rem;
            outline: none;
            transition: all 0.2s ease;
          }

          .filter-select:focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.5);
          }

          .clear-button {
            padding: 0.75rem 1rem;
            background: #e5e7eb;
            color: #374151;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .clear-button:hover {
            background: #d1d5db;
          }

          .tab-content {
            background: #ffffff;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            transition: all 0.3s ease;
          }

          .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 1.5rem;
          }

          .no-data {
            text-align: center;
            color: #6b7280;
            font-size: 1.125rem;
            padding: 1.5rem;
          }

          .table-container {
            overflow-x: auto;
          }

          .table {
            width: 100%;
            border-collapse: collapse;
          }

          .table th {
            padding: 1rem;
            font-weight: 600;
            color: #3730a3;
            background: #e0e7ff;
            text-align: left;
          }

          .table tr {
            border-top: 1px solid #e5e7eb;
            transition: background 0.2s ease;
          }

          .table tr:nth-child(even) {
            background: #f9fafb;
          }

          .table tr:hover {
            background: #e0e7ff;
          }

          .table td {
            padding: 1rem;
            color: #1f2937;
          }

          .table td.font-medium {
            font-weight: 500;
          }

          .username-link {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s ease;
          }

          .username-link:hover {
            color: #1d4ed8;
            text-decoration: underline;
          }

          .status-active {
            color: #16a34a;
            font-weight: 500;
          }

          .status-suspended {
            color: #dc2626;
            font-weight: 500;
          }

          .action-buttons {
            display: flex;
            gap: 0.75rem;
          }

          .approve-button,
          .reject-button,
          .suspend-button,
          .unsuspend-button,
          .delete-button {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 0.5rem;
            color: #ffffff;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .approve-button,
          .unsuspend-button {
            background: #16a34a;
          }

          .approve-button:hover,
          .unsuspend-button:hover {
            background: #15803d;
            transform: scale(1.05);
          }

          .reject-button,
          .delete-button {
            background: #dc2626;
          }

          .reject-button:hover,
          .delete-button:hover {
            background: #b91c1c;
            transform: scale(1.05);
          }

          .suspend-button {
            background: #eab308;
          }

          .suspend-button:hover {
            background: #ca8a04;
            transform: scale(1.05);
          }

          @media (max-width: 640px) {
            .admin-panel {
              padding: 0.5rem;
            }

            .title {
              font-size: 2rem;
            }

            .tab-button {
              padding: 0.5rem 1rem;
              font-size: 1rem;
            }

            .section-title {
              font-size: 1.25rem;
            }

            .table th,
            .table td {
              padding: 0.75rem;
              font-size: 0.875rem;
            }
          }
        `}
      </style>

      <Navbar user={user} setUser={setUser} />
      <div className="admin-panel">
        <div className="container">
          <h2 className="title">Admin Dashboard</h2>

          {/* Tabs */}
          <div className="tabs">
            <div className="tab-buttons">
              <button
                onClick={() => {
                  setActiveTab("requests");
                  setSearchQuery("");
                  setRequestFilter("all");
                }}
                className={`tab-button ${activeTab === "requests" ? "active" : ""}`}
              >
                Pending Requests
              </button>
              <button
                onClick={() => {
                  setActiveTab("users");
                  setSearchQuery("");
                  setUserFilter("all");
                }}
                className={`tab-button ${activeTab === "users" ? "active" : ""}`}
              >
                Manage Users
              </button>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="search-filter">
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {activeTab === "requests" ? (
                <select
                  value={requestFilter}
                  onChange={(e) => setRequestFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Account Types</option>
                  <option value="SAVINGS">Savings</option>
                  <option value="CHECKING">Checking</option>
                </select>
              ) : (
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Users</option>
                  <option value="USER">Users</option>
                  <option value="ADMIN">Admins</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              )}
              {(searchQuery || requestFilter !== "all" || userFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setRequestFilter("all");
                    setUserFilter("all");
                  }}
                  className="clear-button"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "requests" && (
              <div>
                <h3 className="section-title">Pending Registration Requests</h3>
                {filteredRequests.length === 0 ? (
                  <p className="no-data">No pending requests match the criteria.</p>
                ) : (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Account Type</th>
                          <th>Initial Balance</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRequests.map((r, idx) => (
                          <tr key={r.id}>
                            <td className="font-medium">{r.username || "N/A"}</td>
                            <td>{r.accountType || "N/A"}</td>
                            <td>
                              ₹{(r.initialBalance ?? 0).toLocaleString()}
                            </td>
                            <td className="action-buttons">
                              <button
                                onClick={() => approveRequest(r.id)}
                                className="approve-button"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectRequest(r.id)}
                                className="reject-button"
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <h3 className="section-title">Manage Users</h3>
                {filteredUsers.length === 0 ? (
                  <p className="no-data">No users match the criteria.</p>
                ) : (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Role</th>
                          <th>Balance</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u, idx) => (
                          <tr key={u.id}>
                            <td className="font-medium">
                              <Link
                                to={`/admin/user/${u.username}/transactions`}
                                className="username-link"
                              >
                                {u.username || "N/A"}
                              </Link>
                            </td>
                            <td>{u.role || "N/A"}</td>
                            <td>₹{(u.balance ?? 0).toLocaleString()}</td>
                            <td
                              className={
                                u.suspended ? "status-suspended" : "status-active"
                              }
                            >
                              {u.suspended ? "Suspended" : "Active"}
                            </td>
                            <td className="action-buttons">
                              <button
                                onClick={() => toggleSuspendUser(u.username, u.suspended)}
                                className={
                                  u.suspended ? "unsuspend-button" : "suspend-button"
                                }
                              >
                                {u.suspended ? "Unsuspend" : "Suspend"}
                              </button>
                              <button
                                onClick={() => deleteUser(u.username)}
                                className="delete-button"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}