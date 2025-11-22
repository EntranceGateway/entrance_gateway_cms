const Pagination = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>

      <span className="px-3 py-1 border rounded">
        {page} / {totalPages || 1}
      </span>

      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
