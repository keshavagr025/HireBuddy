import React, { useState } from "react";
import {
  FileText,
  Search,
  Calendar,
  Briefcase,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Trash2,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";

export default function ResumeTracker() {
  const [resumes, setResumes] = useState([
    {
      id: 1,
      company: "Google",
      position: "Frontend Developer",
      date: "2026-05-01",
      status: "Reviewed",
      notes: "Tailored portfolio for performance focus."
    },
    {
      id: 2,
      company: "Amazon",
      position: "Backend Engineer",
      date: "2026-05-10",
      status: "Interview",
      notes: "DSA practice started."
    },
    {
      id: 3,
      company: "Microsoft",
      position: "Full Stack Developer",
      date: "2026-05-15",
      status: "Rejected",
      notes: "Resume rejected at screening."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResume, setNewResume] = useState({
    company: "",
    position: "",
    status: "Applied",
    notes: ""
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Reviewed":
        return "text-blue-700 bg-blue-50 border-blue-100";
      case "Interview":
        return "text-emerald-700 bg-emerald-50 border-emerald-100";
      case "Rejected":
        return "text-rose-700 bg-rose-50 border-rose-100";
      case "Applied":
      default:
        return "text-indigo-700 bg-indigo-50 border-indigo-100";
    }
  };

  const handleDelete = (id) => {
    setResumes(resumes.filter((r) => r.id !== id));
  };

  const handleAddResume = (e) => {
    e.preventDefault();
    if (!newResume.company || !newResume.position) return;

    setResumes([
      ...resumes,
      {
        id: Date.now(),
        company: newResume.company,
        position: newResume.position,
        status: newResume.status,
        notes: newResume.notes,
        date: new Date().toISOString().split("T")[0]
      }
    ]);

    setNewResume({ company: "", position: "", status: "Applied", notes: "" });
    setShowAddForm(false);
  };

  const filteredResumes = resumes
    .filter((r) =>
      r.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.position.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((r) => statusFilter === "all" || r.status === statusFilter);

  // Statistics
  const stats = {
    total: resumes.length,
    interviews: resumes.filter((r) => r.status === "Interview").length,
    reviewed: resumes.filter((r) => r.status === "Reviewed").length,
    applied: resumes.filter((r) => r.status === "Applied").length
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 animate-fade-in-up">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Resume Tracker</h1>
            <p className="text-xs text-slate-500 font-medium">
              Manage your resumes tailored for different job profiles and companies.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all active:scale-95 self-end md:self-auto"
        >
          <Plus size={14} />
          Track Resume
        </button>
      </div>

      {/* Mini stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Tracking", val: stats.total, color: "text-slate-700 bg-slate-100" },
          { label: "Interviews", val: stats.interviews, color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
          { label: "Reviewed", val: stats.reviewed, color: "text-blue-700 bg-blue-50 border-blue-100" },
          { label: "Applied Only", val: stats.applied, color: "text-indigo-700 bg-indigo-50 border-indigo-100" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
            <h4 className="text-xl font-black text-slate-850 mt-1">{item.val}</h4>
          </div>
        ))}
      </div>

      {/* Add Resume Dialog (Inline Toggle) */}
      {showAddForm && (
        <div className="bg-white border border-indigo-100 p-5 rounded-2xl shadow-md animate-fade-in-up">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
            <Sparkles size={14} className="text-indigo-600" />
            Track a New Resume
          </h3>
          <form onSubmit={handleAddResume} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Company Name</label>
              <input
                type="text"
                placeholder="Google, Amazon..."
                required
                value={newResume.company}
                onChange={(e) => setNewResume({ ...newResume, company: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Target Position</label>
              <input
                type="text"
                placeholder="Software Engineer..."
                required
                value={newResume.position}
                onChange={(e) => setNewResume({ ...newResume, position: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Status</label>
              <select
                value={newResume.status}
                onChange={(e) => setNewResume({ ...newResume, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Applied">Applied</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Quick Notes</label>
              <input
                type="text"
                placeholder="Notes..."
                value={newResume.notes}
                onChange={(e) => setNewResume({ ...newResume, notes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-2 pt-2 border-t border-slate-50 mt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-500 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
              >
                Add Details
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search company or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-150 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-600"
          >
            <option value="all">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Resumes List Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-150 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Company</th>
                <th className="py-3 px-6">Target Position</th>
                <th className="py-3 px-6">Date Tracked</th>
                <th className="py-3 px-6">Notes</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {filteredResumes.map((resume) => (
                <tr key={resume.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-black text-slate-700 text-[10px]">
                      {resume.company.charAt(0)}
                    </div>
                    {resume.company}
                  </td>
                  <td className="py-4 px-6">{resume.position}</td>
                  <td className="py-4 px-6 text-slate-400">{resume.date}</td>
                  <td className="py-4 px-6 max-w-xs truncate text-slate-500 italic">
                    {resume.notes || "—"}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${getStatusStyle(resume.status)}`}>
                      {resume.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredResumes.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 font-semibold">
                    No tracked resumes found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
