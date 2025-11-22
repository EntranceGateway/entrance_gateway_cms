import { useState } from "react";

const UniversalFilter = ({ config = [], onFilter }) => {
  const [filter, setFilter] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilter = () => onFilter(filter);
  const resetFilter = () => {
    setFilter({});
    onFilter({});
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

        {config.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">{field.label}</label>

            {field.type === "select" ? (
              <select
                name={field.name}
                value={filter[field.name] || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm hover:border-blue-300 transition"
              >
                <option value="">All</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={filter[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder || ""}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm hover:border-blue-300 transition"
              />
            )}
          </div>
        ))}

      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-5">
        <button
          onClick={resetFilter}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 font-semibold shadow-sm hover:bg-gray-100 active:scale-95 transition transform"
        >
          Reset
        </button>

        <button
          onClick={applyFilter}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-md hover:from-blue-700 hover:to-blue-600 active:scale-95 transition transform"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default UniversalFilter;
