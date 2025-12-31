import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotes, deleteNote, getNotesByFilter } from "../../../../http/notes";
import Pagination from "../../../../Verification/Pagination";

const NoteTable = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0); // API uses 0-based indexing
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter states
  const [affiliation, setAffiliation] = useState("");
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all notes
  const fetchNotes = async () => {
    setLoading(true);
    try {
      let res;
      
      const trimmedAffiliation = affiliation?.trim();
      const trimmedCourseName = courseName?.trim();
      const trimmedSemester = semester?.trim();
      
      if (trimmedAffiliation && trimmedCourseName && trimmedSemester) {
        // Use filtered endpoint when all filters are set
        const params = {
          affiliation: trimmedAffiliation,
          courseName: trimmedCourseName,
          semester: parseInt(trimmedSemester),
          page,
          size: PAGE_SIZE,
          ...(sortField && { sortBy: sortField, sortDir: sortOrder }),
        };
        res = await getNotesByFilter(params, token);
      } else {
        // Use default endpoint
        const params = {
          page,
          size: PAGE_SIZE,
          ...(sortField && { sortBy: sortField, sortDir: sortOrder }),
        };
        res = await getNotes(params, token);
      }
      
      const data = res.data.data.content || [];
      setNotes(data);
      setTotalPages(res.data.data.page?.totalPages || 0);
    } catch (err) {
      console.error("Fetch Notes Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortField, sortOrder, affiliation, courseName, semester]);

  // Handle filter changes and reset to first page
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(0);
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

  // Handle page change (convert from 1-based display to 0-based API)
  const handlePageChange = (newPage) => {
    setPage(newPage - 1);
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Notes</h1>

      {/* Filter Controls */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 space-y-4">
        <h3 className="font-semibold text-gray-700">Filters</h3>
        <p className="text-xs text-gray-500 italic">All three filters (Affiliation, Course Name, Semester) are required to filter notes</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Affiliation Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation</label>
            <select
              value={affiliation}
              onChange={(e) => handleFilterChange(setAffiliation)(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Affiliation</option>
              <option value="TRIBHUVAN_UNIVERSITY">Tribhuvan University</option>
              <option value="POKHARA_UNIVERSITY">Pokhara University</option>
              <option value="KATHMANDU_UNIVERSITY">Kathmandu University</option>
              <option value="PURWANCHAL_UNIVERSITY">Purwanchal University</option>
              <option value="MID_WESTERN_UNIVERSITY">Mid Western University</option>
              <option value="FAR_WESTERN_UNIVERSITY">Far Western University</option>
              <option value="LUMBINI_UNIVERSITY">Lumbini University</option>
              <option value="CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY">Campus Affiliated to Foreign University</option>
            </select>
          </div>

          {/* Course Name Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => handleFilterChange(setCourseName)(e.target.value)}
              placeholder="e.g., CSIT, BCA"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Semester Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <input
              type="number"
              value={semester}
              onChange={(e) => handleFilterChange(setSemester)(e.target.value)}
              placeholder="e.g., 1, 2, 3"
              min="1"
              max="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Clear Filters Button */}
        {(affiliation || courseName || semester) && (
          <button
            onClick={() => {
              setAffiliation("");
              setCourseName("");
              setSemester("");
              setPage(0);
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Sort Controls */}
      <div className="bg-white shadow-md rounded-lg p-4 mt-4 flex flex-wrap gap-4 items-center">
        <span className="font-medium text-gray-700">Sort By:</span>
        <select
          value={sortField}
          onChange={(e) => {
            setSortField(e.target.value);
            setPage(0);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Default (noteName)</option>
          <option value="noteName">Note Name</option>
          <option value="subject">Subject</option>
          <option value="subjectCode">Subject Code</option>
          <option value="courseName">Course Name</option>
          <option value="semester">Semester</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(0);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-x-auto mt-4">
        <table className="min-w-full text-sm table-auto">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Subject", "Subject Code", "Course", "Semester", "Year", "Affiliation", "Description", "Action"].map(
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
                <td colSpan={8} className="text-center p-6 text-gray-500">
                  Loading...
                </td>
              </tr>
              ) : notes.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-6 text-gray-500">
                  No notes found
                </td>
              </tr>
            ) : (
              notes.map((note) => (
                <tr key={note.noteId} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{note.subject}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-md bg-purple-100 text-purple-700">
                      {note.subjectCode || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-700">
                      {note.courseName || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{note.semester}</td>
                  <td className="p-4 text-gray-600">{note.year}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-700">
                      {note.affiliation?.replace(/_/g, ' ') || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 max-w-[150px] truncate" title={note.noteDescription}>
                    {note.noteDescription}
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
      <Pagination page={page + 1} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default NoteTable;