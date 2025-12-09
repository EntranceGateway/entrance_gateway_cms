import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotes, deleteNote } from "../../../../http/notes"; // removed getSingle import
import UniversalFilter from "../../../../Verification/UniversalFilter";
import Pagination from "../../../../Verification/Pagination";

const NoteTable = () => {
  const [allNotes, setAllNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const token = localStorage.getItem("token");

  // Fetch all notes
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await getNotes({}, token);
      const data = res.data.data.content || [];
      setAllNotes(data);
      setFilteredNotes(data);
    } catch (err) {
      console.error("Fetch Notes Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Filter notes live
  const handleFilter = (filters) => {
    let data = [...allNotes];

    if (filters.noteName)
      data = data.filter((n) =>
        n.noteName.toLowerCase().includes(filters.noteName.toLowerCase())
      );

    if (filters.syllabusId)
      data = data.filter((n) =>
        n.syllabusId.toLowerCase().includes(filters.syllabusId.toLowerCase())
      );

    setFilteredNotes(data);
    setPage(1);
  };

  // Delete note
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote(id, token);
      fetchNotes();
    } catch (err) {
      console.error("Delete Note Error:", err);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredNotes.length / PAGE_SIZE);
  const paginatedNotes = filteredNotes.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Notes</h1>

      {/* Filters */}
      <UniversalFilter
        config={[
          {
            name: "noteName",
            label: "Note Name",
            type: "text",
            placeholder: "Search by note name",
          },
          {
            name: "syllabusId",
            label: "Syllabus ID",
            type: "text",
            placeholder: "Search by syllabus ID",
          },
        ]}
        onFilter={handleFilter}
      />

      {/* Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-x-auto mt-4">
        <table className="min-w-full text-sm table-auto">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Note Name", "Description", "Syllabus ID", "File", "Action"].map(
                (col) => (
                  <th
                    key={col}
                    className="p-4 text-left font-medium text-gray-700 sticky top-0 bg-gray-50 z-10"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : paginatedNotes.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  No notes found
                </td>
              </tr>
            ) : (
              paginatedNotes.map((note) => (
                <tr key={note.noteId} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800 wrap-break-word max-w-[120px]">{note.noteName}</td>
                  <td className="p-4 text-gray-600 wrap-break-word max-w-[150px]">{note.noteDescription}</td>
                  <td className="p-4 text-gray-600 wrap-break-word max-w-[100px]">{note.syllabusId}</td>
                  
                  {/* FILE COLUMN: No more direct downloadable link */}
                  <td className="p-4">
                    <span className="text-green-600 font-medium">PDF Available</span>
                  </td>

                  {/* ACTION COLUMN */}
                  <td className="p-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    <Link
                      to={`/notes/edit/${note.noteId}`}
                      className="px-3 py-1.5 rounded-xl text-blue-700 font-semibold border border-blue-200 hover:bg-blue-50 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(note.noteId)}
                      className="px-3 py-1.5 rounded-xl text-red-700 font-semibold border border-red-200 hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                   
                    {/* ONLY secure way to view PDF */}
                    <Link
                      to={`/notes/viewnotes/${note.noteId}`}
                      className="px-3 py-1.5 rounded-xl text-green-700 font-semibold border border-blue-200 hover:bg-blue-50 transition"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default NoteTable;