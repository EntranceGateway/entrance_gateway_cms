import React, { useState } from "react";

const Form = ({ role = "Admin", type, onSubmit, user,error  }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const { email, password, remember } = data;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({
      ...data,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ email, password, remember, role });
    onSubmit(data);
  };

  const isAdmin = role === "admin";
  const title = isAdmin ? "Admin Portal" : "Admin Login";
  const placeholderEmail = isAdmin ? "admin@example.com" : "user@example.com";

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side */}
      <div className="md:w-1/2 bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-10">
        <h2 className="text-white text-4xl font-bold">{isAdmin ? "Welcome, Admin!" : "Welcome Back!"}</h2>
      </div>

      {/* Right side */}
      <div className="md:w-1/2 flex items-center justify-center p-10 bg-gray-100">
        <div className="bg-white shadow-2xl rounded-xl w-full max-w-md p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">{title}</h1>
          {error && (
  <p className="text-red-500 text-sm mb-2 text-center">
    {error}
  </p>
)}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                placeholder={placeholderEmail}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                required
                placeholder="********"
                  autoComplete="current-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  checked={remember}
                  onChange={handleChange}
                  className="mr-2"
                />
                Remember me
              </label>
              <a href="/forgot" className="text-indigo-600 hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-linear-to-r from-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-600 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Sign In
            </button>
          </form>
          <p className="mt-6 text-center text-gray-500 text-sm">
            &copy; 2025 {isAdmin ? "Admin Dashboard" : "User Portal"}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Form;
