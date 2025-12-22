// Spinner.jsx
import React from "react";

const Spinner = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <p className="text-gray-600 text-sm">Please wait a moment...</p>
    </div>
  );
};

export default Spinner;
