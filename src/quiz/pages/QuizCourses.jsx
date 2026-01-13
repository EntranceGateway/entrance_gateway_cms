import React, { useState, useMemo } from "react";
import { BookOpen, Search, Filter } from "lucide-react";
import { useQuizCourses } from "@/hooks/useQuiz";
import DataTable from "@/components/common/DataTable";
import PageHeader from "@/components/common/PageHeader";
import { TableSkeleton } from "@/components/loaders";
import Layout from "@/components/layout/Layout";

const QuizCourses = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("courseName");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch Quiz Courses using hook
  const { data, isLoading, error } = useQuizCourses({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
  });

  const columns = useMemo(
    () => [
      {
        key: "courseName",
        label: "Course Name",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <BookOpen size={16} />
            </div>
            <span className="font-bold text-gray-900">{row.courseName}</span>
          </div>
        )
      },
      {
        key: "categoryName",
        label: "Category",
        render: (row) => (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            {row.categoryName || "Uncategorized"}
          </span>
        )
      },
      {
        key: "description",
        label: "Description",
        render: (row) => (
          <p className="text-gray-500 text-xs italic max-w-sm" title={row.description}>
            {row.description || "No description provided."}
          </p>
        )
      }
    ],
    []
  );

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2">Failed to load quiz courses</h3>
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
          title="Quiz Courses"
          breadcrumbs={[{ label: "Quiz", path: "/quiz" }, { label: "Courses" }]}
          description="Review courses available for quizzes (managed via main Courses section)"
        />

        {isLoading ? (
          <TableSkeleton rows={10} columns={5} />
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
      </div>
    </Layout>
  );
};

export default QuizCourses;
