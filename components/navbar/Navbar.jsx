// Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Bell, Settings, LogOut, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAdmin } from "../../src/http/adminget";



const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [admin, setAdmin] = useState(null);

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  /* =======================
     AUTH + ADMIN FETCH
     ======================= */
  useEffect(() => {
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    let isMounted = true;

    const fetchAdminDetails = async () => {
      try {
        const res = await getAdmin({}, token);

        // Flexible handling depending on backend response shape
        const adminData = res.data?.data || res.data?.admin;
        if (adminData && isMounted) {
          setAdmin(adminData);
        } else {
          navigate("/admin/login", { replace: true });
        }
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/admin/login", { replace: true });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

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
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
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
              <div className="w-9 h-9 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {admin?.email?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {admin?.role || "ADMIN"}
                </p>
                <p className="text-xs text-gray-500">
                  {admin?.email || ""}
                </p>
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
                  <p className="text-sm text-gray-500">
                    {admin?.email}
                  </p>
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
