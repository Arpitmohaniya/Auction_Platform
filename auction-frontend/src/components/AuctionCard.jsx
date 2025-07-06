import styles from "./AuctionCard.module.css";

export default function AuctionCard({ auction, handleBid, handlePay }) {
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
      <p>
        <strong>Current Bid:</strong> ₹
        {auction.highestBid > 0 ? auction.highestBid : auction.startingBid}
      </p>
      
      <div className={styles.buttonContainer}>
        <button
          className={styles.bidButton}
          onClick={() => handleBid(auction._id)}
        >
          Place Bid
        </button>

        <button
          className={styles.payButton}
          onClick={() => handlePay(auction._id)}
        >
          Make Payment
        </button>
      </div>
    </div>
  );
}
