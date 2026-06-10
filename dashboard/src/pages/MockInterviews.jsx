import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Send,
  User,
  Bot,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Star,
  Target,
  TrendingUp,
  Award,
  Zap,
  Brain,
  MessageSquare,
  Volume2,
  VolumeX,
  ChevronRight,
  Sparkles
} from "lucide-react";

const MockInterviewApp = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentInterviewId, setCurrentInterviewId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [apiRoles, setApiRoles] = useState({});
  const [search, setSearch] = useState("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);

  const recognitionRef = useRef(null);
  const speechSynthRef = useRef(null);
  const timerRef = useRef(null);

  const mockRoles = {
    frontend: {
      name: "Frontend Developer",
      questions: [
        "Tell me about your experience with React and modern JavaScript frameworks.",
        "How do you ensure cross-browser compatibility in your applications?",
        "Describe your approach to responsive web design.",
        "How do you optimize web applications for performance?",
        "What's your experience with state management libraries?"
      ]
    },
    backend: {
      name: "Backend Developer",
      questions: [
        "Explain your experience with RESTful API design and implementation.",
        "How do you handle database optimization and scaling?",
        "Describe your approach to microservices architecture.",
        "How do you ensure security in backend applications?",
        "What's your experience with cloud services and deployment?"
      ]
    },
    fullstack: {
      name: "Full Stack Developer",
      questions: [
        "How do you manage the communication between frontend and backend?",
        "Describe a complex project you've worked on end-to-end.",
        "How do you approach database design for web applications?",
        "What's your experience with DevOps and CI/CD?",
        "How do you ensure code quality across the entire stack?"
      ]
    },
    data_scientist: {
      name: "Data Scientist",
      questions: [
        "Explain your approach to data preprocessing and cleaning.",
        "How do you select appropriate machine learning algorithms?",
        "Describe your experience with statistical analysis.",
        "How do you communicate complex findings to non-technical stakeholders?",
        "What tools do you use for data visualization?"
      ]
    },
    product_manager: {
      name: "Product Manager",
      questions: [
        "How do you prioritize features in a product roadmap?",
        "Describe your experience with user research and feedback collection.",
        "How do you work with engineering teams to deliver products?",
        "What metrics do you use to measure product success?",
        "How do you handle conflicting stakeholder requirements?"
      ]
    },
    devops: {
      name: "DevOps Engineer",
      questions: [
        "Explain your experience with containerization and orchestration.",
        "How do you implement and maintain CI/CD pipelines?",
        "Describe your approach to infrastructure monitoring.",
        "How do you handle incident response and system reliability?",
        "What's your experience with Infrastructure as Code?"
      ]
    }
  };

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const fetchInterviewRoles = async () => {
    try {
      const response = await fetch(`${API_BASE}/mock/roles`);
      const data = await response.json();
      if (data.success) {
        setApiRoles(data.data);
      } else {
        setApiRoles(mockRoles);
      }
    } catch (error) {
      setApiRoles(mockRoles);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };
    }

    speechSynthRef.current = window.speechSynthesis;
    fetchInterviewRoles();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (interviewStarted) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interviewStarted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      setTranscript("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const speakText = (text) => {
    if (speechSynthRef.current && isSpeechEnabled) {
      if (speechSynthRef.current.speaking) {
        speechSynthRef.current.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthRef.current.speak(utterance);
    }
  };

  const startInterview = async () => {
    if (!selectedRole) return;
    setIsLoading(true);

    setTimeout(() => {
      const activeRole = apiRoles[selectedRole] || mockRoles[selectedRole];
      setCurrentInterviewId(`interview_${Date.now()}`);
      setCurrentQuestionIndex(0);
      setInterviewStarted(true);
      setConversation([]);
      setTimeElapsed(0);

      const firstQuestion = activeRole.questions[0];
      setCurrentQuestion(firstQuestion);

      const welcomeMessage = `Hello! I'm your AI interviewer for the ${activeRole.name} position. Let's begin with our first question: ${firstQuestion}`;

      setConversation([
        {
          type: "ai",
          content: welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);

      if (isSpeechEnabled) {
        speakText(welcomeMessage);
      }
      setIsLoading(false);
    }, 1500);
  };

  const submitAnswer = async () => {
    if (!transcript.trim() || !currentInterviewId) return;

    const userAnswer = transcript.trim();
    setIsLoading(true);

    const activeRole = apiRoles[selectedRole] || mockRoles[selectedRole];

    const newConversation = [
      ...conversation,
      {
        type: "user",
        content: userAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ];
    setConversation(newConversation);

    setTimeout(() => {
      const mockFeedback = {
        score: Math.floor(Math.random() * 3) + 7,
        strengths: "Excellent conceptual clarity, clear speech structure.",
        improvements: "Incorporate concrete metric results to strengthen case.",
        suggestions: "Practice using the STAR framework."
      };

      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = activeRole.questions[nextIndex];

      let aiMessage = `Thank you. Overall feedback: ${mockFeedback.strengths}`;
      if (mockFeedback.improvements) {
        aiMessage += ` Focus on: ${mockFeedback.improvements}`;
      }
      aiMessage += ` Answer Score: ${mockFeedback.score}/10.`;

      if (nextQuestion) {
        aiMessage += ` Next question: ${nextQuestion}`;
        setCurrentQuestion(nextQuestion);
        setCurrentQuestionIndex(nextIndex);
      } else {
        const overallScore = Math.floor(Math.random() * 2) + 8;
        aiMessage += ` Interview complete! Overall calculated score is ${overallScore}/10. Excellent work!`;
        setInterviewStarted(false);
      }

      setConversation([
        ...newConversation,
        {
          type: "ai",
          content: aiMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);

      if (isSpeechEnabled) {
        speakText(aiMessage);
      }
      setTranscript("");
      setFeedback(mockFeedback);
      setIsLoading(false);
    }, 2000);
  };

  const resetInterview = () => {
    setInterviewStarted(false);
    setConversation([]);
    setCurrentQuestion("");
    setTranscript("");
    setFeedback(null);
    setTimeElapsed(0);
    setCurrentInterviewId(null);
    setCurrentQuestionIndex(0);
    setIsRecording(false);

    if (recognitionRef.current) recognitionRef.current.stop();
    if (speechSynthRef.current && speechSynthRef.current.speaking) {
      speechSynthRef.current.cancel();
    }
  };

  const filteredRoles = Object.entries(apiRoles).filter(([_, role]) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-8 animate-fade-in-up">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent flex items-center gap-1.5">
              AI Mock Interview Simulator
              <Sparkles size={14} className="text-indigo-400" />
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Vocal interactive feedback assessments powered by Speech Recognition models.
            </p>
          </div>
        </div>

        {interviewStarted && (
          <div className="flex items-center gap-3 relative z-10 shrink-0">
            <button
              onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
              className={`p-2.5 rounded-xl border transition-all text-xs font-bold flex items-center gap-1.5
                ${
                  isSpeechEnabled
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
            >
              {isSpeechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{isSpeechEnabled ? "Speech On" : "Muted"}</span>
            </button>
            <button
              onClick={resetInterview}
              className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        )}
      </div>

      {!interviewStarted ? (
        <div className="space-y-6">
          {/* Welcome Dashboard selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md max-w-4xl mx-auto space-y-6">
            <div className="text-center max-w-md mx-auto">
              <h2 className="text-base font-bold text-slate-100">Choose Career Stream</h2>
              <p className="text-xs text-slate-450 mt-1">Select your target field below to load AI questions pipeline.</p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search streams (e.g. frontend, backend...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-600"
              />
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRoles.map(([key, role]) => (
                <button
                  key={key}
                  onClick={() => setSelectedRole(key)}
                  className={`p-5 border-2 rounded-xl text-left transition-all duration-300 relative group overflow-hidden flex flex-col justify-between h-32
                    ${
                      selectedRole === key
                        ? "border-indigo-500 bg-indigo-950/20 text-white"
                        : "border-slate-800/80 bg-slate-900/50 text-slate-400 hover:border-slate-700"
                    }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <h4 className="font-bold text-xs text-slate-100 group-hover:text-white transition-colors">{role.name}</h4>
                    {selectedRole === key && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold space-y-0.5">
                    <p>{role.questions.length} Scenario Questions</p>
                    <p>Estimated: 15-20 Mins</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={startInterview}
                disabled={!selectedRole || isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs py-3 px-8 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Spinning Up AI...</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    <span>Begin Session</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main Chat Dialog panel (Span 3) */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[500px] overflow-hidden">
            {/* Header info */}
            <div className="bg-slate-950 px-5 py-3 border-b border-slate-850 flex items-center justify-between text-xs text-slate-450 font-bold">
              <span className="flex items-center gap-1">
                <Clock size={14} className="text-indigo-400" />
                <span>Elapsed: {formatTime(timeElapsed)}</span>
              </span>
              <span>
                Q: {currentQuestionIndex + 1} / {(apiRoles[selectedRole] || mockRoles[selectedRole])?.questions.length || 5}
              </span>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/80">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} items-start gap-3`}
                >
                  {msg.type === "ai" && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                      <Bot size={16} className="text-indigo-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs leading-relaxed border
                      ${
                        msg.type === "user"
                          ? "bg-indigo-650 text-white border-indigo-500/30 rounded-tr-none shadow-md"
                          : "bg-slate-900 text-slate-200 border-slate-800 rounded-tl-none"
                      }`}
                  >
                    <p>{msg.content}</p>
                    <span className="text-[9px] text-slate-500 font-bold block mt-1.5 text-right">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-indigo-400" />
                  </div>
                  <div className="bg-slate-900 border border-slate-855 px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-1.5 shadow-md">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input action board */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 space-y-4">
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Talk through your response by clicking record, or type your answer here..."
                rows="2"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none placeholder-slate-650"
              />

              {isRecording && (
                <div className="flex items-center justify-center gap-1.5 py-3 bg-slate-950/40 rounded-xl border border-slate-800/60 shadow-inner">
                  <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider mr-3 animate-pulse">Live Audio</span>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((bar) => {
                    const delay = `${bar * 80}ms`;
                    return (
                      <span
                        key={bar}
                        style={{
                          animationDelay: delay,
                          animation: "soundWave 1.2s ease-in-out infinite"
                        }}
                        className="w-1 bg-rose-500 rounded-full h-2"
                      />
                    );
                  })}
                  <style>{`
                    @keyframes soundWave {
                      0%, 100% { transform: scaleY(1); height: 6px; }
                      50% { transform: scaleY(2.8); height: 14px; background-color: #f43f5e; }
                    }
                  `}</style>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm
                      ${
                        isRecording
                          ? "bg-rose-600 hover:bg-rose-700 text-white"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff size={14} className="animate-pulse" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Mic size={14} />
                        <span>Voice Assist</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => speakText(currentQuestion)}
                    className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-350 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                  >
                    <Volume2 size={14} />
                    Repeat Question
                  </button>
                </div>

                <button
                  onClick={submitAnswer}
                  disabled={!transcript.trim() || isLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1"
                >
                  <Send size={14} />
                  Submit Answer
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar tips / current question (Span 1) */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md space-y-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={14} className="text-indigo-400" />
                Active Question
              </h3>
              <div className="bg-slate-950/80 border border-slate-850 p-3 rounded-xl">
                <p className="text-[11px] leading-relaxed text-slate-300 font-semibold">{currentQuestion}</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md space-y-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Target size={14} className="text-indigo-400" />
                Interviewer Advice
              </h3>
              <div className="space-y-2 text-[10px] text-slate-400 font-semibold">
                <div className="flex gap-2 p-2 bg-slate-950/40 rounded-lg border border-slate-850/50">
                  <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                  <p>Structure your answers using the STAR format (Situation, Task, Action, Result).</p>
                </div>
                <div className="flex gap-2 p-2 bg-slate-950/40 rounded-lg border border-slate-850/50">
                  <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                  <p>Talk slowly and articulate key technical parameters explicitly.</p>
                </div>
                <div className="flex gap-2 p-2 bg-slate-950/40 rounded-lg border border-slate-850/50">
                  <XCircle size={14} className="text-rose-400 shrink-0" />
                  <p>Avoid broad generalizations. Highlight metrics whenever possible.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterviewApp;