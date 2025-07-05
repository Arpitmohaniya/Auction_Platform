import { useEffect, useState } from "react";
import api from "../axios";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [auctions, setAuctions] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate(); // ✅ For navigation

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await api.get("/auction");
        console.log("Fetched auctions:", res.data.auctions);
        setAuctions(res.data.auctions);

        const token = localStorage.getItem("token");
        if (token) {
          const userRes = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (userRes.data.user.role === "admin") {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        console.error("❌ Error fetching auctions:", err);
      }
    };
    fetchAuctions();
  }, []);

  // ✅ Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this auction?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/auction/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuctions(auctions.filter((a) => a._id !== id));
    } catch (err) {
      console.error("❌ Error deleting auction:", err);
    }
    console.log("📦 Token in localStorage:", localStorage.getItem("token"));
  };

  // ✅ Pay handler
  const handlePay = (auctionId) => {
    navigate("/payment");
  };

  return (
    <div className={styles.wrapper}>
      {/* Drawer */}
      <div
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
      >
        <button className={styles.closeBtn} onClick={() => setDrawerOpen(false)}>
          ✖
        </button>
        <h3 className={styles.drawerTitle}>Dashboard Menu</h3>
        <ul className={styles.menuList}>
          <li>
            <a href="/dashboard" onClick={() => setDrawerOpen(false)}>
              🏠 Home
            </a>
          </li>
          <li>
            <a href="/payment" onClick={() => setDrawerOpen(false)}>
              💳 Payment
            </a>
          </li>
          <li>
            <a href="/" onClick={() => setDrawerOpen(false)}>
              🔒 Logout
            </a>
          </li>
        </ul>
      </div>

      {/* Toggle Drawer Button */}
      <button className={styles.toggleBtn} onClick={() => setDrawerOpen(true)}>
        ☰
      </button>

      {/* Page content */}
      <div className={drawerOpen ? `${styles.page} ${styles.pageShift}` : styles.page}>
        <h1 className={styles.title}>🏷️ All Auctions</h1>

        <div className={styles.grid}>
          {auctions.length ? (
            auctions.map((auction) => (
              <div key={auction._id} className={styles.card}>
                <h2>{auction.title}</h2>
                <p>{auction.description}</p>
                <p><strong>Starting Bid:</strong> ₹{auction.startingBid}</p>

                {auction.imageUrl && (
                  <img
                    src={`http://localhost:5050/${auction.imageUrl.replace(/^\/+/, "")}`}
                    alt={auction.title}
                    className={styles.image}
                  />
                )}

                <p className={styles.owner}>
                  🔗 Posted by: {auction.createdBy?.name || "Unknown"}
                </p>

                <div className={styles.actions}>
                  <button className={styles.bidButton}>Place Bid</button>
                  <button
                    className={styles.payButton}
                    onClick={() => handlePay(auction._id)}
                  >
                    Pay
                  </button>
                  {isAdmin && (
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(auction._id)}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No auctions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
