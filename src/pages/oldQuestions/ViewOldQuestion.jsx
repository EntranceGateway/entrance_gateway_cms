import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PdfViewer from "@/components/pdf/PdfViewer";
import { fetchOldQuestionPdfBlob, getOldQuestionFileUrl } from "@/http/oldQuestionCollection";
import tokenService from "@/auth/services/tokenService";
import { ArrowLeft, FileText } from "lucide-react";

/**
 * Page for viewing Old Question PDF in-app using PdfViewer component
 */
export default function ViewOldQuestion() {
  const { id } = useParams();
  const token = tokenService.getAccessToken();

  return (
    <Layout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link
              to="/old-questions/all"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Old Questions
            </Link>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <FileText size={20} className="text-indigo-600" />
            <span className="font-medium">Question Paper #{id}</span>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <PdfViewer
            noteId={id}
            token={token}
            fetchPdfBlob={fetchOldQuestionPdfBlob}
            pdfFileUrl={getOldQuestionFileUrl(id)}
            enableOfflineCache={true}
            className="h-full"
          />
        </div>
      </div>
    </Layout>
  );
}
