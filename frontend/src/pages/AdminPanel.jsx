import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function AdminPanel({ user, setUser }) {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [requestFilter, setRequestFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [requestsPage, setRequestsPage] = useState(0);
  const [usersPage, setUsersPage] = useState(0);
  const [requestsHasMore, setRequestsHasMore] = useState(true);
  const [usersHasMore, setUsersHasMore] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const pageSize = 20;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") navigate("/");
    else {
      fetchUsers();
      fetchRequests();
    }
  }, [user, navigate, usersPage, requestsPage, searchQuery, userFilter, requestFilter]);

  // ---------------- Users ----------------
  const fetchUsers = async () => {
    try {
        setIsLoadingUsers(true);
        const params = new URLSearchParams({
            page: usersPage,
            size: pageSize,
            search: searchQuery,
            filter: userFilter,
        });
        const res = await api.get(`/admin/users?${params.toString()}`);
        setUsers(res.data.content || []);
        setUsersHasMore(res.data.content.length === pageSize);
    } catch (err) {
        console.error("Error fetching users:", err);
        alert(err.response?.data || "Failed to fetch users");
    } finally {
        setIsLoadingUsers(false);
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
      alert(err.response?.data || "Failed to update user status");
    }
  };

  const deleteUser = async (username) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/user/${username}`);
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert(err.response?.data || "Failed to delete user");
      }
    }
  };

  // ---------------- Registration Requests ----------------
  const fetchRequests = async () => {
    try {
        setIsLoadingRequests(true);
        const params = new URLSearchParams({
            page: requestsPage,
            size: pageSize,
            search: searchQuery,
            filter: requestFilter,
        });
        const res = await api.get(`/admin/requests?${params.toString()}`);
        setRequests(res.data.content || []);
        setRequestsHasMore(res.data.content.length === pageSize);
    } catch (err) {
        console.error("Error fetching requests:", err);
        alert(err.response?.data || "Failed to fetch requests");
    } finally {
        setIsLoadingRequests(false);
    }
};

  const approveRequest = async (id) => {
    try {
      await api.post(`/admin/request/${id}/approve`);
      fetchRequests();
      fetchUsers();
    } catch (err) {
      console.error("Error approving request:", err);
      alert(err.response?.data || "Failed to approve request");
    }
  };

  const rejectRequest = async (id) => {
    try {
      await api.delete(`/admin/request/${id}/reject`);
      fetchRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert(err.response?.data || "Failed to reject request");
    }
  };

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

          .loading {
            text-align: center;
            color: #4f46e5;
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

          .pagination {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1.5rem;
          }

          .pagination-button {
            padding: 0.5rem 1rem;
            background: #4f46e5;
            color: #ffffff;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .pagination-button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
          }

          .pagination-button:hover:not(:disabled) {
            background: #4338ca;
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

            .pagination-button {
              padding: 0.5rem;
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
                  setRequestsPage(0);
                }}
                className={`tab-button ${activeTab === "requests" ? "active" : ""}`}
                aria-label="View pending requests"
              >
                Pending Requests
              </button>
              <button
                onClick={() => {
                  setActiveTab("users");
                  setSearchQuery("");
                  setUserFilter("all");
                  setUsersPage(0);
                }}
                className={`tab-button ${activeTab === "users" ? "active" : ""}`}
                aria-label="Manage users"
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setUsersPage(0);
                  setRequestsPage(0);
                }}
                className="search-input"
                aria-label="Search by username"
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {activeTab === "requests" ? (
                <select
                  value={requestFilter}
                  onChange={(e) => {
                    setRequestFilter(e.target.value);
                    setRequestsPage(0);
                  }}
                  className="filter-select"
                  aria-label="Filter requests by account type"
                >
                  <option value="all">All Account Types</option>
                  <option value="SAVINGS">Savings</option>
                  <option value="CHECKING">Checking</option>
                  <option value="FIXED_DEPOSIT">Fixed Deposit</option>
                </select>
              ) : (
                <select
                  value={userFilter}
                  onChange={(e) => {
                    setUserFilter(e.target.value);
                    setUsersPage(0);
                  }}
                  className="filter-select"
                  aria-label="Filter users"
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
                    setUsersPage(0);
                    setRequestsPage(0);
                  }}
                  className="clear-button"
                  aria-label="Clear filters"
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
                {isLoadingRequests ? (
                  <p className="loading">Loading...</p>
                ) : requests.length === 0 ? (
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
                        {requests.map((r) => (
                          <tr key={r.id}>
                            <td className="font-medium">{r.username || "N/A"}</td>
                            <td>{r.accountType || "N/A"}</td>
                            <td>₹{(r.initialBalance ?? 0).toLocaleString()}</td>
                            <td className="action-buttons">
                              <button
                                onClick={() => approveRequest(r.id)}
                                className="approve-button"
                                aria-label={`Approve request for ${r.username}`}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectRequest(r.id)}
                                className="reject-button"
                                aria-label={`Reject request for ${r.username}`}
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
                <div className="pagination">
                  <button
                    onClick={() => setRequestsPage((prev) => Math.max(prev - 1, 0))}
                    className="pagination-button"
                    disabled={requestsPage === 0 || isLoadingRequests}
                    aria-label="Previous requests page"
                  >
                    Previous
                  </button>
                  <span>Page {requestsPage + 1}</span>
                  <button
                    onClick={() => setRequestsPage((prev) => prev + 1)}
                    className="pagination-button"
                    disabled={!requestsHasMore || isLoadingRequests}
                    aria-label="Next requests page"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <h3 className="section-title">Manage Users</h3>
                {isLoadingUsers ? (
                  <p className="loading">Loading...</p>
                ) : users.length === 0 ? (
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
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td className="font-medium">
                              <Link
                                to={`/admin/user/${u.username}/transactions`}
                                className="username-link"
                                aria-label={`View transactions for ${u.username}`}
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
                                aria-label={
                                  u.suspended
                                    ? `Unsuspend ${u.username}`
                                    : `Suspend ${u.username}`
                                }
                              >
                                {u.suspended ? "Unsuspend" : "Suspend"}
                              </button>
                              <button
                                onClick={() => deleteUser(u.username)}
                                className="delete-button"
                                aria-label={`Delete ${u.username}`}
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
                <div className="pagination">
                  <button
                    onClick={() => setUsersPage((prev) => Math.max(prev - 1, 0))}
                    className="pagination-button"
                    disabled={usersPage === 0 || isLoadingUsers}
                    aria-label="Previous users page"
                  >
                    Previous
                  </button>
                  <span>Page {usersPage + 1}</span>
                  <button
                    onClick={() => setUsersPage((prev) => prev + 1)}
                    className="pagination-button"
                    disabled={!usersHasMore || isLoadingUsers}
                    aria-label="Next users page"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}