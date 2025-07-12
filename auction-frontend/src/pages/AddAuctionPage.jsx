import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import styles from "./AddAuctionPage.module.css";

export default function AddAuctionPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    details: "",
    status: "Live",
    startingBid: "",
    condition: "",
    warranty: "",
    location: "",
    contactInfo: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startingBid") {
      setForm({ ...form, [name]: value.replace(/[^0-9]/g, "") });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      await api.post("/auction", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/dashboard");
    } catch (err) {
      alert(
        "Failed to create auction: " +
          (err.response?.data?.message || err.message)
      );
      console.error("❌ Create auction error:", err.response?.data || err.message);
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

        <textarea
          name="description"
          className={styles.input}
          placeholder="Short Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <textarea
          name="details"
          className={styles.input}
          placeholder="Full Product Details"
          value={form.details}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          className={styles.input}
          value={form.status || "Live"}
          onChange={handleChange}
       >
       <option value="Live">Live</option>
       <option value="Upcoming">Upcoming</option>
       <option value="Closed">Closed</option>
       </select>

        <input
          name="startingBid"
          className={styles.input}
          type="number"
          placeholder="Starting Bid (₹)"
          value={form.startingBid}
          onChange={handleChange}
          required
          min="0"
        />

        <input
          name="condition"
          className={styles.input}
          placeholder="Condition (e.g., New, Used)"
          value={form.condition}
          onChange={handleChange}
        />

        <input
          name="warranty"
          className={styles.input}
          placeholder="Warranty Details"
          value={form.warranty}
          onChange={handleChange}
        />

        <input
          name="location"
          className={styles.input}
          placeholder="Product Location"
          value={form.location}
          onChange={handleChange}
        />

        <input
          name="contactInfo"
          className={styles.input}
          placeholder="Contact Information"
          value={form.contactInfo}
          onChange={handleChange}
        />

        <input
          type="file"
          accept="image/*"
          className={styles.input}
          onChange={handleImageChange}
          required
        />

        {preview && (
          <img src={preview} alt="Preview" className={styles.preview} />
        )}

        <button type="submit" className={styles.button}>
          Create Auction
        </button>
      </form>
    </div>
  );
}
