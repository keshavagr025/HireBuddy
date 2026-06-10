import React from "react";
import { User, LogOut } from "lucide-react";

const UserProfile = ({ isOpen }) => {
  const user = {
    name: "Alex Johnson",
    role: "Premium Member",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
  };

  return (
    <div className={`relative flex items-center gap-3 rounded-xl transition-all duration-300
      ${isOpen ? "bg-slate-800/40 p-2 border border-slate-800/60" : "justify-center p-0"}`}
    >
      {/* Avatar Container */}
      <div className="relative shrink-0">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-9 h-9 rounded-lg object-cover border border-slate-700/80 shadow-md"
        />
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
      </div>

      {/* User Information */}
      {isOpen && (
        <div className="flex flex-col min-w-0 flex-1 justify-center animate-fade-in-up">
          <span className="font-semibold text-xs text-slate-200 truncate">{user.name}</span>
          <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase truncate">{user.role}</span>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
