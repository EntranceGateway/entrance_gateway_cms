import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import { getSingle, getCollegeLogoUrl, getCollegeImageUrl } from "@/http/colleges";
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Edit,
  ArrowLeft,
  ExternalLink,
  Image as ImageIcon,
  GraduationCap,
} from "lucide-react";
import toast from "react-hot-toast";

const ViewCollege = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchCollege();
  }, [id]);

  const fetchCollege = async () => {
    try {
      setLoading(true);
      const response = await getSingle(id);
      if (response.status === 200) {
        setCollege(response.data.data);
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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading college details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !college) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
            <p className="text-red-600 font-semibold mb-4">{error || "College not found"}</p>
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

  const logoUrl = college.logoName ? getCollegeLogoUrl(college.collegeId) : null;
  const imageUrls = college.collegePictureName?.map((imageName) =>
    getCollegeImageUrl(college.collegeId, imageName)
  ) || [];

  const priorityStyles = {
    HIGH: "bg-red-50 text-red-600 border-red-200",
    MEDIUM: "bg-amber-50 text-amber-600 border-amber-200",
    LOW: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  const typeStyles = {
    PRIVATE: "bg-purple-50 text-purple-600 border-purple-200",
    COMMUNITY: "bg-blue-50 text-blue-600 border-blue-200",
    GOVERNMENT: "bg-green-50 text-green-600 border-green-200",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title={college.collegeName}
          subtitle={`Established ${college.establishedYear || "N/A"}`}
          breadcrumbs={[
            { label: "Colleges", to: "/college/all" },
            { label: college.collegeName },
          ]}
          icon={Building2}
          actions={[
            {
              label: "Edit",
              onClick: () => navigate(`/college/edit/${college.collegeId}`),
              icon: <Edit size={18} />,
              variant: "primary",
            },
          ]}
        />

        {/* Hero Section with Logo and Key Info */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            <div className="flex-shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${college.collegeName} logo`}
                  className="w-32 h-32 object-contain bg-white rounded-2xl shadow-md border border-gray-100 p-4"
                  onError={(e) => {
                    console.error('Logo failed to load:', logoUrl);
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3ENo Logo%3C/text%3E%3C/svg%3E";
                  }}
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center flex-col">
                  <Building2 size={48} className="text-gray-400" />
                  <p className="text-xs text-gray-500 mt-2">No Logo</p>
                </div>
              )}
            </div>

            {/* College Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1.5 text-xs font-bold rounded-full border ${
                    priorityStyles[college.priority] || "bg-gray-50 text-gray-600"
                  }`}
                >
                  {college.priority} PRIORITY
                </span>
                <span
                  className={`px-3 py-1.5 text-xs font-bold rounded-full border ${
                    typeStyles[college.collegeType] || "bg-gray-50 text-gray-600"
                  }`}
                >
                  {college.collegeType}
                </span>
                <span className="px-3 py-1.5 text-xs font-bold rounded-full border bg-indigo-50 text-indigo-600 border-indigo-200">
                  {college.affiliation?.replace(/_/g, " ")}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Location</p>
                    <p className="text-sm font-semibold text-gray-900">{college.location}</p>
                  </div>
                </div>

                {college.email && (
                  <div className="flex items-start gap-3">
                    <Mail size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Email</p>
                      <a
                        href={`mailto:${college.email}`}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        {college.email}
                      </a>
                    </div>
                  </div>
                )}

                {college.contact && (
                  <div className="flex items-start gap-3">
                    <Phone size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Contact</p>
                      <p className="text-sm font-semibold text-gray-900">{college.contact}</p>
                    </div>
                  </div>
                )}

                {college.website && (
                  <div className="flex items-start gap-3">
                    <Globe size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Website</p>
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        Visit Website
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                )}

                {college.establishedYear && (
                  <div className="flex items-start gap-3">
                    <Calendar size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Established</p>
                      <p className="text-sm font-semibold text-gray-900">{college.establishedYear}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 size={24} className="text-indigo-600" />
            About {college.collegeName}
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{college.description}</p>
        </div>

        {/* Gallery */}
        {imageUrls.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ImageIcon size={24} className="text-indigo-600" />
              Campus Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(url)}
                >
                  <img
                    src={url}
                    alt={`Campus ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ExternalLink
                      size={24}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses */}
        {college.courses && college.courses.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <GraduationCap size={24} className="text-indigo-600" />
              Available Courses ({college.courses.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {college.courses.map((course) => (
                <div
                  key={course.courseId}
                  className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{course.courseName}</h3>
                      <p className="text-xs text-gray-600 mb-2">{course.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-white text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-200">
                          {course.courseLevel}
                        </span>
                        <span className="px-2 py-0.5 bg-white text-purple-600 text-[10px] font-bold rounded-full border border-purple-200">
                          {course.courseType}
                        </span>
                      </div>
                    </div>
                    <BookOpen size={20} className="text-indigo-600 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/college/all")}
            className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to List
          </button>
          <Link
            to={`/college/${college.collegeId}/courses`}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2"
          >
            <BookOpen size={18} />
            Manage Courses
          </Link>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-900" />
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ViewCollege;
