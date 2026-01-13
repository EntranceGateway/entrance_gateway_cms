import React, { useState, useMemo } from "react";
import { Plus, Edit, Trash2, FileText, Clock, DollarSign, X, Save, Layers } from "lucide-react";
import {
  useQuizQuestionSets,
  useQuizCourses,
  useDeleteQuizQuestionSet,
} from "@/hooks/useQuiz";
import quizApi from "../services/quizApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import { TableSkeleton } from "@/components/loaders";
import Layout from "@/components/layout/Layout";

const QuizQuestionSets = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("setName");
  const [sortOrder, setSortOrder] = useState("asc");

  // State for Add/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingSet, setEditingSet] = useState(null);
  const [formData, setFormData] = useState({
    setName: "",
    description: "",
    nosOfQuestions: "",
    durationInMinutes: "",
    price: "",
    courseId: ""
  });
  const [deleteId, setDeleteId] = useState(null);

  // Queries
  const { data, isLoading, error } = useQuizQuestionSets({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
  });

  const { data: coursesData } = useQuizCourses({ page: 0, size: 1000 });
  const courses = coursesData?.content || [];

  // Mutations
  const deleteMutation = useDeleteQuizQuestionSet();

  const createMutation = useMutation({
    mutationFn: quizApi.createQuestionSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizQuestionSets"] });
      setShowModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => quizApi.updateQuestionSet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizQuestionSets"] });
      setShowModal(false);
    },
  });

  const handleAdd = () => {
    setEditingSet(null);
    setFormData({
      setName: "",
      description: "",
      nosOfQuestions: "",
      durationInMinutes: "",
      price: "",
      courseId: ""
    });
    setShowModal(true);
  };

  const handleEdit = (set) => {
    setEditingSet(set);
    setFormData({
      setName: set.setName,
      description: set.description || "",
      nosOfQuestions: set.nosOfQuestions || "",
      durationInMinutes: set.durationInMinutes || "",
      price: set.price || "",
      courseId: set.courseId || ""
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSet) {
        await updateMutation.mutateAsync({
          id: editingSet.questionSetId || editingSet.id,
          data: formData
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (err) {
      console.error("Submit Question Set Error:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete Question Set Error:", err);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "setName",
        label: "Set Details",
        sortable: true,
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">{row.setName}</span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider line-clamp-1">{row.courseName || "No Course"}</span>
          </div>
        )
      },
      {
        key: "nosOfQuestions",
        label: "Specs",
        render: (row) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Layers size={12} className="text-indigo-500" />
              <span className="font-semibold">{row.nosOfQuestions || 0} Questions</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Clock size={12} className="text-indigo-500" />
              <span>{row.durationInMinutes || 0} Minutes</span>
            </div>
          </div>
        )
      },
      {
        key: "price",
        label: "Pricing",
        render: (row) => (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-bold text-xs">
            <DollarSign size={12} />
            {Number(row.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        )
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleEdit(row)}
              className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-100"
              title="Edit Set"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => setDeleteId(row.questionSetId || row.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
              title="Delete Set"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )
      }
    ],
    []
  );

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2">Failed to load question sets</h3>
        <p>{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Question Sets"
          breadcrumbs={[{ label: "Quiz", path: "/quiz" }, { label: "Sets" }]}
          actions={[
            {
              label: "Create New Set",
              onClick: handleAdd,
              icon: <Plus size={18} />,
              variant: "primary",
            },
          ]}
        />

        {isLoading ? (
          <TableSkeleton rows={10} columns={7} />
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

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden transform animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
              <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingSet ? 'Modify Set' : 'Assemble Set'}
                  </h2>
                  <p className="text-indigo-100 text-sm mt-1 opacity-80">
                    {editingSet ? 'Update configuration' : 'Define new contents'}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Set Name</label>
                    <input
                      type="text"
                      value={formData.setName}
                      onChange={(e) => setFormData({ ...formData, setName: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-semibold"
                      placeholder="e.g., MBBS Entrance Mock 01"
                      required
                      disabled={createMutation.isLoading || updateMutation.isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Course Mapping</label>
                    <select
                      value={formData.courseId}
                      onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-semibold"
                      required
                      disabled={createMutation.isLoading || updateMutation.isLoading}
                    >
                      <option value="">Select a course</option>
                      {courses.map(course => (
                        <option key={course.courseId} value={course.courseId}>
                          {course.courseName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Questions</label>
                      <input
                        type="number"
                        value={formData.nosOfQuestions}
                        onChange={(e) => setFormData({ ...formData, nosOfQuestions: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-semibold"
                        required
                        min={1}
                        disabled={createMutation.isLoading || updateMutation.isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Duration (Min)</label>
                      <input
                        type="number"
                        value={formData.durationInMinutes}
                        onChange={(e) => setFormData({ ...formData, durationInMinutes: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-semibold"
                        required
                        min={1}
                        disabled={createMutation.isLoading || updateMutation.isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Price (NPR)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-semibold"
                      required
                      min={0}
                      disabled={createMutation.isLoading || updateMutation.isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-semibold resize-none"
                      rows={3}
                      disabled={createMutation.isLoading || updateMutation.isLoading}
                    />
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-4 border border-gray-200 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                  >
                    {(createMutation.isLoading || updateMutation.isLoading) ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Save size={18} />
                        {editingSet ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={!!deleteId}
          title="Delete Question Set"
          message="Are you sure you want to permanently delete this question set? All student attempt records for this set will also be removed. This action cannot be reversed."
          confirmText="Confirm Deletion"
          loading={deleteMutation.isLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </div>
    </Layout>
  );
};

export default QuizQuestionSets;
