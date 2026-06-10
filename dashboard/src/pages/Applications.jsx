import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Clock,
  ExternalLink,
  Building2,
  DollarSign,
  Users,
  Filter,
  Bell,
  BellOff,
  Sparkles
} from "lucide-react";

const mockJobs = [
  {
    id: "job-1",
    title: "Senior React Developer",
    company: "Google",
    location: "Bangalore (Hybrid)",
    salary: "₹24 - 36 LPA",
    type: "Full-Time",
    postedAt: new Date(Date.now() - 3600000 * 2),
    isNew: true,
    description: "We are looking for a Senior Frontend Developer specializing in React, TypeScript, and high-performance rendering architectures.",
    requirements: ["React", "TypeScript", "Next.js", "Web Performance Optimization"]
  },
  {
    id: "job-2",
    title: "Cloud DevOps Engineer",
    company: "Amazon Web Services",
    location: "Hyderabad (Remote)",
    salary: "₹28 - 42 LPA",
    type: "Full-Time",
    postedAt: new Date(Date.now() - 3600000 * 6),
    isNew: false,
    description: "Join our core AWS DevOps team to manage, optimize, and build scalable Kubernetes clusters and serverless deployment systems.",
    requirements: ["Kubernetes", "AWS", "Terraform", "Docker"]
  },
  {
    id: "job-3",
    title: "Product Designer (UI/UX)",
    company: "Adobe",
    location: "Noida (Office)",
    salary: "₹18 - 26 LPA",
    type: "Full-Time",
    postedAt: new Date(Date.now() - 3600000 * 24),
    isNew: false,
    description: "Looking for an expert visual designer to lead the styling of our next-generation web design templates and interactive workspace dashboards.",
    requirements: ["Figma", "Design Systems", "Prototyping", "User Research"]
  }
];

const Applications = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [newJobsCount, setNewJobsCount] = useState(0);

  // Simulate WebSocket connection / Polling for real-time updates
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
        const res = await fetch(
          `${apiBase}/jobs?query=${searchTerm || "developer"}&location=${locationFilter || "remote"}`
        );
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          // Parse string dates if backend sends them
          const parsed = data.map(j => ({ ...j, postedAt: new Date(j.postedAt) }));
          setJobs(parsed);
        } else {
          // Fallback to high-quality mockup data if backend yields nothing
          setJobs(mockJobs);
        }
        setIsConnected(true);
      } catch (err) {
        console.warn("Backend jobs api disconnected. Loading mock data fallback.");
        setJobs(mockJobs);
        setIsConnected(false);
      }
    };

    fetchJobs();
    const interval = setInterval(fetchJobs, 15000);
    return () => clearInterval(interval);
  }, [searchTerm, locationFilter]);

  // Filter logic
  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (companyFilter) {
      filtered = filtered.filter((job) =>
        job.company.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, locationFilter, companyFilter]);

  const toggleNotifications = () => {
    setNotifications(!notifications);
    if (!notifications) setNewJobsCount(0);
  };

  const formatTimeAgo = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return "Recently";
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 animate-fade-in-up">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Real-Time Job Board
              <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full
                ${isConnected ? "text-emerald-700 bg-emerald-50 border border-emerald-200/50" : "text-amber-700 bg-amber-50 border border-amber-200/50"}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
                {isConnected ? "Live Feed" : "Demo Offline"}
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Discover and apply to active developer roles matching your profile.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end md:self-auto">
          <button
            onClick={toggleNotifications}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold
              ${
                notifications
                  ? "bg-indigo-50/50 border-indigo-100 text-indigo-600 hover:bg-indigo-100/50"
                  : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
              }`}
          >
            {notifications ? (
              <>
                <Bell size={16} />
                <span>Alerts On</span>
              </>
            ) : (
              <>
                <BellOff size={16} />
                <span>Muted</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-4 w-4 text-slate-400" />
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Search Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Keyword or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-150 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-150 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
            />
          </div>

          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Company name..."
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-150 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
            />
          </div>
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className={`bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between overflow-hidden
              ${
                job.isNew
                  ? "ring-2 ring-indigo-500/20 border-indigo-200"
                  : "border-slate-100"
              }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-800">{job.title}</h3>
                    {job.isNew && (
                      <span className="bg-indigo-550/15 text-indigo-650 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-indigo-200/30">
                        <Sparkles size={10} className="animate-spin" />
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      {job.company}
                    </span>
                    <span className="text-slate-200">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {job.location}
                    </span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center space-x-1 text-slate-400 text-[10px] font-medium">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(job.postedAt)}</span>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {job.type}
                  </span>
                </div>
              </div>

              {/* Salary & Details */}
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold mb-3">
                <DollarSign className="h-4 w-4" />
                <span>{job.salary}</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                {job.description}
              </p>

              {/* Requirements tags */}
              <div className="mb-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Skills Required
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.requirements.map((req, index) => (
                    <span
                      key={index}
                      className="bg-slate-550/5 text-slate-600 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-slate-100"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Apply action */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <a
                href="https://careers.google.com"
                target="_blank"
                rel="noreferrer"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Apply Now</span>
              </a>

              <button className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <Users className="mx-auto h-12 w-12 text-slate-300 mb-4 animate-bounce" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No jobs match filters</h3>
          <p className="text-xs text-slate-400">Try broadening your keywords or clearing the filter inputs.</p>
        </div>
      )}
    </div>
  );
};

export default Applications;
