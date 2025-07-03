import styles from "./AuctionCard.module.css";

export default function AuctionCard({ auction }) {
  return (
    <div className={styles.card}>
      {/* ✅ Show uploaded image if it exists */}
    {auction.imageUrl && (
  <img
    src={`http://localhost:5050/${auction.imageUrl}`}
    alt={auction.title}
    className={styles.image}
  />
)}

      <h3>{auction.title}</h3>
      <p>{auction.description}</p>
      <p><strong>Starting Bid:</strong> ₹{auction.startingBid}</p>

      <div className={styles.buttonContainer}>
        <button className={styles.bidButton}>Place Bid</button>
        <button className={styles.payButton}>Make Payment</button>
      </div>
    </div>
  );
}
