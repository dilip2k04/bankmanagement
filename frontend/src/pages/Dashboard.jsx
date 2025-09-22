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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
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
    const csvRows = filteredTransactions
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

  // Search and Filter Logic
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.fromUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.toUser.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "sent" && t.fromUser === user.username) ||
      (filterType === "received" && t.toUser === user.username);
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <style>
        {`
          .dashboard {
            min-height: 100vh;
            background: linear-gradient(to bottom right, #e0e7ff, #f3e8ff);
            padding: 1.5rem;
          }

          .container {
            max-width: 1280px;
            margin: 0 auto;
          }

          .welcome-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
          }

          .balance {
            font-size: 1.25rem;
            color: #374151;
            margin-bottom: 1.5rem;
          }

          .transfer-section {
            background: #ffffff;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .section-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 1rem;
          }

          .transfer-form {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .transfer-input {
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            outline: none;
            transition: all 0.2s ease;
            flex: 1;
            min-width: 150px;
          }

          .transfer-input:focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.5);
          }

          .transfer-button {
            padding: 0.75rem 1.5rem;
            background: #2563eb;
            color: #ffffff;
            font-size: 1rem;
            font-weight: 500;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .transfer-button:hover {
            background: #1d4ed8;
            transform: scale(1.05);
          }

          .download-button {
            padding: 0.75rem 1.5rem;
            background: #16a34a;
            color: #ffffff;
            font-size: 1rem;
            font-weight: 500;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            margin-bottom: 1.5rem;
            transition: all 0.2s ease;
          }

          .download-button:hover {
            background: #15803d;
            transform: scale(1.05);
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
              gap: 1rem;
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

          .transactions-list {
            list-style: none;
            padding: 0;
          }

          .transaction-item {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-bottom: 0.5rem;
            transition: background 0.2s ease;
          }

          .transaction-item:hover {
            background: #e0e7ff;
          }

          .no-transactions {
            text-align: center;
            color: #6b7280;
            font-size: 1.125rem;
            padding: 1.5rem;
          }

          @media (max-width: 640px) {
            .dashboard {
              padding: 1rem;
            }

            .welcome-title {
              font-size: 1.5rem;
            }

            .balance {
              font-size: 1rem;
            }

            .section-title {
              font-size: 1.125rem;
            }

            .transfer-input {
              padding: 0.5rem;
              font-size: 0.875rem;
            }

            .transfer-button,
            .download-button {
              padding: 0.5rem 1rem;
              font-size: 0.875rem;
            }
          }
        `}
      </style>

      <Navbar user={user} setUser={setUser} />
      <div className="dashboard">
        <div className="container">
          <h2 className="welcome-title">Welcome {user?.username}</h2>
          <p className="balance">Balance: ₹{balance.toFixed(2)}</p>

          <div className="transfer-section">
            <h3 className="section-title">Transfer Money</h3>
            <div className="transfer-form">
              <input
                type="text"
                placeholder="To Username"
                className="transfer-input"
                value={toUser}
                onChange={(e) => setToUser(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                className="transfer-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button onClick={handleTransfer} className="transfer-button">
                Transfer
              </button>
            </div>
          </div>

          <button onClick={downloadCSV} className="download-button">
            Download Transactions CSV
          </button>

          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Transactions</option>
                <option value="sent">Sent</option>
                <option value="received">Received</option>
              </select>
              {(searchQuery || filterType !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterType("all");
                  }}
                  className="clear-button"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <h3 className="section-title">Transactions</h3>
          {filteredTransactions.length === 0 ? (
            <p className="no-transactions">No transactions match the criteria.</p>
          ) : (
            <ul className="transactions-list">
              {filteredTransactions.map((t) => (
                <li key={t.id} className="transaction-item">
                  {t.fromUser} → {t.toUser} : ₹{t.amount.toFixed(2)} (
                  {new Date(t.date).toLocaleString()})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}