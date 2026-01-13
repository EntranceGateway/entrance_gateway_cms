import React, { useState, useMemo } from "react";
import { Plus, Edit, Trash2, FolderOpen, X, Save } from "lucide-react";
import {
  useQuizCategories,
  useCreateQuizCategory,
  useUpdateQuizCategory,
  useDeleteQuizCategory
} from "@/hooks/useQuiz";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import { TableSkeleton } from "@/components/loaders";
import Layout from "@/components/layout/Layout";

const QuizCategories = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("categoryName");
  const [sortOrder, setSortOrder] = useState("asc");

  // State for Add/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ categoryName: "", remarks: "" });
  const [deleteId, setDeleteId] = useState(null);

  // Queries & Mutations
  const { data, isLoading, error } = useQuizCategories({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
  });

  const createMutation = useCreateQuizCategory();
  const updateMutation = useUpdateQuizCategory();
  const deleteMutation = useDeleteQuizCategory();

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ categoryName: "", remarks: "" });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName,
      remarks: category.remarks || ""
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({
          id: editingCategory.categoryId,
          data: formData
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Submit Category Error:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete Category Error:", err);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "categoryName",
        label: "Category Name",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FolderOpen size={16} />
            </div>
            <span className="font-bold text-gray-900">{row.categoryName}</span>
          </div>
        )
      },
      {
        key: "remarks",
        label: "Remarks",
        render: (row) => (
          <span className="text-gray-600 text-xs italic">
            {row.remarks || "No remarks provided"}
          </span>
        )
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(row)}
              className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-100"
              title="Edit Category"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => setDeleteId(row.categoryId)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
              title="Delete Category"
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
        <h3 className="text-xl font-bold mb-2">Failed to load categories</h3>
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
          title="Quiz Categories"
          breadcrumbs={[{ label: "Quiz", path: "/quiz" }, { label: "Categories" }]}
          actions={[
            {
              label: "Add New Category",
              onClick: handleAdd,
              icon: <Plus size={18} />,
              variant: "primary",
            },
          ]}
        />

        {isLoading ? (
          <TableSkeleton rows={10} columns={4} />
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
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300">
              <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingCategory ? 'Modify Category' : 'Create Category'}
                  </h2>
                  <p className="text-indigo-100 text-xs mt-1">
                    {editingCategory ? 'Update existing quiz classification' : 'Establish a new quiz grouping'}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Category Name</label>
                    <input
                      type="text"
                      value={formData.categoryName}
                      onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium"
                      placeholder="e.g., Medical Entrance, Engineering"
                      required
                      disabled={createMutation.isLoading || updateMutation.isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Remarks (Optional)</label>
                    <textarea
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium resize-none"
                      placeholder="Additional context or notes..."
                      rows={4}
                      disabled={createMutation.isLoading || updateMutation.isLoading}
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3.5 border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                  >
                    {(createMutation.isLoading || updateMutation.isLoading) ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Save size={18} />
                        {editingCategory ? 'Update' : 'Create'}
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
          title="Delete Category"
          message="Are you sure you want to delete this category? All associated courses and question sets might be affected depending on server-side constraints. This action is permanent."
          confirmText="Confirm Deletion"
          loading={deleteMutation.isLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </div>
    </Layout>
  );
};

export default QuizCategories;
