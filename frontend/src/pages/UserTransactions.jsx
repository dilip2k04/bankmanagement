import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function UserTransactions({ user, setUser }) {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 20;
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") navigate("/");
    else fetchTransactions();
  }, [user, navigate, page]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page,
        size: pageSize,
      });
      const res = await api.get(`/transactions/${username}?${params.toString()}`);
      setTransactions(res.data.content || []);
      setHasMore(res.data.content.length === pageSize);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      alert(err.response?.data || "Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCsv = async () => {
    try {
      const response = await api.get(`/transactions/${username}/csv`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${username}_transactions.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading CSV:", err);
      alert(err.response?.data || "Failed to download CSV");
    }
  };

  return (
    <>
      <style>
        {`
          .transactions-page {
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

          .download-button {
            padding: 0.75rem 1.5rem;
            background: #4f46e5;
            color: #ffffff;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 1.5rem;
          }

          .download-button:hover {
            background: #4338ca;
            transform: scale(1.05);
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
            .transactions-page {
              padding: 0.5rem;
            }

            .title {
              font-size: 2rem;
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
      <div className="transactions-page">
        <div className="container">
          <h2 className="title">Transactions for {username}</h2>
          <button onClick={downloadCsv} className="download-button" aria-label="Download transactions as CSV">
            Download CSV
          </button>
          {isLoading ? (
            <p className="loading">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="no-data">No transactions found.</p>
          ) : (
            <>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>To</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t.id}>
                        <td>{t.fromUser || "N/A"}</td>
                        <td>{t.toUser || "N/A"}</td>
                        <td>₹{t.amount.toFixed(2)}</td>
                        <td>{new Date(t.date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  className="pagination-button"
                  disabled={page === 0 || isLoading}
                  aria-label="Previous transactions page"
                >
                  Previous
                </button>
                <span>Page {page + 1}</span>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="pagination-button"
                  disabled={!hasMore || isLoading}
                  aria-label="Next transactions page"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}