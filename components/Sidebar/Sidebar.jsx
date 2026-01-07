// Sidebar.jsx
import React, { useState, useEffect } from "react";
import {
  Home,
  Users,
  Settings,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  BookOpen,FileCheck ,Image ,Folder,Bell,
  HelpCircle,
  Newspaper,
  Shield
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import tokenService from "../../src/auth/services/tokenService";
import authService from "../../src/auth/services/authService";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/" },
    // Audit Logs - Only for SUPER_ADMIN
    ...((() => {
      const role = tokenService.getUserRole();
      if (Array.isArray(role)) {
        return role.some(r => String(r).toLowerCase() === 'super_admin');
      }
      return String(role || '').toLowerCase() === 'super_admin';
    })() ? [{
      name: "Audit Logs",
      icon: <Shield size={20} />,
      path: "/admin/audit-logs"
    }] : []),

    {
      name: "Admin Users",
      icon: <Users size={20} />,
      submenu: [
        { name: "All Admin Users", path: "/admin/users" },
        { name: "Add Admin User", path: "/admin/users/add" },
      ],
    },
    {
      name: "Courses",
      icon: <FileText size={20} />,
      submenu: [
        { name: "All Courses", path: "/course/all" },
        { name: "Add Course", path: "/course/add" },
      ],
    },
    {
      name: "Notes",
      icon: <BookOpen size={20} />,
      submenu: [
        { name: "All Notes", path: "/notespage" },
        { name: "Add Note", path: "/notes/add" },
      ],
    },  {
      name: "Syllabus",
      icon: <FileCheck size={20} />,
      submenu: [
        { name: "All Syllabus", path: "/syllabus/all" },
        { name: "Add Syllabus", path: "/syllabus/add" },
      ],
    },
     {
      name: "Ads",
      icon: <Image size={20} />,
      submenu: [
        { name: "All Ads", path: "/ads/all" },
        { name: "Add Ad", path: "/ads/add" },
      ],
    },
    {
      name: "Question",
      icon: <BookOpen size={20} />,
      submenu: [
        { name: "All Question", path: "/question" },
        { name: "Add Question", path: "/question/add" },
      ],
    },
    {
      name: "Old Questions",
      icon: <FileText size={20} />,
      submenu: [
        { name: "All Old Questions", path: "/old-questions/all" },
        { name: "Add Old Question", path: "/old-questions/add" },
      ],
    },
    {
      name: "Notices",
      icon: <Bell size={20} />,
      submenu: [
         { name: "All Notices", path: "/notices/all" },
        { name: "Add Notices", path: "/notices/add" },
      ],
    },
    {
      name: "Blogs",
      icon: <Newspaper size={20} />,
      submenu: [
        { name: "All Blogs", path: "/blogs" },
        { name: "Add Blog", path: "/blogs/add" },
      ],
    },
    {
      name: "Colleges",
      icon: <GraduationCap  size={20} />,
      submenu: [
       
        { name: "All Colleges", path: "/college/all" },
        { name: "Add Colleges", path: "/college/add" },
      ],
    },
    { name: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
    { name: "Training", icon: <BookOpen size={18} />, path: "/training/add" },
    {
      name: "Quiz Management",
      icon: <HelpCircle size={20} />,
      submenu: [
        { name: "Quiz Dashboard", path: "/quiz" },
        { name: "Categories", path: "/quiz/categories" },
        { name: "Courses", path: "/quiz/courses" },
        { name: "Question Sets", path: "/quiz/question-sets" },
        { name: "Questions", path: "/quiz/questions" },
        { name: "Quiz Results", path: "/quiz/results" },
      ],
    },
  ];

  const toggleSubmenu = (name) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (submenu) => submenu?.some((sub) => isActive(sub.path));

  const handleLogout = async () => {
    // Use authService to clear ALL token storage (memory, encrypted LS, legacy)
    await authService.logout();

    // Redirect to login
    navigate("/admin/login", { replace: true });
  };

  return (
    <>
      {/* Custom Scrollbar Styles - Add this inside your component or in globals */}
      <style jsx>{`
        @layer utilities {
          .scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .scrollbar::-webkit-scrollbar-track {
            background: #111827;
            border-radius: 4px;
          }
          .scrollbar::-webkit-scrollbar-thumb {
            background: #4b5563;
            border-radius: 4px;
            border: 2px solid #111827;
            transition: all 0.3s ease;
          }
          .scrollbar::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
            box-shadow: 0 0 8px rgba(139, 92, 246, 0.5);
          }
          .scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #4b5563 #111827;
          }
        }
      `}</style>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-2xl border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold tracking-tight">Entrance CMS</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-all"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 text-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:w-64 lg:w-72 shadow-2xl
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-800 px-6 relative">
          <h1 className="text-2xl font-bold tracking-tight hidden md:block">
            Entrance CMS
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute right-4 p-1 rounded hover:bg-gray-800"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation with Beautiful Scrollbar */}
        <nav className="flex-1 py-6 px-4 overflow-y-auto scrollbar scrollbar-thumb-gray-600 scrollbar-track-gray-900 hover:scrollbar-thumb-violet-500 transition-all">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const hasSubmenu = !!item.submenu;
              const isOpen = openSubmenu === item.name;
              const active = isActive(item.path) || (hasSubmenu && isParentActive(item.submenu));

              return (
                <li key={item.name}>
                  {hasSubmenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                          ${active || isOpen
                            ? "bg-gray-800 text-white shadow-lg font-semibold ring-1 ring-gray-700"
                            : "hover:bg-gray-800 hover:text-white hover:shadow-md"
                          }`}
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`${active ? "text-violet-400" : "text-gray-400"} group-hover:text-white transition-colors`}>
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>

                      {/* Submenu */}
                      <div
                        className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={`block px-10 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                              ${isActive(sub.path)
                                ? "bg-violet-600 text-white shadow-md"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white hover:translate-x-1"
                              }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                        ${isActive(item.path)
                          ? "bg-gray-800 text-white shadow-lg font-semibold ring-1 ring-gray-700"
                          : "hover:bg-gray-800 hover:text-white hover:shadow-md"
                        }`}
                    >
                      <span className={`${isActive(item.path) ? "text-violet-400" : "text-gray-400"} group-hover:text-white transition-colors`}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-800 p-4">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200 font-medium shadow-md"
      onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;