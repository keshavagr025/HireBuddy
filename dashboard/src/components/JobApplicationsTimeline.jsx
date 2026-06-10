import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Briefcase,
  CheckCircle,
  Clock3,
  XCircle,
  Send,
  Building2,
  MapPin,
  Sparkles,
  ChevronDown,
  DollarSign
} from "lucide-react";

const JobApplicationsTimeline = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const jobApplications = [
    {
      id: 1,
      company: "Google",
      role: "Frontend Developer",
      status: "Interview",
      date: "2026-06-08",
      salary: "₹25 - 35 LPA",
      location: "Bangalore, India",
      notes: "Technical round scheduled. Reviewing React performance and system design notes.",
      logo: "Google"
    },
    {
      id: 2,
      company: "Amazon",
      role: "Backend Engineer",
      status: "Under Review",
      date: "2026-06-05",
      salary: "₹30 - 40 LPA",
      location: "Hyderabad, India",
      notes: "Online assessment completed. Waiting for results.",
      logo: "Amazon"
    },
    {
      id: 3,
      company: "Flipkart",
      role: "Full Stack Developer",
      status: "Applied",
      date: "2026-06-07",
      salary: "₹18 - 25 LPA",
      location: "Bangalore, India",
      notes: "Application submitted via referral. Internal review ongoing.",
      logo: "Flipkart"
    },
    {
      id: 4,
      company: "Adobe",
      role: "UI/UX Designer",
      status: "Rejected",
      date: "2026-06-03",
      salary: "₹20 - 28 LPA",
      location: "Noida, India",
      notes: "Thank you for applying. Portfolio didn't match the current team requirements.",
      logo: "Adobe"
    }
  ];

  const getStatusMeta = (status) => {
    switch (status) {
      case "Interview":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: "text-emerald-700 bg-emerald-50 border-emerald-100",
          dot: "bg-emerald-500 ring-emerald-100",
          line: "bg-emerald-100"
        };
      case "Under Review":
        return {
          icon: <Clock3 className="w-4 h-4" />,
          color: "text-amber-700 bg-amber-50 border-amber-100",
          dot: "bg-amber-500 ring-amber-100",
          line: "bg-amber-100"
        };
      case "Rejected":
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: "text-rose-700 bg-rose-50 border-rose-100",
          dot: "bg-rose-500 ring-rose-100",
          line: "bg-rose-100"
        };
      case "Applied":
      default:
        return {
          icon: <Send className="w-4 h-4" />,
          color: "text-indigo-700 bg-indigo-50 border-indigo-100",
          dot: "bg-indigo-500 ring-indigo-100",
          line: "bg-indigo-100"
        };
    }
  };

  const filteredApps = activeFilter === "all"
    ? jobApplications
    : jobApplications.filter(app => app.status === activeFilter);

  return (
    <div className="w-full space-y-6">
      {/* Quick Filter Badges */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
        {["all", "Applied", "Under Review", "Interview", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200
              ${
                activeFilter === status
                  ? "bg-slate-900 border-slate-950 text-white shadow-sm"
                  : "bg-white border-slate-100 hover:bg-slate-50 text-slate-500"
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-8">
        {/* Main timeline center line */}
        <div className="absolute left-2.5 top-2 bottom-2 w-[1.5px] bg-slate-100" />

        {filteredApps.map((item, index) => {
          const meta = getStatusMeta(item.status);
          return (
            <div key={item.id} className="relative group">
              {/* Chronological dot indicator */}
              <div
                className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full ${meta.dot} ring-4 border border-white z-10 transition-transform duration-300 group-hover:scale-120`}
              />

              {/* Box Wrapper */}
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4">
                  {/* Dynamic Logo Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 select-none">
                    {item.company.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {item.role}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Building2 size={12} className="text-slate-400" />
                        {item.company}
                      </span>
                      <span className="text-slate-200">•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" />
                        {item.location}
                      </span>
                      <span className="text-slate-200">•</span>
                      <span className="flex items-center gap-1 text-emerald-600">
                        <DollarSign size={12} />
                        {item.salary}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="mt-3 text-[11px] leading-relaxed text-slate-450 italic border-l-2 border-indigo-200 pl-3">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right badges / actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 shrink-0">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border shrink-0 ${meta.color}`}
                  >
                    {meta.icon}
                    {item.status}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 md:text-right shrink-0">
                    <Calendar size={12} className="text-slate-400" />
                    <span>Applied {new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredApps.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs font-semibold">
            No milestones found matching filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationsTimeline;