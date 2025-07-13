import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axios";
import styles from "./AuctionDetail.module.css";
import formatTimeRemaining from "../utils/formatTimeRemaining";


export default function AuctionDetail() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await api.get(`/auction/${id}`);
        setAuction(res.data.auction);
      } catch (err) {
        console.error("Error fetching auction:", err);
      }
    };
    fetchAuction();
  }, [id]);

  if (!auction) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.detailWrapper}>
      <h1>{auction.title}</h1>
      <p>{auction.description}</p>
      <p><strong>Current Bid:</strong> ₹{auction.highestBid || auction.startingBid}</p>

      {auction.imageUrl && (
        <img
          src={`http://localhost:5050/${auction.imageUrl}`}
          alt={auction.title}
          className={styles.detailImage}
        />
      )}

      <div className={styles.extraDetails}>
        <p><strong>Full Details:</strong> {auction.details}</p>
        <p><strong>Condition:</strong> {auction.condition}</p>
        <p><strong>Warranty:</strong> {auction.warranty}</p>
        <p><strong>Location:</strong> {auction.location}</p>
        <p><strong>Contact Info:</strong> {auction.contactInfo}</p>
        <p><strong>Ends in:</strong> {formatTimeRemaining(auction.endTime)}</p>

      </div>

      {auction.bids && auction.bids.length > 0 && (
        <div className={styles.bidHistory}>
          <h3>Bid History 🕒</h3>
          <ul>
            {auction.bids.map((bid) => (
              <li key={bid._id}>
                ₹{bid.amount} by {bid.user?.name || "Anonymous"} at{" "}
                {new Date(bid.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
