import React, { useState } from "react";
import { Link } from "react-router-dom";
import ApplicationTrendChart from "../components/ApplicationTrendChart";
import JobApplicationsTimeline from "../components/JobApplicationsTimeline";
import logo2 from "../assets/logo2.png";

import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import {
  Briefcase,
  UserCheck,
  TrendingUp,
  Clock,
  Plus,
  Filter,
  Bell,
  Sparkles,
  ChevronRight,
  TrendingDown
} from "lucide-react";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const Dashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeInsight, setActiveInsight] = useState(0);
  const insights = [
    { text: "Your resume score matches 85% of target roles. Add TypeScript to increase your match percentage to 92%.", badge: "Resume Tip" },
    { text: "Frontend Developer salaries in Bangalore have grown by 12% in the last quarter.", badge: "Market Insight" },
    { text: "Your mock interview session is scheduled. Focus on STAR response models for backend questions.", badge: "Interview Alert" }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % insights.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);


  const barData = {
    labels: ["Google", "Amazon", "Flipkart", "Adobe", "Zoho"],
    datasets: [
      {
        label: "Frontend",
        data: [12, 9, 5, 7, 4],
        backgroundColor: "rgba(99, 102, 241, 0.85)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "Backend",
        data: [8, 6, 4, 6, 3],
        backgroundColor: "rgba(16, 185, 129, 0.85)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "UI/UX",
        data: [4, 3, 2, 5, 2],
        backgroundColor: "rgba(245, 158, 11, 0.85)",
        borderColor: "rgb(245, 158, 11)",
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const doughnutData = {
    labels: ["Applied", "Interview", "Rejected", "Under Review"],
    datasets: [
      {
        label: "Applications",
        data: [20, 10, 4, 6],
        backgroundColor: [
          "rgba(99, 102, 241, 0.85)",
          "rgba(16, 185, 129, 0.85)",
          "rgba(239, 68, 68, 0.85)",
          "rgba(245, 158, 11, 0.85)",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 11, weight: "600", family: "system-ui" },
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f8fafc",
        bodyColor: "#f8fafc",
        cornerRadius: 8,
        padding: 10,
        bodyFont: { size: 11 },
        titleFont: { size: 12, weight: "bold" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(241, 245, 249, 0.9)" },
        ticks: { font: { size: 10, weight: "500" }, color: "#64748b" },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10, weight: "500" }, color: "#64748b" },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 11, weight: "600" },
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        cornerRadius: 8,
        padding: 10,
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 animate-fade-in-up">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
              Welcome back, Keshav!
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Here is your career progress overview and recommendations.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end md:self-auto">
          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-600 shadow-sm transition-all relative"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-700">
                  Recent Alerts
                </div>
                <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto">
                  {[
                    { title: "Resume Score Updated", desc: "Your score improved to 85%", icon: "📈", time: "2 mins ago" },
                    { title: "Interview Scheduled", desc: "Google wants to interview you!", icon: "📅", time: "10 mins ago" },
                    { title: "New Job Match", desc: "Amazon - Frontend Developer", icon: "💼", time: "1 hour ago" },
                  ].map((item, i) => (
                    <div key={i} className="p-3 hover:bg-slate-50 cursor-pointer flex gap-3 transition-colors">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                        <p className="text-[10px] text-slate-500">{item.desc}</p>
                        <span className="text-[9px] text-indigo-500 font-medium block mt-1">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center text-[10px] font-bold py-2.5 text-indigo-600 hover:bg-slate-50 border-t border-slate-100 cursor-pointer transition-colors">
                  Clear All Alerts
                </div>
              </div>
            )}
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all active:scale-95">
            <Plus size={14} />
            Add Application
          </button>
        </div>
      </div>

      {/* AI Career Insights banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-slate-800 p-5 rounded-2xl shadow-sm text-slate-200 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/35 flex items-center justify-center text-indigo-400 shrink-0">
            <Sparkles size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <span className="inline-block bg-indigo-550/20 text-indigo-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-wider">
              {insights[activeInsight].badge}
            </span>
            <p className="text-xs text-slate-350 font-semibold mt-1.5 transition-all duration-550 ease-in-out">
              {insights[activeInsight].text}
            </p>
          </div>
        </div>
        <button className="text-[10px] font-bold text-indigo-450 hover:text-indigo-300 flex items-center gap-1 shrink-0 mt-2 sm:mt-0 transition-colors">
          Explore Insights
          <ChevronRight size={12} />
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applications"
          value="32"
          change="+12% this month"
          isPositive={true}
          icon={<Briefcase size={20} />}
          gradient="from-indigo-500 to-indigo-600"
          bgColor="from-indigo-50/50 to-indigo-100/30"
          borderColor="border-indigo-100/50"
        />
        <StatsCard
          title="Interviews Scheduled"
          value="5"
          change="+25% vs last week"
          isPositive={true}
          icon={<UserCheck size={20} />}
          gradient="from-emerald-500 to-emerald-600"
          bgColor="from-emerald-50/50 to-emerald-100/30"
          borderColor="border-emerald-100/50"
        />
        <StatsCard
          title="Response Rate"
          value="68%"
          change="+8% vs avg"
          isPositive={true}
          icon={<TrendingUp size={20} />}
          gradient="from-violet-500 to-violet-600"
          bgColor="from-violet-50/50 to-violet-100/30"
          borderColor="border-violet-100/50"
        />
        <StatsCard
          title="Avg. Response Time"
          value="3.2 days"
          change="-15% faster"
          isPositive={true}
          icon={<Clock size={20} />}
          gradient="from-amber-500 to-amber-600"
          bgColor="from-amber-50/50 to-amber-100/30"
          borderColor="border-amber-100/50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart Roles (Span 2) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Hiring Trends by Role</h3>
              <p className="text-[10px] text-slate-400">Monthly job roles posting ratio</p>
            </div>
            <button className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-600">
              <Filter size={14} />
            </button>
          </div>
          <div className="h-64 flex-1">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Doughnut Chart Status (Span 1) */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800">Application Pipeline</h3>
            <p className="text-[10px] text-slate-400">Current status distribution</p>
          </div>
          <div className="h-64 flex-1 relative">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-800">Application Pipeline Timeline</h3>
          <p className="text-[10px] text-slate-400">Key interview & application milestones</p>
        </div>
        <JobApplicationsTimeline />
      </div>

      {/* Analytics Trend Graph */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-800">Long-term Application Trends</h3>
          <p className="text-[10px] text-slate-400">Analytics overview for the past 6 months</p>
        </div>
        <ApplicationTrendChart />
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, change, isPositive, icon, gradient, bgColor, borderColor }) => (
  <div
    className={`bg-gradient-to-br ${bgColor} ${borderColor} border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group flex flex-col justify-between h-40`}
  >
    <div className="flex items-center justify-between">
      <div
        className={`p-2.5 rounded-xl bg-gradient-to-r ${gradient} text-white shadow-md group-hover:scale-115 transition-transform duration-300`}
      >
        {icon}
      </div>
      <div
        className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1
          ${
            isPositive
              ? "text-emerald-700 bg-emerald-100/80 border border-emerald-200/50"
              : "text-rose-700 bg-rose-100/80 border border-rose-200/50"
          }`}
      >
        {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {change}
      </div>
    </div>

    <div className="mt-4">
      <p className="text-[11px] text-slate-500 font-semibold">{title}</p>
      <h3 className="text-2xl font-black text-slate-800 mt-1">{value}</h3>
    </div>
  </div>
);

export default Dashboard;