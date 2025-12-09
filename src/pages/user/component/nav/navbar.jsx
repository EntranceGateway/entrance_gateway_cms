// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleDropdown = (menu) =>
        setOpenDropdown(openDropdown === menu ? null : menu);

  const getUserInitials = () => {
    if (!user) return "";
    const names = user.name.split(" ");
    return names[0][0].toUpperCase() + (names[1] ? names[1][0].toUpperCase() : "");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Entrance_Gateway
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Colleges */}
            <Link
              to="/College"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Colleges
            </Link>

            {/* Programs Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 flex items-center transition">
                Programs
              </button>
              <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md py-2 w-48 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                <Link to="/tuProgramList" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">TU Program</Link>
                <Link to="/kuProgramList" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">KU Program</Link>
                <Link to="/purProgramList" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">PU Program</Link>
                <Link to="/puProgramList" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">PU (Pokhara)</Link>
              </div>
            </div>

            {/* University Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 flex items-center transition">
                University
              </button>
              <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md py-2 w-56 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                <Link to="/tribhuwan-university" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Tribhuwan University</Link>
                <Link to="/kathmandu-university" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Kathmandu University</Link>
                <Link to="/pokhara-university" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Pokhara University</Link>
                <Link to="/purbanchal-university" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Purbanchal University</Link>
              </div>
            </div>

            {/* Syllabus */}
            <Link to="/syllabus" className="text-gray-700 hover:text-blue-600 transition">
              Syllabus
            </Link>

            {/* Resources Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 flex items-center transition">
                Resources
              </button>
              <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md py-2 w-48 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                <Link to="/notes" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Notes</Link>
              </div>
            </div>

            {/* Training/Courses */}
            <Link to="/training-courses" className="text-gray-700 hover:text-blue-600 transition">
              Training/Courses
            </Link>

            {/* User Login / Avatar */}
            {user ? (
              <div className="relative group ml-4">
                <button
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold transition"
                  title={user.name}
                >
                  {getUserInitials()}
                </button>
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md py-2 w-40 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                  <span className="block px-4 py-2 text-gray-700">{user.name}</span>
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Login</Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <Link to="/College" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 border-t border-gray-200">Colleges</Link>

          {/* Mobile Programs */}
          <div className="border-t border-gray-200">
            <button onClick={() => toggleDropdown("programs")} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Programs</button>
            {openDropdown === "programs" && (
              <div className="pl-4">
                <Link to="/tuProgramList" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">TU Program</Link>
                <Link to="/kuProgramList" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">KU Program</Link>
                <Link to="/purProgramList" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">PU Program</Link>
                <Link to="/puProgramList" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">PU (Pokhara)</Link>
              </div>
            )}
          </div>

          {/* Mobile University */}
          <div className="border-t border-gray-200">
            <button onClick={() => toggleDropdown("university")} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">University</button>
            {openDropdown === "university" && (
              <div className="pl-4">
                <Link to="/tribhuwan-university" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Tribhuwan University</Link>
                <Link to="/kathmandu-university" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Kathmandu University</Link>
                <Link to="/pokhara-university" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Pokhara University</Link>
                <Link to="/purbanchal-university" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Purbanchal University</Link>
              </div>
            )}
          </div>

          <Link to="/syllabus" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 border-t border-gray-200">Syllabus</Link>

          {/* Mobile Resources */}
          <div className="border-t border-gray-200">
            <button onClick={() => toggleDropdown("resources")} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Resources</button>
            {openDropdown === "resources" && (
              <div className="pl-4">
                <Link to="/notes" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Notes</Link>
              </div>
            )}
          </div>

          <Link to="/training-courses" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 border-t border-gray-200">Training/Courses</Link>

          {/* Mobile Login/User */}
          <div className="border-t border-gray-200 px-4 py-2">
            {user ? (
              <>
                <span className="block text-gray-700 font-bold">{user.name}</span>
                <button onClick={onLogout} className="mt-2 block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
