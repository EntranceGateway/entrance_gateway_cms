import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import { getAdmissionById } from "@/http/admission";
import { PulseLoader } from "@/components/loaders";
import { Calendar, Mail, Phone, GraduationCap, Building2, User, FileText, ArrowLeft } from "lucide-react";

const ViewAdmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmission = async () => {
      try {
        const res = await getAdmissionById(id);
        const data = res.data?.data || res.data;
        setAdmission(data);
      } catch (err) {
        setError(err.error || "Failed to load admission details");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmission();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      APPLIED: "bg-blue-100 text-blue-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      ENROLLED: "bg-indigo-100 text-indigo-800",
      REJECTED: "bg-red-100 text-red-800",
      WITHDRAWN: "bg-gray-100 text-gray-800",
      ON_CONTACT: "bg-purple-100 text-purple-800",
      OUT_OF_CONTACT: "bg-orange-100 text-orange-800",
      UNDER_REVIEW: "bg-cyan-100 text-cyan-800",
      DOCUMENTS_PENDING: "bg-amber-100 text-amber-800",
      INTERVIEW_SCHEDULED: "bg-teal-100 text-teal-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <PulseLoader />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
          <h3 className="font-semibold text-lg mb-1">Error Loading Admission</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate("/admin/admission")}
            className="mt-4 text-sm font-medium underline text-red-800 hover:text-red-900"
          >
            Go back to Admissions
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-in fade-in duration-500">
        <PageHeader
          title="Admission Details"
          subtitle={admission?.applicantName}
          breadcrumbs={[
            { label: "Admissions", to: "/admin/admission" },
            { label: "View Details" },
          ]}
          icon={GraduationCap}
          actions={[
            {
              label: "Back",
              icon: <ArrowLeft size={16} />,
              onClick: () => navigate("/admin/admission"),
              variant: "secondary",
            },
          ]}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Status Badge */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Application #{admission?.admissionId}
                </h2>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusBadge(
                    admission?.status
                  )}`}
                >
                  {admission?.status?.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 space-y-8">
            {/* Applicant Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-indigo-600" />
                Applicant Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6">
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Full Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {admission?.applicantName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    User ID
                  </label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {admission?.userId} - {admission?.userName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <Mail size={14} /> Email
                  </label>
                  <p className="text-lg text-gray-900 mt-1">{admission?.applicantEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <Phone size={14} /> Phone
                  </label>
                  <p className="text-lg text-gray-900 mt-1">{admission?.applicantPhone}</p>
                </div>
              </div>
            </div>

            {/* Course & College Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap size={20} className="text-indigo-600" />
                Course & College
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6">
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Course
                  </label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {admission?.courseName}
                  </p>
                  <p className="text-sm text-gray-500">ID: {admission?.courseId}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <Building2 size={14} /> College
                  </label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {admission?.collegeName}
                  </p>
                  <p className="text-sm text-gray-500">ID: {admission?.collegeId}</p>
                </div>
              </div>
            </div>

            {/* Application Timeline */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-indigo-600" />
                Timeline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 rounded-xl p-6">
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Application Date
                  </label>
                  <p className="text-lg text-gray-900 mt-1">
                    {formatDate(admission?.applicationDate)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Approval Date
                  </label>
                  <p className="text-lg text-gray-900 mt-1">
                    {formatDate(admission?.approvalDate)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Enrollment Date
                  </label>
                  <p className="text-lg text-gray-900 mt-1">
                    {formatDate(admission?.enrollmentDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-indigo-600" />
                Additional Information
              </h3>
              <div className="space-y-4 bg-gray-50 rounded-xl p-6">
                {admission?.previousEducation && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Previous Education
                    </label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                      {admission.previousEducation}
                    </p>
                  </div>
                )}
                {admission?.reasonForApplication && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Reason for Application
                    </label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                      {admission.reasonForApplication}
                    </p>
                  </div>
                )}
                {admission?.referredBy && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Referred By
                    </label>
                    <p className="text-gray-900 mt-1">{admission.referredBy}</p>
                  </div>
                )}
                {admission?.remarks && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Admin Remarks
                    </label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">{admission.remarks}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-semibold">Created:</span> {formatDate(admission?.createdAt)}
                </div>
                <div>
                  <span className="font-semibold">Last Updated:</span>{" "}
                  {formatDate(admission?.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewAdmission;
