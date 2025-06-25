import { useEffect, useState } from "react";
import api from "../axios";

export default function Dashboard() {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await api.get("/auction");
        console.log("Fetched auction:", res.data); 
        setAuctions(res.data.auctions); 
      } catch (err) {
        console.error("❌ Error fetching auction:", err);
      }
      
    };
    fetchAuctions();
  }, []);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🏷️ All Auctions</h1>
      <div style={styles.grid}>
  {Array.isArray(auctions) ? (
    auctions.map((auction) => (
      <div key={auction._id} style={styles.card}>
        <h2>{auction.title}</h2>
        <p>{auction.description}</p>
        <p><strong>Starting Price:</strong> ₹{auction.startingPrice}</p>
        {auction.imageUrl && (
          <img
            src={auction.imageUrl}
            alt={auction.title}
            style={{ width: "100%", borderRadius: "6px", marginTop: "10px" }}
          />
        )}
        <p style={styles.owner}>
          🔗 Posted by: {auction.createdBy?.name || "Unknown"}
        </p>
      </div>
    ))
  ) : (
    <p>Loading or no auctions found.</p>
  )}
</div>

    </div>
  );
}

const styles = {
  page: {
    padding: "40px",
    fontFamily: "Segoe UI, sans-serif",
    background: "linear-gradient(to right, #fceabb, #f8b500)",
    minHeight: "100vh",
  },
  title: {
    fontSize: "32px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  owner: {
    marginTop: "10px",
    fontStyle: "italic",
    fontSize: "14px",
    color: "#555",
  },
};
