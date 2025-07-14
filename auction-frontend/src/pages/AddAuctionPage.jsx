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
    endTime: "",
  });

  const [image, setImage] = useState(null); // ✅ SINGLE image only
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
    } else {
      alert("Please select an image.");
      return;
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
      console.error(err);
      alert(
        "Failed to create auction: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formBox}>
        <h2>Create New Auction</h2>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <textarea
          name="description"
          placeholder="Short Description"
          value={form.description}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <textarea
          name="details"
          placeholder="Full Details"
          value={form.details}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="Live">Live</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Closed">Closed</option>
        </select>

        <input
          name="startingBid"
          type="number"
          placeholder="Starting Bid (₹)"
          value={form.startingBid}
          onChange={handleChange}
          required
          min="0"
          className={styles.input}
        />

        <input
          name="condition"
          placeholder="Condition"
          value={form.condition}
          onChange={handleChange}
          className={styles.input}
        />

        <input
          name="warranty"
          placeholder="Warranty"
          value={form.warranty}
          onChange={handleChange}
          className={styles.input}
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className={styles.input}
        />

        <input
          name="contactInfo"
          placeholder="Contact Info"
          value={form.contactInfo}
          onChange={handleChange}
          className={styles.input}
        />

        <label>End Time:</label>
        <input
          name="endTime"
          type="datetime-local"
          value={form.endTime}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          className={styles.input}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className={styles.preview}
          />
        )}

        <button type="submit" className={styles.button}>
          Create Auction
        </button>
      </form>
    </div>
  );
}
