import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import { getTrainingById } from "@/http/training";
import { FormSkeleton } from "@/components/loaders";
import { 
  GraduationCap, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign, 
  Tag, 
  Type, 
  Link as LinkIcon, 
  FileText, 
  CheckCircle, 
  XCircle,
  AlertCircle
} from "lucide-react";

const ViewTraining = () => {
  const { id } = useParams();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await getTrainingById(id);
        setTraining(res.data.data || res.data);
      } catch (err) {
        setError(err.message || "Failed to load training details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTraining();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: 'long',
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      UPCOMING: "bg-blue-100 text-blue-800 border-blue-200",
      FLASH_SALE: "bg-red-100 text-red-800 border-red-200",
      ONGOING: "bg-green-100 text-green-800 border-green-200",
      COMPLETED: "bg-gray-100 text-gray-800 border-gray-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      POSTPONED: "bg-yellow-100 text-yellow-800 border-yellow-200",
      COMING_SOON: "bg-purple-100 text-purple-800 border-purple-200",
      REGISTRATION_OPEN: "bg-green-100 text-green-800 border-green-200",
      REGISTRATION_CLOSED: "bg-orange-100 text-orange-800 border-orange-200",
      SOLD_OUT: "bg-red-100 text-red-800 border-red-200",
    };
    const colorClass = statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
        {status?.replace(/_/g, " ")}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeColors = {
      REMOTE: "bg-indigo-100 text-indigo-800 border-indigo-200",
      ON_SITE: "bg-teal-100 text-teal-800 border-teal-200",
      HYBRID: "bg-purple-100 text-purple-800 border-purple-200",
    };
    const colorClass = typeColors[type] || "bg-gray-100 text-gray-800 border-gray-200";

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
        {type?.replace(/_/g, " ")}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout>
        <FormSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
          <div className="mt-4">
            <Link to="/admin/training" className="text-blue-600 hover:underline">
              &larr; Back to Training List
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!training) return null;

  return (
    <Layout>
      <PageHeader
        title="Training Details"
        subtitle={`View details for ${training.trainingName}`}
        breadcrumbs={[
          { label: "Training", to: "/admin/training" },
          { label: "View Training" },
        ]}
        icon={GraduationCap}
        actions={[
          {
            label: "Edit Training",
            to: `/admin/training/edit/${id}`,
            variant: "primary",
          }
        ]}
      />

      <div className="max-w-5xl mx-auto pb-12 space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {getStatusBadge(training.trainingStatus)}
                {getTypeBadge(training.trainingType)}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{training.trainingName}</h1>
              {training.trainingCategory && (
                <div className="flex items-center gap-2 mt-2 text-gray-500">
                  <Tag className="w-4 h-4" />
                  <span className="font-medium">{training.trainingCategory}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                NPR {training.price?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">Per Participant</div>
            </div>
          </div>

          <div className="prose max-w-none text-gray-600 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Description
            </h3>
            <p className="whitespace-pre-line">{training.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Calendar className="w-5 h-5 text-orange-500" />
              Schedule & Location
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Start Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(training.startDate)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">End Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(training.endDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-900">{training.trainingHours} Hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900">{training.location || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Capacity & Extras */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Users className="w-5 h-5 text-teal-500" />
              Capacity & Extras
            </h2>
            <div className="space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                   <span className="font-medium text-gray-700">Enrollment Status</span>
                   <span className="text-blue-600 font-bold">
                     {training.currentParticipants} / {training.maxParticipants}
                   </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((training.currentParticipants / training.maxParticipants) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                   <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className={`w-4 h-4 ${training.certificateProvided ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-sm font-medium text-gray-700">Certificate</span>
                   </div>
                   <p className="text-sm text-gray-500 pl-6">
                     {training.certificateProvided ? "Provided upon completion" : "Not included"}
                   </p>
                </div>
                
                {training.materialsLink && (
                   <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                         <LinkIcon className="w-4 h-4 text-blue-500" />
                         <span className="text-sm font-medium text-gray-700">Materials</span>
                      </div>
                      <a 
                        href={training.materialsLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline pl-6 truncate block"
                      >
                        Access Materials
                      </a>
                   </div>
                )}
              </div>

              {training.remarks && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                   <p className="text-sm font-medium text-gray-500 mb-1">Internal Remarks</p>
                   <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                     {training.remarks}
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewTraining;
