import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [toUser, setToUser] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
    else fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const bal = await api.get(`/balance/${user.username}`);
      setBalance(bal.data);

      const tx = await api.get(`/transactions/${user.username}`);
      setTransactions(tx.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleTransfer = async () => {
    if (!toUser || !amount || amount <= 0) {
      alert("Enter valid username and amount");
      return;
    }

    try {
      await api.post("/transfer", null, {
        params: { from: user.username, to: toUser, amount },
      });
      alert("Transfer successful");
      setToUser("");
      setAmount("");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Transfer failed");
    }
  };

  const downloadCSV = () => {
    const csvHeader = "From,To,Amount,Date\n";
    const csvRows = transactions
      .map(
        (t) =>
          `${t.fromUser},${t.toUser},${t.amount},${new Date(
            t.date
          ).toLocaleString()}`
      )
      .join("\n");
    const csvContent = csvHeader + csvRows;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">Welcome {user?.username}</h2>
        <p className="mb-4">Balance: ₹{balance.toFixed(2)}</p>

        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-bold mb-2">Transfer Money</h3>
          <input
            type="text"
            placeholder="To Username"
            className="border p-2 mr-2"
            value={toUser}
            onChange={(e) => setToUser(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            className="border p-2 mr-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            onClick={handleTransfer}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Transfer
          </button>
        </div>

        <button
          onClick={downloadCSV}
          className="mb-4 bg-green-600 text-white py-2 px-4 rounded"
        >
          Download Transactions CSV
        </button>

        <h3 className="font-bold mb-2">Transactions</h3>
        <ul className="space-y-2">
          {transactions.map((t) => (
            <li key={t.id} className="border p-2 rounded bg-white">
              {t.fromUser} → {t.toUser} : ₹{t.amount.toFixed(2)} (
              {new Date(t.date).toLocaleString()})
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
