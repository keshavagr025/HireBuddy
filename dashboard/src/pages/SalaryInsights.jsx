import React, { useState } from "react";
import {
  DollarSign,
  MapPin,
  Briefcase,
  Search,
  AlertCircle,
  TrendingUp,
  Users,
  Star,
  Sparkles,
  Info
} from "lucide-react";

const SalaryInsights = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getSalaryData = async (title, expLevel, locName) => {
    // Simulated delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const baseSalary = {
      "software engineer": 850000,
      "data scientist": 950000,
      "product manager": 1100000,
      designer: 700000,
      "marketing manager": 750000,
      "frontend developer": 800000,
      "backend developer": 880000,
      "devops engineer": 920000
    };

    const experienceMultiplier = {
      entry: 0.8,
      mid: 1.0,
      senior: 1.3,
      lead: 1.6
    };

    const locationMultiplier = {
      bangalore: 1.2,
      hyderabad: 1.1,
      mumbai: 1.15,
      pune: 1.0,
      delhi: 1.05,
      remote: 0.95,
      noida: 1.0
    };

    const job = title.toLowerCase().trim();
    const exp = expLevel.toLowerCase();
    const loc = locName.toLowerCase().trim();

    const base = baseSalary[job] || 750000;
    const expMult = experienceMultiplier[exp] || 1.0;
    const locMult = locationMultiplier[loc] || 1.0;

    const avgSalary = Math.round(base * expMult * locMult);
    const minSalary = Math.round(avgSalary * 0.85);
    const maxSalary = Math.round(avgSalary * 1.15);

    return {
      jobTitle: title,
      experience: expLevel,
      location: locName,
      avgSalary,
      minSalary,
      maxSalary,
      confidence: Math.floor(Math.random() * 15) + 85, // 85-99%
      marketTrend: Math.random() > 0.4 ? "growing" : "stable"
    };
  };

  const handleSearch = async () => {
    if (!jobTitle.trim()) {
      setError("Please input a target job title.");
      return;
    }
    if (!experience) {
      setError("Please select your experience level.");
      return;
    }
    if (!location.trim()) {
      setError("Please input a target location.");
      return;
    }

    setLoading(true);
    setError("");
    setSalaryData(null);

    try {
      const data = await getSalaryData(jobTitle, experience, location);
      setSalaryData(data);
    } catch (err) {
      setError("Error compiling salary statistics. Please query again.");
    } finally {
      setLoading(false);
    }
  };

  const popularRoles = [
    "Frontend Developer",
    "Backend Developer",
    "Software Engineer",
    "Data Scientist",
    "Product Manager"
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 animate-fade-in-up">
      {/* Top Header Card */}
      <div className="flex items-center space-x-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
          <DollarSign className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Salary Insights</h1>
          <p className="text-xs text-slate-500 font-medium">
            Discover average compensation ranges based on role, location, and seniority variables.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Search Panel (Span 1) */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Configure Query</h3>
          <div className="space-y-4">
            {/* Job Title */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Job Title</label>
              <input
                type="text"
                placeholder="e.g., Frontend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <div className="mt-2 flex flex-wrap gap-1">
                {popularRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setJobTitle(role)}
                    className="text-[9px] font-bold px-2 py-0.5 bg-indigo-50/40 text-indigo-600 hover:bg-indigo-100/40 rounded-full border border-indigo-100/30 transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Seniority</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select Level</option>
                <option value="entry">🌱 Entry-level (0 - 2 yrs)</option>
                <option value="mid">🚀 Mid-level (3 - 5 yrs)</option>
                <option value="senior">⭐ Senior-level (6 - 10 yrs)</option>
                <option value="lead">👑 Principal / Lead (10+ yrs)</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Target Location</label>
              <input
                type="text"
                placeholder="e.g., Bangalore, Remote..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Market...</span>
                </>
              ) : (
                <>
                  <Search size={14} />
                  <span>Analyze Insights</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-[10px] rounded-xl font-medium flex items-center gap-1.5 animate-pulse">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Panel (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {salaryData ? (
            <div className="space-y-6 animate-fade-in-up">
              {/* Metrics cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between h-32">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Market Average</span>
                  <div>
                    <h3 className="text-xl font-black">{formatCurrency(salaryData.avgSalary)}</h3>
                    <p className="text-[9px] opacity-75 mt-0.5">Estimated per annum</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between h-32">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Salary Range</span>
                  <div>
                    <h3 className="text-base font-black truncate">
                      {formatCurrency(salaryData.minSalary)} - {formatCurrency(salaryData.maxSalary)}
                    </h3>
                    <p className="text-[9px] opacity-75 mt-0.5">25th to 75th percentile</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-violet-500 to-violet-600 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between h-32">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Data Confidence</span>
                  <div>
                    <h3 className="text-xl font-black">{salaryData.confidence}%</h3>
                    <div className="w-full bg-white/20 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-white h-full" style={{ width: `${salaryData.confidence}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail specs */}
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Market Parameters</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Selected Role</span>
                    <p className="font-bold text-slate-700 mt-1">{salaryData.jobTitle}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Seniority Level</span>
                    <p className="font-bold text-slate-700 mt-1 capitalize">{salaryData.experience}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Target Location</span>
                    <p className="font-bold text-slate-700 mt-1">{salaryData.location}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Market Trend</span>
                    <p className="font-bold text-emerald-600 mt-1 flex items-center gap-0.5 capitalize">
                      <TrendingUp size={12} />
                      {salaryData.marketTrend}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informative advice note */}
              <div className="p-4 bg-indigo-50/40 border border-indigo-100 text-indigo-700 rounded-xl flex items-start gap-2.5">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed font-semibold">
                  These insights are compiled using mock datasets, localized adjustments, and statistical variance models. Actual offers will vary based on variables such as company headcount, equity bonuses, and benefit distributions.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
              <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600 animate-float">
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-850">Ready to Explore Salaries?</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Fill in the options on the left to queries localized compensation figures and trends.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryInsights;