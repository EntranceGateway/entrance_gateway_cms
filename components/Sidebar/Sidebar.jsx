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
  ChevronUp,GraduationCap,BookOpen
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();

  // Close sidebar when route changes (especially on mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/" },
    {
      name: "Users",
      icon: <Users size={20} />,
      submenu: [
        { name: "All Users", path: "/admin/users" },
        { name: "Add User", path: "/admin/users/add" },
      ],
    },
    {
      name: "Courses",
      icon: <FileText size={20} />,
      submenu: [
        { name: "All Courses", path: "/admin/courses" },
        { name: "Add Course", path: "/admin/courses/add" },
      ],
    },{ 
    name: "Notes", 
    icon: <BookOpen size={20} />, 
    submenu: [
      { name: "All Notes", path: "/notespage" },
      { name: "Add Note", path: "/notes/add" },
    ] 
  },
  
  
      { name: "Colleges", icon: <GraduationCap size={20} />, path: "/college/add" },

    { name: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
        { name: "Training", icon: <BookOpen size={18} />, path: "/traning/add" },
  ];
  

  const toggleSubmenu = (name) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const isActive = (path) => location.pathname === path;

  const isParentActive = (submenu) => {
    return submenu?.some((sub) => isActive(sub.path));
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold tracking-tight">Entrance CMS</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
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
          md:translate-x-0 md:static md:w-64 lg:w-72
        `}
      >
        {/* Logo / Header */}
        <div className="h-16 flex items-center justify-center border-b border-gray-800 px-6">
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const hasSubmenu = !!item.submenu;
              const isOpen = openSubmenu === item.name;
              const active = isActive(item.path) || (hasSubmenu && isParentActive(item.submenu));

              return (
                <li key={item.name}>
                  {hasSubmenu ? (
                    <>
                      {/* Parent Menu Item */}
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                          ${active || isOpen
                            ? "bg-gray-800 text-white shadow-md font-medium"
                            : "hover:bg-gray-800 hover:text-white"
                          }`}
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-center gap-3">
                          <span className={active ? "text-blue-400" : "text-gray-400 group-hover:text-white"}>
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                          <ChevronDown size={18} />
                        </span>
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
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
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
                          ? "bg-gray-800 text-white shadow-md font-medium"
                          : "hover:bg-gray-800 hover:text-white"
                        }`}
                    >
                      <span className={isActive(item.path) ? "text-blue-400" : "text-gray-400 group-hover:text-white"}>
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

        {/* Logout Button */}
        <div className="border-t border-gray-800 p-4">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all duration-200 font-medium"
            onClick={() => {
              // Handle logout
              console.log("Logging out...");
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;