import { useState } from "react";
import axios from "axios";

const BannerForm = ({ token }) => {
  const [form, setForm] = useState({
    title: "",
    banner: null,
    position: "",
    bannerUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));

    try {
      setLoading(true);

      const res = await axios.post(
        "/api/v1/createBanner",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
      alert("Banner created successfully");

    } catch (err) {
      setLoading(false);
      alert("Failed to create banner");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Festival Discount Banner
        </h2>

        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter banner title"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Banner */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Banner</label>
          <input
            type="file"
            name="banner"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 cursor-pointer"
          />
        </div>

        {/* Position */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Position
          </label>
          <select
            name="position"
            value={form.position}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Position</option>
            <option value="horizontal_1">Horizontal 1</option>
            <option value="horizontal_2">Horizontal 2</option>
            <option value="vertical_1">Vertical 1</option>
            <option value="vertical_2">Vertical 2</option>
          </select>
        </div>

        {/* Banner URL */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Banner URL
          </label>
          <input
            type="text"
            name="bannerUrl"
            value={form.bannerUrl}
            onChange={handleChange}
            placeholder="https://example.com/banner"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-medium py-2 rounded-lg transition ${
            loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default BannerForm;
