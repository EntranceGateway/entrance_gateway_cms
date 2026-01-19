import { useParams, useNavigate } from "react-router-dom";
import { useContactMessage, useDeleteContactMessage } from "@/hooks/useContactUs";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useState } from "react";
import { Mail, Phone, User, MessageSquare, ArrowLeft, Trash2, Tag } from "lucide-react";

const ViewContactMessage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: message, isLoading, error } = useContactMessage(id);
  const deleteMutation = useDeleteContactMessage();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      navigate("/admin/contact-us");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const getSubjectBadge = (subject) => {
    const styles = {
      GENERAL_INQUIRY: "bg-blue-50 text-blue-600 border-blue-200",
      TECHNICAL_SUPPORT: "bg-red-50 text-red-600 border-red-200",
      BILLING_ISSUES: "bg-amber-50 text-amber-600 border-amber-200",
      FEEDBACK_SUGGESTIONS: "bg-green-50 text-green-600 border-green-200",
      COURSE_INFORMATION: "bg-indigo-50 text-indigo-600 border-indigo-200",
      COLLABORATION_OPPORTUNITIES: "bg-purple-50 text-purple-600 border-purple-200",
      OTHER: "bg-gray-50 text-gray-600 border-gray-200",
    };
    return styles[subject] || styles.OTHER;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading message details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !message) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
            <p className="text-red-600 font-semibold mb-4">{error?.message || "Message not found"}</p>
            <button
              onClick={() => navigate("/admin/contact-us")}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Back to Messages
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Contact Message Details"
          breadcrumbs={[
            { label: "Contact Us", to: "/admin/contact-us" },
            { label: "Message Details" },
          ]}
          icon={MessageSquare}
          actions={[
            {
              label: "Delete",
              onClick: () => setShowDeleteModal(true),
              icon: <Trash2 size={18} />,
              variant: "danger",
            },
          ]}
        />

        {/* Message Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {/* Header with Subject */}
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <Tag size={24} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Subject</h2>
                <span className={`px-3 py-1.5 text-sm font-bold rounded-full border ${getSubjectBadge(message.subject)}`}>
                  {message.subject?.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <User size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Name</p>
                <p className="text-sm font-semibold text-gray-900">{message.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
                <a
                  href={`mailto:${message.email}`}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  {message.email}
                </a>
              </div>
            </div>

            {message.phone && (
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Phone</p>
                  <a
                    href={`tel:${message.phone}`}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    {message.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Message Content */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={20} className="text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900">Message</h3>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{message.message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/admin/contact-us")}
            className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Messages
          </button>
          <a
            href={`mailto:${message.email}?subject=Re: ${message.subject?.replace(/_/g, " ")}`}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Mail size={18} />
            Reply via Email
          </a>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Contact Message"
        message="Are you sure you want to delete this contact message? This action cannot be undone."
        confirmText="Delete Message"
        loading={deleteMutation.isLoading}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </Layout>
  );
};

export default ViewContactMessage;
