import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import styles from "./Dashboard.module.css";
import Countdown from "../components/Countdown";

export default function Dashboard() {
  const [auctions, setAuctions] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

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

  // ✅ Confirm before delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this auction?"
    );
    if (!confirmed) return;

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

  const openBidModal = (auction) => {
    setSelectedAuction(auction);
    setBidAmount("");
    setShowBidModal(true);
  };

  const closeBidModal = () => {
    setShowBidModal(false);
    setSelectedAuction(null);
    setBidAmount("");
  };

  const handleBidSubmit = async () => {
    if (!bidAmount || isNaN(bidAmount)) {
      alert("Please enter a valid bid amount.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        `/auction/${selectedAuction._id}/bid`,
        { bidAmount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message);
      closeBidModal();

      const updated = await api.get("/auction");
      setAuctions(updated.data.auctions);
    } catch (err) {
      console.error("❌ Bid Error:", err);
      alert(err.response?.data?.message || "Bid failed");
    }
  };

  const openPaymentModal = (auction) => {
    setSelectedAuction(auction);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedAuction(null);
  };

  const handlePaymentSubmit = () => {
    alert(
      `💸 Payment of ₹${
        selectedAuction?.highestBid || selectedAuction?.startingBid
      } confirmed!`
    );
    closePaymentModal();
  };

  // ✅ Apply filter + sort
  const filteredAuctions = auctions
    .filter((auction) =>
      filterStatus === "All" ? true : auction.status === filterStatus
    )
    .sort((a, b) => {
      if (sortOption === "Highest Bid") {
        const bidA = a.highestBid || a.startingBid;
        const bidB = b.highestBid || b.startingBid;
        return bidB - bidA;
      } else if (sortOption === "Ending Soon") {
        return new Date(a.endTime) - new Date(b.endTime);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
      }
    });

  return (
    <div className={styles.wrapper}>
      <nav className={styles.navbar}>
        <button
          className={styles.toggleBtn}
          onClick={() => setDrawerOpen(true)}
        >
          ☰
        </button>
      </nav>

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
            <a href="/add" onClick={() => setDrawerOpen(false)}>
              ➕ Add Auction
            </a>
          </li>
          <li>
            <a href="/" onClick={() => setDrawerOpen(false)}>
              🔒 Logout
            </a>
          </li>
        </ul>
      </div>

      <div
        className={drawerOpen ? `${styles.page} ${styles.pageShift}` : styles.page}
      >
        <h1 className={styles.title}>🏷️ All Auctions</h1>

        <div className={styles.controls}>
          <label>
            Filter:
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.select}
            >
              <option value="All">All</option>
              <option value="Live">Live</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Closed">Closed</option>
            </select>
          </label>

          <label>
            Sort:
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className={styles.select}
            >
              <option value="Newest">Newest</option>
              <option value="Highest Bid">Highest Bid</option>
              <option value="Ending Soon">Ending Soon</option>
            </select>
          </label>
        </div>

        <div className={styles.grid}>
          {filteredAuctions.length ? (
            filteredAuctions.map((auction) => (
              <div
                key={auction._id}
                className={styles.card}
                onClick={() => navigate(`/auction/${auction._id}`)}
              >
                <div
                  className={`${styles.status} ${
                    auction.status === "Live"
                      ? styles.live
                      : auction.status === "Upcoming"
                      ? styles.upcoming
                      : styles.closed
                  }`}
                >
                  {auction.status}
                </div>

                <h2 className={styles.cardTitle}>{auction.title}</h2>
                <p className={styles.cardDescription}>{auction.description}</p>
                <p className={styles.cardBid}>
                  <strong>Current Bid:</strong> ₹
                  {auction.highestBid || auction.startingBid}
                </p>
                <p className={styles.cardTime}>
                  ⏰ Ends in: <Countdown endTime={auction.endTime} />
                </p>

                {auction.imageUrl && (
                  <img
                    src={`http://localhost:5050/${auction.imageUrl.replace(
                      /^\/+/,
                      ""
                    )}`}
                    alt={auction.title}
                    className={styles.cardImage}
                  />
                )}

                <p className={styles.owner}>
                  🔗 Posted by: {auction.createdBy?.name || "Unknown"}
                </p>

                <div
                  className={styles.actions}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={styles.bidButton}
                    onClick={() => openBidModal(auction)}
                  >
                    Place Bid
                  </button>

                  <button
                    className={styles.payButton}
                    onClick={() => openPaymentModal(auction)}
                  >
                    Pay
                  </button>

                  {isAdmin && (
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(auction._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <h2>No auctions yet 🗂️</h2>
              <p>There are no auctions right now — add one to get started!</p>
              <button
                className={styles.addAuctionBtn}
                onClick={() => navigate("/add")}
              >
                ➕ Add Auction
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals same as before */}
      {showBidModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>Place Bid for {selectedAuction?.title}</h3>
            <p>
              Current: ₹
              {selectedAuction?.highestBid || selectedAuction?.startingBid}
            </p>
            <input
              type="number"
              placeholder="Your bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className={styles.input}
            />
            <div className={styles.modalActions}>
              <button
                onClick={handleBidSubmit}
                className={styles.confirmButton}
              >
                Confirm Bid
              </button>
              <button
                onClick={closeBidModal}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>💳 Pay for {selectedAuction?.title}</h3>
            <p>
              Amount: ₹
              {selectedAuction?.highestBid || selectedAuction?.startingBid}
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={handlePaymentSubmit}
                className={styles.confirmButton}
              >
                Confirm Payment
              </button>
              <button
                onClick={closePaymentModal}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
