import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  UserCheck,
  Calendar,
  Target,
  BarChart3,
  Users,
  Menu,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import UserProfile from "./UserProfile";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { pathname } = useLocation();

  const navItems = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/applications", label: "Job Tracker", icon: <FileText size={18} />, badge: "Hot" },
    { to: "/resumes", label: "Resume Tracker", icon: <Calendar size={18} /> },
    { to: "/career-roadmap", label: "AI Roadmap", icon: <UserCheck size={18} /> },
    { to: "/salary-insights", label: "Salary Insights", icon: <Target size={18} /> },
    { to: "/mock-interviews", label: "AI Interviews", icon: <Users size={18} />, badge: "AI" },
    { to: "/analytics", label: "Resume Analytics", icon: <BarChart3 size={18} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out z-40
          ${isOpen ? "w-64" : "w-20"}
          bg-slate-900 text-slate-100 border-r border-slate-800/60
          shadow-xl flex flex-col`}
      >
        {/* Top Header Section */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-800/60 shrink-0">
          {isOpen ? (
            <div className="flex items-center space-x-2 animate-fade-in-up">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold bg-gradient-to-r from-indigo-200 to-violet-100 bg-clip-text text-transparent">
                  ReadyBoss
                </h1>
                <p className="text-[10px] text-slate-500 font-medium">Career Assistant</p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                <Sparkles size={16} className="text-white" />
              </div>
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all active:scale-95 shrink-0"
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* User Profile Container */}
        <div className="px-3 py-4 border-b border-slate-800/40 shrink-0">
          <UserProfile isOpen={isOpen} />
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1">
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              // Exact match or active subpaths
              const isActive = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
              return (
                <Link
                  key={index}
                  to={item.to}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 overflow-hidden
                    ${isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                >
                  {/* Icon */}
                  <div className={`shrink-0 transition-colors duration-200 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                    }`}>
                    {item.icon}
                  </div>

                  {/* Label & Badge */}
                  {isOpen && (
                    <div className="flex items-center justify-between flex-1 truncate animate-fade-in-up">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase leading-none
                          ${isActive
                            ? "bg-white/20 text-white"
                            : "bg-indigo-950 text-indigo-400 border border-indigo-900"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Tooltip for Collapsed Sidebar */}
                  {!isOpen && (
                    <div className="absolute left-16 scale-0 group-hover:scale-100 bg-slate-800 text-slate-100 text-[10px] font-bold px-2 py-1 rounded shadow-lg transition-all duration-150 origin-left z-50 pointer-events-none whitespace-nowrap border border-slate-700">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        {isOpen && (
          <div className="p-4 border-t border-slate-800/40 text-center shrink-0">
            <p className="text-[10px] text-slate-600 font-medium">v1.2.0 • Pro Active</p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;