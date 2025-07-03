import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import styles from "./AddAuctionPage.module.css";

export default function AddAuctionPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startingBid: "", // Will handle this correctly below
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // ✅ Handles text input fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 👇 Make sure startingBid stays a number
    if (name === "startingBid") {
      setForm({ ...form, [name]: value.replace(/[^0-9]/g, "") });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ Handles file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);

    // 👇 Ensure startingBid is a real number (send as string is fine with FormData)
    formData.append("startingBid", Number(form.startingBid));

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
      alert("Failed to create auction: " + (err.response?.data?.message || err.message));
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
          min="0"
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
