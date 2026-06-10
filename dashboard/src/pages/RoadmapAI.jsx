import React, { useState } from "react";
import {
  ChevronRight,
  BookOpen,
  Video,
  Trophy,
  Clock,
  Star,
  Zap,
  Code,
  Brain,
  Database,
  Smartphone,
  Palette,
  BarChart,
  ChevronLeft,
  Sparkles,
  ArrowRight
} from "lucide-react";

const LearningRoadmapGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    name: "",
    currentLevel: "",
    targetRole: "",
    timeCommitment: "",
    learningStyle: "",
    budget: ""
  });
  const [roadmap, setRoadmap] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const roles = [
    { id: "fullstack", name: "Full Stack Developer", icon: Code, color: "from-blue-500 to-indigo-600" },
    { id: "ai-engineer", name: "AI Engineer", icon: Brain, color: "from-emerald-500 to-teal-600" },
    { id: "data-scientist", name: "Data Scientist", icon: BarChart, color: "from-purple-500 to-pink-600" },
    { id: "mobile-dev", name: "Mobile Developer", icon: Smartphone, color: "from-orange-550 to-rose-600" },
    { id: "devops", name: "DevOps Engineer", icon: Database, color: "from-cyan-550 to-blue-600" },
    { id: "ui-ux", name: "UI/UX Designer", icon: Palette, color: "from-rose-500 to-pink-600" }
  ];

  const skillLevels = ["Beginner", "Intermediate", "Advanced"];
  const timeCommitments = ["1-2 hours/day", "3-4 hours/day", "5+ hours/day"];
  const learningStyles = ["Visual (Videos)", "Reading (Documentation)", "Hands-on (Projects)", "Mixed"];
  const budgets = ["Free only", "Under $50/month", "Under $100/month", "No budget limit"];

  const generateRoadmap = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const roadmapData = {
        fullstack: {
          title: "Full Stack Developer Career Pathway",
          duration: "4 - 6 Months Plan",
          phases: [
            {
              name: "Frontend Core & Responsive Styling",
              duration: "4 - 6 Weeks",
              skills: ["HTML5", "CSS3", "JavaScript ES6+", "TailwindCSS"],
              resources: [
                { type: "youtube", name: "FreeCodeCamp Responsive Web Design", url: "youtube.com", rating: 4.9 },
                { type: "course", name: "JavaScript Complete Guide (Udemy)", price: "Free", rating: 4.8 },
                { type: "project", name: "Build Personal Developer Portfolio", difficulty: "Beginner" }
              ]
            },
            {
              name: "Modern Framework Mastery (React & Next)",
              duration: "3 - 4 Weeks",
              skills: ["React Hooks", "State Management", "Next.js App Router", "Server Components"],
              resources: [
                { type: "youtube", name: "Next.js 14 Dashboard Course", url: "nextjs.org", rating: 4.9 },
                { type: "course", name: "React - Complete Roadmap", price: "$12", rating: 4.7 },
                { type: "project", name: "Build a Task Planner Dashboard", difficulty: "Intermediate" }
              ]
            },
            {
              name: "Backend Infrastructures & Integrations",
              duration: "4 - 5 Weeks",
              skills: ["Node.js", "Express.js", "PostgreSQL / MongoDB", "REST & GraphQL"],
              resources: [
                { type: "youtube", name: "Node.js REST API crash course", url: "youtube.com", rating: 4.8 },
                { type: "course", name: "Backend Masterclass", price: "$15", rating: 4.6 },
                { type: "project", name: "Fullstack Job Board Portal", difficulty: "Advanced" }
              ]
            }
          ]
        },
        "ai-engineer": {
          title: "Artificial Intelligence Career Pathway",
          duration: "6 - 8 Months Plan",
          phases: [
            {
              name: "Math Foundations & Python Analytics",
              duration: "3 - 4 Weeks",
              skills: ["Python Advanced", "Linear Algebra", "Calculus & Probability", "NumPy & Pandas"],
              resources: [
                { type: "youtube", name: "Python for AI - FreeCodeCamp", url: "youtube.com", rating: 4.9 },
                { type: "course", name: "Mathematics for Machine Learning", price: "Free", rating: 4.8 },
                { type: "project", name: "Exploratory Data Analysis Project", difficulty: "Beginner" }
              ]
            },
            {
              name: "Classical ML Algorithms & Evaluation",
              duration: "6 - 8 Weeks",
              skills: ["Scikit-learn", "Regression & Classification", "Random Forests", "Hyperparameter Tuning"],
              resources: [
                { type: "youtube", name: "Stanford Machine Learning Lectures", url: "youtube.com", rating: 4.9 },
                { type: "course", name: "Andrew Ng ML Specialization", price: "Free Audit", rating: 4.9 },
                { type: "project", name: "Salary Prediction Regressor", difficulty: "Intermediate" }
              ]
            },
            {
              name: "Deep Learning & Generative Architectures",
              duration: "8 - 10 Weeks",
              skills: ["PyTorch", "Neural Networks", "CNNs & RNNs", "Transformers & LLMs"],
              resources: [
                { type: "youtube", name: "Deep Learning Series - 3Blue1Brown", url: "youtube.com", rating: 4.8 },
                { type: "course", name: "PyTorch Course for Beginners", price: "Free", rating: 4.7 },
                { type: "project", name: "Build a Custom RAG Chatbot App", difficulty: "Advanced" }
              ]
            }
          ]
        }
      };

      setRoadmap(roadmapData[userProfile.targetRole] || roadmapData.fullstack);
      setIsGenerating(false);
    }, 2000);
  };

  const steps = [
    { title: "Profile", icon: "👤" },
    { title: "Skill", icon: "📊" },
    { title: "Goal", icon: "🎯" },
    { title: "Settings", icon: "⚙️" },
    { title: "Roadmap", icon: "🗺️" }
  ];

  const handleNext = () => {
    if (currentStep === 3) {
      setCurrentStep(4);
      generateRoadmap();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center max-w-md mx-auto mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1.5">
                Let's Get Started! <Sparkles className="w-5 h-5 text-indigo-500" />
              </h2>
              <p className="text-xs text-slate-400 mt-1">Tell us your name to begin crafting your customized journey.</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">What is your name?</label>
              <input
                type="text"
                placeholder="Enter your name..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                value={userProfile.name}
                onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center max-w-md mx-auto mb-6">
              <h2 className="text-lg font-bold text-slate-800">Skill Assessment</h2>
              <p className="text-xs text-slate-400 mt-1">Select your current familiarity with programming.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {skillLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setUserProfile({ ...userProfile, currentLevel: level })}
                  className={`p-4 border-2 rounded-xl text-left transition-all flex items-center justify-between
                    ${
                      userProfile.currentLevel === level
                        ? "border-indigo-500 bg-indigo-50/40"
                        : "border-slate-100 hover:border-indigo-200"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {level === "Beginner" && "🌱"}
                      {level === "Intermediate" && "🌿"}
                      {level === "Advanced" && "🌳"}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{level}</h4>
                      <p className="text-[10px] text-slate-400">
                        {level === "Beginner" && "Fresh to writing code & core programming concepts"}
                        {level === "Intermediate" && "Built minor projects and understand APIs / functions"}
                        {level === "Advanced" && "Experienced writing production-grade components"}
                      </p>
                    </div>
                  </div>
                  {userProfile.currentLevel === level && (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center max-w-md mx-auto mb-6">
              <h2 className="text-lg font-bold text-slate-800">Target Role</h2>
              <p className="text-xs text-slate-400 mt-1">Which role are you aiming to transition into next?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roles.map((role) => {
                const IconComponent = role.icon;
                const isSelected = userProfile.targetRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setUserProfile({ ...userProfile, targetRole: role.id })}
                    className={`p-5 border-2 rounded-xl text-left transition-all duration-300 flex items-center gap-3 relative overflow-hidden group
                      ${
                        isSelected
                          ? `border-transparent bg-gradient-to-r ${role.color} text-white shadow-lg scale-102`
                          : "border-slate-100 bg-white hover:border-slate-200"
                      }`}
                  >
                    <IconComponent size={22} className={isSelected ? "text-white" : "text-slate-500"} />
                    <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-700"}`}>
                      {role.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center max-w-md mx-auto mb-6">
              <h2 className="text-lg font-bold text-slate-800">Learning Details</h2>
              <p className="text-xs text-slate-400 mt-1">Configure your commitments and resources scope.</p>
            </div>

            <div className="space-y-4">
              {/* Time commitment */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Time Commitment</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeCommitments.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setUserProfile({ ...userProfile, timeCommitment: time })}
                      className={`py-2 px-3 border-2 rounded-xl text-[10px] font-bold transition-all
                        ${
                          userProfile.timeCommitment === time
                            ? "border-indigo-500 bg-indigo-50/30 text-indigo-700"
                            : "border-slate-100 hover:border-slate-200 text-slate-500"
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Style */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Learning Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {learningStyles.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setUserProfile({ ...userProfile, learningStyle: style })}
                      className={`py-2.5 px-3 border-2 rounded-xl text-[10px] font-bold transition-all
                        ${
                          userProfile.learningStyle === style
                            ? "border-indigo-500 bg-indigo-50/30 text-indigo-700"
                            : "border-slate-100 hover:border-slate-200 text-slate-500"
                        }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Budget Target</label>
                <div className="grid grid-cols-2 gap-2">
                  {budgets.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setUserProfile({ ...userProfile, budget: b })}
                      className={`py-2.5 px-3 border-2 rounded-xl text-[10px] font-bold transition-all
                        ${
                          userProfile.budget === b
                            ? "border-indigo-500 bg-indigo-50/30 text-indigo-700"
                            : "border-slate-100 hover:border-slate-200 text-slate-500"
                        }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {isGenerating ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto border border-indigo-150 animate-bounce">
                  <Zap size={22} className="text-indigo-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">Analysing Profile with AI...</h3>
                <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Comparing your current skill level against the roadmap components to select optimal learning paths.
                </p>
              </div>
            ) : !roadmap ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-violet-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Generate Your Pathway</h3>
                  <p className="text-xs text-slate-450 mt-1 max-w-md mx-auto">
                    All set! Press build below to query our AI engine and construct your personalized technical progression tree.
                  </p>
                </div>
                <button
                  onClick={generateRoadmap}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-8 rounded-xl shadow-md transition-all active:scale-95 inline-flex items-center gap-1.5"
                >
                  <Zap size={14} />
                  Compile AI Pathway
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in-up">
                {/* Result Summary */}
                <div className="bg-gradient-to-r from-indigo-50/50 to-indigo-100/30 border border-indigo-100 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-850 flex items-center gap-1">
                      {roadmap.title}
                      <Sparkles size={12} className="text-indigo-600 animate-pulse" />
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">Custom compiled for {userProfile.name}</p>
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 bg-white border border-indigo-200/50 rounded-xl text-indigo-600 shrink-0 shadow-sm">
                    Timeframe: {roadmap.duration}
                  </span>
                </div>

                {/* Phases Listing */}
                <div className="space-y-6">
                  {roadmap.phases.map((phase, idx) => (
                    <div key={idx} className="border border-slate-100 rounded-2xl p-5 hover:shadow-sm transition-all bg-white relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{phase.name}</h4>
                          <span className="text-[9px] text-slate-400 font-semibold">{phase.duration}</span>
                        </div>
                      </div>

                      {/* Skills to Master */}
                      <div className="mb-4">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Key Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="bg-slate-50 text-slate-650 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-slate-100">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">AI Selected Resources</p>
                        <div className="space-y-2">
                          {phase.resources.map((res, rIdx) => (
                            <div key={rIdx} className="flex items-center justify-between bg-slate-50/50 border border-slate-100/50 p-2.5 rounded-xl text-xs hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-2">
                                <div className="shrink-0">
                                  {res.type === "youtube" && <Video className="text-rose-500 w-4 h-4" />}
                                  {res.type === "course" && <BookOpen className="text-indigo-500 w-4 h-4" />}
                                  {res.type === "project" && <Trophy className="text-amber-500 w-4 h-4" />}
                                </div>
                                <div>
                                  <div className="font-bold text-[11px] text-slate-700">{res.name}</div>
                                  <div className="text-[9px] text-slate-400 font-medium">
                                    {res.price ? `Price: ${res.price}` : res.difficulty ? `Difficulty: ${res.difficulty}` : "Free"}
                                  </div>
                                </div>
                              </div>
                              {res.rating && (
                                <div className="flex items-center gap-0.5 text-amber-500 font-semibold text-[10px] shrink-0 bg-white border border-slate-100 px-2 py-0.5 rounded-lg shadow-sm">
                                  <Star size={10} fill="currentColor" />
                                  <span>{res.rating}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => {
                      setCurrentStep(0);
                      setRoadmap(null);
                      setUserProfile({
                        name: "",
                        currentLevel: "",
                        targetRole: "",
                        timeCommitment: "",
                        learningStyle: "",
                        budget: ""
                      });
                    }}
                    className="px-4 py-2 border border-slate-150 rounded-xl hover:bg-slate-50 text-slate-500 text-xs font-semibold"
                  >
                    Reset and Re-Generate
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 0: return !userProfile.name.trim();
      case 1: return !userProfile.currentLevel;
      case 2: return !userProfile.targetRole;
      case 3: return !userProfile.timeCommitment || !userProfile.learningStyle || !userProfile.budget;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 animate-fade-in-up">
      {/* Top Header Card */}
      <div className="flex items-center space-x-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
          <Zap className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">AI learning Roadmap</h1>
          <p className="text-xs text-slate-500 font-medium">
            Generate and explore highly structured learning pathways customized by machine learning models.
          </p>
        </div>
      </div>

      {/* Stepper Steps component */}
      {currentStep < 4 && (
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative px-2">
            {/* Connection background line */}
            <div className="absolute left-4 right-4 top-1/2 transform -translate-y-1/2 h-0.5 bg-slate-100 z-0" />

            {steps.slice(0, 4).map((step, idx) => {
              const isPassed = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div key={idx} className="flex flex-col items-center z-10">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-sm transition-all duration-300
                      ${
                        isPassed
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : isCurrent
                          ? "bg-white border-indigo-600 text-indigo-600 ring-4 ring-indigo-50"
                          : "bg-white border-slate-200 text-slate-400"
                      }`}
                  >
                    <span>{step.icon}</span>
                  </div>
                  <span className={`text-[9px] font-bold mt-1.5 transition-colors duration-300
                    ${isCurrent ? "text-indigo-600" : "text-slate-400"}`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
          {renderStepContent()}
        </div>

        {/* Form Nav Control */}
        {currentStep < 4 && (
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 border border-slate-150 rounded-xl hover:bg-slate-50 text-slate-500 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={14} />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span>{currentStep === 3 ? "Generate Roadmap" : "Continue"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningRoadmapGenerator;
