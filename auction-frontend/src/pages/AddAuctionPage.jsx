import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import styles from "./AddAuctionPage.module.css";

export default function AddAuctionPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startingBid: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/auction", 
        {
          title: form.title,
          description: form.description,
          startingBid: parseFloat(form.startingBid),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ use "Bearer <token>"
          },
        }
      );

      alert("Auction created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Create auction error:", err.response?.data || err.message);
      alert("Failed to create auction: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formBox}>
        <h2 className={styles.h2}>Create New Auction</h2>

        <input
          name="title"
          className={styles.input}
          placeholder="Auction Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          className={styles.input}
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="startingBid"
          className={styles.input}
          type="number"
          placeholder="Starting Bid"
          value={form.startingBid}
          onChange={handleChange}
          required
        />
        <button type="submit" className={styles.button}>
          Create Auction
        </button>
      </form>
    </div>
  );
}
