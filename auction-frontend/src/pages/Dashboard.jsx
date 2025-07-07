import { useEffect, useState } from "react";
import api from "../axios";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [auctions, setAuctions] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await api.get("/auction");
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

  const handleDelete = async (id, e) => {
    e.stopPropagation();
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
  };

  const handlePay = (auctionId, e) => {
    e.stopPropagation();
    navigate("/payment");
  };

  const handleBid = async (auctionId, e) => {
    e.stopPropagation();
    const bidAmount = parseFloat(prompt("Enter your bid amount:"));
    if (isNaN(bidAmount)) {
      alert("Invalid bid amount!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        `/auction/${auctionId}/bid`,
        { bidAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);

      const updated = await api.get("/auction");
      setAuctions(updated.data.auctions);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Bid failed");
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Navbar with drawer toggle */}
      <nav className={styles.navbar}>
        <button className={styles.toggleBtn} onClick={() => setDrawerOpen(true)}>
          ☰
        </button>
      </nav>

      {/* Drawer */}
      <div className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}>
        <button className={styles.closeBtn} onClick={() => setDrawerOpen(false)}>
          ✖
        </button>
        <h3 className={styles.drawerTitle}>Dashboard Menu</h3>
        <ul className={styles.menuList}>
          <li>
            <a href="/dashboard" onClick={() => setDrawerOpen(false)}>🏠 Home</a>
          </li>
          <li>
            <a href="/payment" onClick={() => setDrawerOpen(false)}>💳 Payment</a>
          </li>
          <li>
            <a href="/add" onClick={() => setDrawerOpen(false)}>➕ Add Auction</a>
          </li>
          <li>
            <a href="/" onClick={() => setDrawerOpen(false)}>🔒 Logout</a>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className={drawerOpen ? `${styles.page} ${styles.pageShift}` : styles.page}>
        <h1 className={styles.title}>🏷️ All Auctions</h1>

        <div className={styles.grid}>
          {auctions.length ? (
            auctions.map((auction) => (
              <div
                key={auction._id}
                className={styles.card}
                onClick={() => navigate(`/auction/${auction._id}`)}
                style={{ cursor: "pointer" }}
              >
                <h2>{auction.title}</h2>
                <p>{auction.description}</p>
                <p>
                  <strong>Current Bid:</strong> ₹{auction.highestBid || auction.startingBid}
                </p>

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

                <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                  <button className={styles.bidButton} onClick={(e) => handleBid(auction._id, e)}>
                    Place Bid
                  </button>
                  <button className={styles.payButton} onClick={(e) => handlePay(auction._id, e)}>
                    Pay
                  </button>
                  {isAdmin && (
                    <button className={styles.deleteButton} onClick={(e) => handleDelete(auction._id, e)}>
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
