import React, { useState, useMemo, useEffect } from "react";
import { Trophy, Eye, TrendingUp, TrendingDown, Minus, Clock, Target, Award, Calendar, X } from "lucide-react";
import { useQuizResults, useQuizResult } from "@/hooks/useQuiz";
import DataTable from "@/components/common/DataTable";
import PageHeader from "@/components/common/PageHeader";
import LoadingState from "@/components/common/LoadingState";
import Layout from "@/components/layout/Layout";

const QuizResults = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("attemptedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // State for result details
  const [viewingResultId, setViewingResultId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Queries
  const { data, isLoading, error, refetch } = useQuizResults({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
  });

  const { data: selectedResult, isLoading: isLoadingDetails } = useQuizResult(viewingResultId);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => refetch(), 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleViewDetails = (result) => {
    setViewingResultId(result.resultId || result.id);
    setShowModal(true);
  };

  const getChangeIcon = (current, previous) => {
    const diff = (current || 0) - (previous || 0);
    if (diff > 0) return <TrendingUp size={14} className="text-emerald-500" />;
    if (diff < 0) return <TrendingDown size={14} className="text-red-500" />;
    return <Minus size={14} className="text-gray-400" />;
  };

  const columns = useMemo(
    () => [
      {
        key: "questionSet",
        label: "Question Set",
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">{row.questionSet?.setName || row.questionSet?.name || "Independent"}</span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{row.questionSet?.courseName || "General Quiz"}</span>
          </div>
        )
      },
      {
        key: "totalScore",
        label: "Performance",
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-black text-xs border border-indigo-100 min-w-[50px] text-center">
              {row.totalScore} PTS
            </div>
            <div className="flex items-center gap-1.5 opacity-60">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Prev: {row.previousScore || 0}</span>
              {getChangeIcon(row.totalScore, row.previousScore)}
            </div>
          </div>
        )
      },
      {
        key: "currentRank",
        label: "Ranking",
        render: (row) => (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100 font-black text-xs">
            <Award size={12} />
            RANK #{row.currentRank || "-"}
          </div>
        )
      },
      {
        key: "attemptedAt",
        label: "Timestamp",
        sortable: true,
        render: (row) => (
          <div className="flex flex-col">
            <span className="text-gray-600 font-medium text-xs">
              {row.attemptedAt ? new Date(row.attemptedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "-"}
            </span>
            <span className="text-[10px] text-gray-400 font-bold">
              {row.attemptedAt ? new Date(row.attemptedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ""}
            </span>
          </div>
        )
      },
      {
        key: "actions",
        label: "Audit",
        render: (row) => (
          <button
            onClick={() => handleViewDetails(row)}
            className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all font-bold text-xs"
          >
            <Eye size={16} />
            INSPECT
          </button>
        )
      }
    ],
    []
  );

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2">Failed to load quiz results</h3>
        <p>{error.message || "An unexpected error occurred."}</p>
        <button onClick={() => refetch()} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">Retry</button>
      </div>
    );
  }

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Performance Analytics"
          breadcrumbs={[{ label: "Quiz", path: "/quiz" }, { label: "Results" }]}
          description="Monitor and evaluate student engagement and performance trends across all question sets."
          actions={[
            {
              label: "Refresh Data",
              onClick: () => refetch(),
              icon: <TrendingUp size={18} />,
              variant: "outline",
            }
          ]}
        />

        {isLoading ? (
          <LoadingState type="table" />
        ) : (
          <DataTable
            data={data?.content || []}
            columns={columns}
            loading={isLoading}
            pagination={{
              currentPage: page,
              totalPages: data?.totalPages || 0,
              totalItems: data?.totalItems || 0,
              pageSize: pageSize,
            }}
            onPageChange={setPage}
            onSort={(key, dir) => {
              setSortField(key);
              setSortOrder(dir);
            }}
          />
        )}

        {/* Details Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden transform animate-in zoom-in-95 duration-300">
              {isLoadingDetails ? (
                <div className="p-20 flex flex-col items-center justify-center">
                  <span className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></span>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Retrieving Metrics...</p>
                </div>
              ) : selectedResult && (
                <>
                  <div className="bg-gray-900 p-8 text-white relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">Attempt Profile</h2>
                        <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">{selectedResult.questionSet?.setName || selectedResult.questionSet?.name}</p>
                      </div>
                      <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                      </button>
                    </div>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/20 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                  </div>

                  <div className="p-8 bg-gray-50/50">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <Target className="text-indigo-600 mb-2" size={24} />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Score</p>
                        <p className="text-3xl font-black text-indigo-900">{selectedResult.totalScore}</p>
                      </div>
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center uppercase">
                        <Award className="text-amber-500 mb-2" size={24} />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Rank</p>
                        <p className="text-3xl font-black text-amber-600">#{selectedResult.currentRank || "-"}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <Clock className="text-gray-400" size={18} />
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Historical Mark</span>
                        </div>
                        <span className="font-black text-gray-800">{selectedResult.previousScore || 0} PTS</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="text-gray-400" size={18} />
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Progression</span>
                        </div>
                        <div className={`flex items-center gap-1 font-black ${selectedResult.totalScore - (selectedResult.previousScore || 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {selectedResult.totalScore - (selectedResult.previousScore || 0) > 0 ? '+' : ''}
                          {selectedResult.totalScore - (selectedResult.previousScore || 0)}
                          {getChangeIcon(selectedResult.totalScore, selectedResult.previousScore)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <Calendar className="text-gray-400" size={18} />
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Attempt Date</span>
                        </div>
                        <span className="text-xs font-black text-gray-800">
                          {selectedResult.attemptedAt ? new Date(selectedResult.attemptedAt).toLocaleString() : "-"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowModal(false)}
                      className="w-full mt-8 py-5 bg-gray-900 text-white rounded-3xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-gray-200 uppercase tracking-widest"
                    >
                      Close Profile
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QuizResults;
