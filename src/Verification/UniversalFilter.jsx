// src/components/UniversalFilter.jsx
import { useState } from "react";

const UniversalFilter = ({
  config = [],
  onFilter,
  title = "Filters",
  initialValues = {},
  actions = true, // show reset/apply buttons
}) => {
  const [filter, setFilter] = useState(initialValues);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    const newFilter = { ...filter, [name]: newValue };
    setFilter(newFilter);
    onFilter(newFilter);
  };

  const resetFilter = () => {
    setFilter(initialValues);
    onFilter(initialValues);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200">
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>

      {/* Dynamic fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {config.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label
              htmlFor={field.name}
              className="text-gray-800 font-medium mb-2"
            >
              {field.label}
            </label>

            {field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                value={filter[field.name] || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-indigo-400 transition"
              >
                <option value="">All</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === "checkbox" ? (
              <input
                id={field.name}
                type="checkbox"
                name={field.name}
                checked={filter[field.name] || false}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            ) : (
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                value={filter[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder || ""}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-indigo-400 transition"
              />
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
          <button
            onClick={resetFilter}
            aria-label="Reset filters"
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-semibold shadow-sm hover:bg-gray-100 hover:scale-105 active:scale-95 transition transform"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default UniversalFilter;
