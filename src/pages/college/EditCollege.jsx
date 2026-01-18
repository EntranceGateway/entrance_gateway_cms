import CollegeForm from "./components/form/Form";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSingle, updateColleges } from "../../http/colleges";
import Layout from "@/components/layout/Layout";
import toast from "react-hot-toast";

function EditCollege() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [collegeData, setCollegeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch single college
  const fetchCollege = async () => {
    try {
      const response = await getSingle(id);
      if (response.status === 200) {
        setCollegeData(response.data.data);
      } else {
        setError("College not found");
        toast.error("College not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch college data");
      toast.error("Failed to fetch college data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollege();
  }, [id]);

  // Handle form submission (edit mode supports logo/images update)
  const handleUpdate = async (formData, logo, images, existingLogoUrl, existingImageUrls) => {
    try {
      const res = await updateColleges(id, formData, logo, images, existingLogoUrl, existingImageUrls);
      if (res.status === 200) {
        toast.success("College updated successfully!");
        // Navigate back to college list after short delay
        setTimeout(() => {
          navigate("/college/all");
        }, 1500);
      } else {
        toast.error("Failed to update college");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating college");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading college data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <button
              onClick={() => navigate("/college/all")}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Back to Colleges
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <CollegeForm
        mode="edit"
        initialData={collegeData}
        onSubmit={handleUpdate}
      />
    </Layout>
  );
}

export default EditCollege