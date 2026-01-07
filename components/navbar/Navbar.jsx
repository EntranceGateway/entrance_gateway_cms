// Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Bell, Settings, LogOut, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAdmin } from "../../src/http/adminget";
import authService from "../../src/auth/services/authService";
import tokenService from "../../src/auth/services/tokenService";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [admin, setAdmin] = useState(() => {
    // Load from localStorage if exists
    const saved = localStorage.getItem("admin");
    return saved ? JSON.parse(saved) : null;
  });

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();
  // Use tokenService to get token, ensuring consistency with other auth checks
  const token = tokenService.getAccessToken();

  /* =======================
     AUTH + ADMIN FETCH
     ======================= */
  useEffect(() => {
    if (!token) {
      // delay redirect slightly to ensure state is settled
      navigate("/admin/login", { replace: true });
      return;
    }

    let isMounted = true;

    const fetchAdminDetails = async () => {
      try {
        const res = await getAdmin(token);
        const adminData = res.data?.data || res.data?.admin || res.data;

        if (adminData && isMounted) {
          setAdmin(adminData);
          localStorage.setItem("admin", JSON.stringify(adminData));
        }
      } catch (error) {
        console.error("Failed to fetch admin details:", error);
        // Only redirect on 401 unauthorized
        if (error?.response?.status === 401 || error?.status === 401) {
          await authService.logout();
          navigate("/admin/login", { replace: true });
        }
      }
    };

    // Fetch admin data on mount
    fetchAdminDetails();

    return () => {
      isMounted = false;
    };
  }, [token, navigate]);

  /* =======================
     CLICK OUTSIDE HANDLER
     ======================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =======================
     LOGOUT
     ======================= */
  const handleLogout = async () => {
    await authService.logout();
    navigate("/admin/login", { replace: true });
  };

  /* =======================
     RENDER
     ======================= */
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 hidden md:block">
            Dashboard
          </h2>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 rounded-full hover:bg-gray-100 transition"
            >
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b font-medium">
                  Notifications
                </div>
                <div className="px-4 py-3 text-sm text-gray-500">
                  No new notifications
                </div>
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {admin?.name 
                  ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  : admin?.role === 'SUPER_ADMIN' 
                    ? 'SA' 
                    : admin?.email?.charAt(0)?.toUpperCase() || 'A'}
              </div>

              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {admin?.name || (admin?.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : admin?.role || 'ADMIN')}
                </p>
                <p className="text-xs text-gray-500">{admin?.email || ""}</p>
              </div>

              <ChevronDown
                size={16}
                className={`transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border overflow-hidden">
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold text-gray-800">
                    {admin?.name?.trim()
                      ? admin.name
                      : admin?.role === "SUPER_ADMIN"
                      ? "Super Admin"
                      : "Admin"}
                  </p>
                  <p className="text-sm text-gray-500">{admin?.email}</p>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => navigate("/admin/profile")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50"
                  >
                    <User size={18} />
                    My Profile
                  </button>

                  <button
                    onClick={() => navigate("/admin/settings")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50"
                  >
                    <Settings size={18} />
                    Settings
                  </button>
                </div>

                <div className="border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 font-medium"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;