import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotesTable = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(15); // Show 15 at a time
  const navigate = useNavigate();

  // Fetch notes
  useEffect(() => {
    axios
      .get("http://185.177.116.173:8080/api/v1/notes")
      .then((res) => setNotes(res.data))
      .catch(() => alert("Failed to load notes"));
  }, []);

  // Filter by search
  const filteredNotes = notes.filter((note) => {
    const query = search.toLowerCase();
    return (
      note.subject?.toLowerCase().includes(query) ||
      note.subjectcode?.toLowerCase().includes(query) ||
      note.notename?.toLowerCase().includes(query)
    );
  });

  // Show only some notes (manual lazy load)
  const notesToShow = filteredNotes.slice(0, visibleCount);

  const loadMore = () => setVisibleCount((c) => c + 15);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this note?")) return;
    axios
      .delete(`https://691c3b293aaeed735c9006f6.mockapi.io/notes/${id}`)
      .then(() => setNotes(notes.filter((n) => n.id !== id)))
      .catch(() => alert("Delete failed"));
  };

  return (
    <div>
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          My Notes
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search subject, code or note name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(15); // Reset on search
          }}
          className="w-full p-4 mb-6 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
        />

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Subject</th>
                <th className="px-6 py-4 text-left">Subject Code</th>
                <th className="px-6 py-4 text-left">Note Name</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notesToShow.map((note) => (
                <tr key={note.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{note.subject}</td>
                  <td className="px-6 py-4 font-mono text-blue-600">
                    {note.subjectcode}
                  </td>
                  <td className="px-6 py-4">{note.notename}</td>
                  <td className="px-6 py-4 text-center space-x-3">
                    <button
                      onClick={() => navigate(`/edit-note/${note.id}`)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {notesToShow.map((note) => (
            <div
              key={note.id}
              className="bg-white p-5 rounded-xl shadow-lg border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-800">
                {note.subject}
              </h3>
              <p className="text-sm text-blue-600 font-mono mt-1">
                {note.subjectcode}
              </p>
              <p className="text-gray-700 mt-2 text-lg">{note.notename}</p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => navigate(`/edit-note/${note.id}`)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-16 text-gray-500 text-xl">
            No notes found
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredNotes.length && (
          <div className="text-center mt-10">
            <button
              onClick={loadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-10 rounded-full shadow-lg transition"
            >
              Load More ({visibleCount} of {filteredNotes.length})
            </button>
          </div>
        )}

        {visibleCount >= filteredNotes.length && filteredNotes.length > 15 && (
          <p className="text-center mt-6 text-gray-600">
            All {filteredNotes.length} notes loaded
          </p>
        )}
      </div>
    </div>
    </div>
  );
};

export default NotesTable;