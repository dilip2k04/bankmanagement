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

  const suspendUser = async (username) => {
    await api.put(`/admin/user/${username}/suspend`);
    fetchUsers();
  };

  const deleteUser = async (username) => {
    await api.delete(`/admin/user/${username}`);
    fetchUsers();
  };

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <h3 className="font-bold">Manage Users</h3>
        <table className="w-full border mt-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Balance</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="text-center">
                <td className="border p-2">{u.username}</td>
                <td className="border p-2">{u.role}</td>
                <td className="border p-2">₹{u.balance}</td>
                <td className="border p-2">{u.suspended ? "Suspended" : "Active"}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => suspendUser(u.username)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Suspend
                  </button>
                  <button
                    onClick={() => deleteUser(u.username)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
