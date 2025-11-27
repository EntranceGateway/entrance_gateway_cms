// src/components/UniversalFilter.jsx
import { useState } from "react";

const UniversalFilter = ({ config = [], onFilter }) => {
  const [filter, setFilter] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilter = { ...filter, [name]: value };
    setFilter(newFilter);
    onFilter(newFilter); // send filter object to parent
  };

  const resetFilter = () => {
    setFilter({});
    onFilter({});
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Colleges</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {config.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">{field.label}</label>

            {field.type === "select" ? (
              <select
                name={field.name}
                value={filter[field.name] || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-blue-400 transition"
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
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-blue-400 transition"
              />
            )}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
        <button
          onClick={resetFilter}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 font-semibold shadow-sm hover:bg-gray-100 hover:scale-105 active:scale-95 transition transform"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default UniversalFilter;
