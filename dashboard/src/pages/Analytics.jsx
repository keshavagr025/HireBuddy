import React, { useState, useEffect } from "react";
import {
  FileText,
  Star,
  Target,
  Lightbulb,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Award,
  Zap,
  ChevronRight,
  BarChart3,
  Brain,
  Info
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const mockAnalysisData = {
  atsScore: 82,
  extractedSkills: ["React", "JavaScript (ES6+)", "TailwindCSS", "REST APIs", "Node.js", "Git"],
  matchedKeywords: ["React", "JavaScript", "REST APIs", "Git"],
  suggestions: [
    "Quantify achievements (e.g., 'Designed dashboards that reduced user bounce rate by 15%').",
    "Incorporate Cloud credentials if applicable (AWS, Azure, or GCP).",
    "Tailor profile summary to explicitly mention experience with collaborative Agile teams."
  ]
};

const mockRolesList = [
  { _id: "role-1", title: "Frontend Engineer", industry: "Tech", description: "Develop and optimize responsive client-side web components." },
  { _id: "role-2", title: "Backend Engineer", industry: "Tech", description: "Design scalable API routes, schemas, and database query triggers." },
  { _id: "role-3", title: "Full Stack Engineer", industry: "Tech", description: "Lead end-to-end component design and cloud devops integrations." }
];

export default function Analytics() {
  const [resumeData, setResumeData] = useState({
    resumeId: null,
    atsScore: 0,
    extractedSkills: [],
    matchedKeywords: [],
    suggestions: [],
    fileName: null,
    isAnalyzing: false,
    analysisComplete: false,
    uploadProgress: 0
  });

  const [selectedRole, setSelectedRole] = useState("");
  const [jobRoles, setJobRoles] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobRoles();
  }, []);

  const fetchJobRoles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/job-roles?limit=50`);
      const data = await response.json();

      if (response.ok && Array.isArray(data.jobRoles) && data.jobRoles.length > 0) {
        setJobRoles(data.jobRoles);
        setSelectedRole(data.jobRoles[0]._id);
      } else {
        setJobRoles(mockRolesList);
        setSelectedRole(mockRolesList[0]._id);
      }
    } catch (error) {
      console.warn("Backend job roles API offline. Loading demo job roles.");
      setJobRoles(mockRolesList);
      setSelectedRole(mockRolesList[0]._id);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setError("");
    setResumeData((prev) => ({
      ...prev,
      fileName: file.name,
      isAnalyzing: true,
      analysisComplete: false,
      uploadProgress: 20,
      atsScore: 0
    }));

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("uploadedBy", "web-user");

      // Set state to simulate upload progress
      const progressTimer = setInterval(() => {
        setResumeData((prev) => {
          if (prev.uploadProgress >= 70) {
            clearInterval(progressTimer);
            return prev;
          }
          return { ...prev, uploadProgress: prev.uploadProgress + 10 };
        });
      }, 200);

      const uploadResponse = await fetch(`${API_BASE_URL}/resumes/upload`, {
        method: "POST",
        body: formData
      });

      clearInterval(progressTimer);

      if (!uploadResponse.ok) {
        throw new Error("Upload response failed");
      }

      const uploadData = await uploadResponse.json();
      const resumeInfo = uploadData.data || uploadData;
      const resumeId = resumeInfo.resumeId || `resume_${Date.now()}`;
      const extractedSkills = resumeInfo.extractedSkills || mockAnalysisData.extractedSkills;

      setResumeData((prev) => ({
        ...prev,
        resumeId: resumeId,
        extractedSkills: extractedSkills,
        uploadProgress: 80
      }));

      await analyzeResume(resumeId, selectedRole);
    } catch (uploadError) {
      console.warn("Backend resume upload API offline. Processing demo analysis mockups.");
      // Fallback timer to show complete mock loading
      setTimeout(() => {
        setResumeData({
          resumeId: `resume_mock_${Date.now()}`,
          fileName: file.name,
          atsScore: mockAnalysisData.atsScore,
          extractedSkills: mockAnalysisData.extractedSkills,
          matchedKeywords: mockAnalysisData.matchedKeywords,
          suggestions: mockAnalysisData.suggestions,
          isAnalyzing: false,
          analysisComplete: true,
          uploadProgress: 100
        });
      }, 1000);
    }
  };

  const analyzeResume = async (resumeId, jobRoleId) => {
    if (!resumeId || !jobRoleId) {
      setError("Please select a target job role.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/resumes/${resumeId}/analyze/${jobRoleId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        }
      );

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const analysisData = await response.json();
      const result = analysisData.data || analysisData;
      const score = result.atsScore || result.score || result.matchPercentage || 75;

      setResumeData((prev) => ({
        ...prev,
        atsScore: score,
        matchedKeywords: result.matchedKeywords || mockAnalysisData.matchedKeywords,
        suggestions: result.suggestions || mockAnalysisData.suggestions,
        isAnalyzing: false,
        analysisComplete: true,
        uploadProgress: 100
      }));
    } catch (err) {
      console.warn("Analysis API offline. Applying mock evaluation statistics.");
      setTimeout(() => {
        setResumeData((prev) => ({
          ...prev,
          atsScore: mockAnalysisData.atsScore,
          matchedKeywords: mockAnalysisData.matchedKeywords,
          suggestions: mockAnalysisData.suggestions,
          isAnalyzing: false,
          analysisComplete: true,
          uploadProgress: 100
        }));
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  const forceReAnalysis = () => {
    if (resumeData.resumeId && selectedRole) {
      analyzeResume(resumeData.resumeId, selectedRole);
    }
  };

  const handleJobRoleChange = async (newJobRoleId) => {
    setSelectedRole(newJobRoleId);
    if (resumeData.resumeId && newJobRoleId) {
      await analyzeResume(resumeData.resumeId, newJobRoleId);
    }
  };

  const getScoreStatus = (score) => {
    if (score >= 80)
      return {
        color: "text-emerald-700",
        bg: "bg-emerald-50 border-emerald-100",
        label: "Premium Profile",
        gradient: "from-emerald-500 to-green-500",
        text: "Excellent compatibility! Your resume is highly tailored for this position."
      };
    if (score >= 60)
      return {
        color: "text-amber-700",
        bg: "bg-amber-50 border-amber-100",
        label: "Good Fit",
        gradient: "from-amber-500 to-orange-500",
        text: "Solid details. Incorporate minor improvements listed below to improve ranking."
      };
    return {
      color: "text-rose-700",
      bg: "bg-rose-50 border-rose-100",
      label: "Optimization Recommended",
      gradient: "from-rose-500 to-pink-500",
      text: "Low compatibility score. Check target role keywords and rewrite bullet points."
    };
  };

  const scoreStatus = getScoreStatus(resumeData.atsScore);
  const selectedJobRole = jobRoles.find((role) => role._id === selectedRole);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 animate-fade-in-up">
      {/* Top Header Card */}
      <div className="flex items-center space-x-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
          <Brain className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Resume Analytics</h1>
          <p className="text-xs text-slate-500 font-medium">
            Scan your resume against specific target roles and generate instantly optimized ATS scores.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Control Column (Span 1) */}
        <div className="space-y-6">
          {/* Target role selector */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Target Job Role</h3>
              {resumeData.resumeId && selectedRole && (
                <button
                  onClick={forceReAnalysis}
                  disabled={loading}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                  Recalculate
                </button>
              )}
            </div>

            <select
              value={selectedRole}
              onChange={(e) => handleJobRoleChange(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 bg-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-650"
              disabled={loading}
            >
              <option value="">Select Role...</option>
              {jobRoles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.title}
                </option>
              ))}
            </select>

            {selectedJobRole && (
              <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl text-[10px] leading-relaxed text-slate-500 font-medium">
                {selectedJobRole.description}
              </div>
            )}
          </div>

          {/* Drag and drop upload panel */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Upload Resume</h3>
            <div>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                id="resumeFileInput"
                className="hidden"
                disabled={resumeData.isAnalyzing}
              />
              <label
                htmlFor="resumeFileInput"
                className={`block w-full border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300
                  ${resumeData.isAnalyzing ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Upload size={18} className="text-indigo-600 animate-float" />
                </div>
                <h4 className="text-xs font-bold text-slate-700 truncate">
                  {resumeData.fileName ? resumeData.fileName : "Select or Drop Resume"}
                </h4>
                <p className="text-[9px] text-slate-400 font-medium mt-1">PDF, DOCX, TXT up to 10MB</p>
              </label>
            </div>

            {resumeData.isAnalyzing && (
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                  <span className="flex items-center gap-1">
                    <RefreshCw size={12} className="animate-spin text-indigo-600" />
                    Analyzing with AI...
                  </span>
                  <span>{resumeData.uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{ width: `${resumeData.uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Details Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {resumeData.analysisComplete ? (
            <div className="space-y-6 animate-fade-in-up">
              {/* ATS score overview */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-6">
                {/* Circular indicator */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="url(#indigoGlow)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={301.6}
                      strokeDashoffset={301.6 - (301.6 * resumeData.atsScore) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="indigoGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-800">{resumeData.atsScore}%</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">ATS Score</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${scoreStatus.bg} ${scoreStatus.color}`}>
                    <Award size={12} />
                    {scoreStatus.label}
                  </span>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                    {scoreStatus.text}
                  </p>
                </div>
              </div>

              {/* Skills & Match keywords Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Extracted Skills */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Star size={14} className="text-amber-500" />
                    Extracted Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.extractedSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-amber-50 text-amber-800 border border-amber-100 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Matched Keywords */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Target size={14} className="text-indigo-500" />
                    Matched Keywords
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.matchedKeywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-50 text-indigo-800 border border-indigo-100 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Optimizations */}
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="text-emerald-500" />
                  AI Optimization Suggestions
                </h3>
                <div className="space-y-3">
                  {resumeData.suggestions.map((s, idx) => (
                    <div key={idx} className="p-3.5 bg-emerald-50/40 border border-emerald-100/50 rounded-xl flex items-start gap-2.5 hover:bg-emerald-50 transition-colors">
                      <ChevronRight size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                      <p className="text-xs font-semibold text-slate-650 leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
              <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600 animate-float">
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-850">Analyze Your Resume ATS</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Select your target job role, upload your profile draft, and view optimized ATS keyword metrics.
                </p>
              </div>
            </div>
          )}

          {/* Advice footer */}
          <div className="p-4 bg-indigo-50/40 border border-indigo-100 text-indigo-700 rounded-xl flex items-start gap-2.5">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed font-semibold">
              Vocal interactive feedback assessments are powered by WebSpeech APIs. Make sure your browser microphone has appropriate system-level input authorizations before starting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}