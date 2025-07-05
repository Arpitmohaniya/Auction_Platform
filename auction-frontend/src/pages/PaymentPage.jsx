import { useState } from "react";
import styles from "./PaymentPage.module.css";

export default function PaymentPage() {
  const [method, setMethod] = useState("card");
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");

  const handleCardChange = (e) => {
    setCardForm({ ...cardForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Payment done via ${method.toUpperCase()} ✅ (This is a demo)`);
  };

  return (
    <div className={styles.paymentWrapper}>
      <div className={styles.paymentContainer}>
        <h1 className={styles.title}>💳 Complete Your Payment</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${method === "card" ? styles.activeTab : ""}`}
            onClick={() => setMethod("card")}
          >
            Card
          </button>
          <button
            className={`${styles.tab} ${method === "upi" ? styles.activeTab : ""}`}
            onClick={() => setMethod("upi")}
          >
            UPI
          </button>
          <button
            className={`${styles.tab} ${method === "netbanking" ? styles.activeTab : ""}`}
            onClick={() => setMethod("netbanking")}
          >
            Net Banking
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {method === "card" && (
            <>
              <div className={styles.formGroup}>
                <label>Card Number</label>
                <input
                  name="cardNumber"
                  placeholder="xxxx xxxx xxxx xxxx"
                  value={cardForm.cardNumber}
                  onChange={handleCardChange}
                  required
                />
              </div>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Expiry</label>
                  <input
                    name="expiry"
                    placeholder="MM/YY"
                    value={cardForm.expiry}
                    onChange={handleCardChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>CVV</label>
                  <input
                    name="cvv"
                    type="password"
                    placeholder="***"
                    value={cardForm.cvv}
                    onChange={handleCardChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Name on Card</label>
                <input
                  name="nameOnCard"
                  placeholder="Full Name"
                  value={cardForm.nameOnCard}
                  onChange={handleCardChange}
                  required
                />
              </div>
            </>
          )}

          {method === "upi" && (
            <div className={styles.formGroup}>
              <label>UPI ID</label>
              <input
                name="upiId"
                placeholder="example@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
              />
            </div>
          )}

          {method === "netbanking" && (
            <div className={styles.formGroup}>
              <label>Bank Name</label>
              <input
                name="bank"
                placeholder="Bank Name"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className={styles.payButton}>
            💸 Pay Now
          </button>
        </form>

        <p className={styles.note}>🔒 100% Secure Payment Gateway</p>
      </div>
    </div>
  );
}
