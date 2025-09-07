import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function AdminPanel() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") navigate("/");
    else fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  };

  const toggleSuspendUser = async (username, suspended) => {
    if (suspended) {
      // unsuspend
      await api.put(`/admin/user/${username}/unsuspend`);
    } else {
      // suspend
      await api.put(`/admin/user/${username}/suspend`);
    }
    fetchUsers();
  };

  const deleteUser = async (username) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await api.delete(`/admin/user/${username}`);
      fetchUsers();
    }
  };

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Panel</h2>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Manage Users</h3>

          {users.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 text-left border">Username</th>
                    <th className="p-3 text-left border">Role</th>
                    <th className="p-3 text-left border">Balance</th>
                    <th className="p-3 text-left border">Status</th>
                    <th className="p-3 text-left border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr
                      key={u.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="p-3 border">{u.username}</td>
                      <td className="p-3 border">{u.role}</td>
                      <td className="p-3 border">₹{u.balance}</td>
                      <td
                        className={`p-3 border font-medium ${
                          u.suspended ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {u.suspended ? "Suspended" : "Active"}
                      </td>
                      <td className="p-3 border space-x-2">
                        <button
                          onClick={() =>
                            toggleSuspendUser(u.username, u.suspended)
                          }
                          className={`px-3 py-1 rounded text-white ${
                            u.suspended
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-yellow-500 hover:bg-yellow-600"
                          }`}
                        >
                          {u.suspended ? "Unsuspend" : "Suspend"}
                        </button>
                        <button
                          onClick={() => deleteUser(u.username)}
                          className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
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
      </div>
    </>
  );
}
