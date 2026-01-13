import { useState } from "react";
import axios from "axios";
import { FolderKanban, FileText } from "lucide-react";

const CategoryForm = ({ token }) => {
  const [form, setForm] = useState({
    categoryName: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "/api/v1/createCategory",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Category created successfully");
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to create category");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Create Category
        </h2>

        {/* Category Name */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
            <FolderKanban size={20} className="text-blue-600" />
            Category Name
          </label>

          <input
            type="text"
            name="categoryName"
            value={form.categoryName}
            onChange={handleChange}
            placeholder="Enter category name"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Remarks */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
            <FileText size={20} className="text-blue-600" />
            Remarks
          </label>

          <textarea
            name="remarks"
            rows={3}
            value={form.remarks}
            onChange={handleChange}
            placeholder="Enter remarks or description"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
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

export default CategoryForm;
