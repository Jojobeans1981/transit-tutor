import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isCompleted: boolean;
  colorClass: string;
}

const CircularProgress: React.FC<CircularProgressProps> = (
  { progress, size = 48, strokeWidth = 4, isCompleted, colorClass },
) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference -
    (Math.min(progress, 100) / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-white/5"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 1s ease-in-out",
          }}
          strokeLinecap="round"
          className={isCompleted ? "text-[#00853E]" : colorClass}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {isCompleted
          ? <i className="fa-solid fa-check text-[#00853E] text-xs"></i>
          : (
            <span className="text-[9px] font-black text-white/50">
              {Math.round(progress)}%
            </span>
          )}
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ user: any }> = ({ user }) => {
  const xpProgress = (user.xp / user.xpToNextLevel) * 100;

  // Calculate global readiness score
  const readinessIndex = Math.round(
    ((user.metrics?.accuracyRate || 0) * 0.4) +
      ((user.metrics?.protocolCompliance || 0) * 0.3) +
      ((user.metrics?.radioProficiency || 0) * 0.3),
  );

  const sodaMetrics = [
    {
      label: "Radio Prof.",
      value: `${user.metrics?.radioProficiency || 0}%`,
      icon: "fa-tower-broadcast",
      color: "#0039A6",
    },
    {
      label: "Protocol Comp.",
      value: `${user.metrics?.protocolCompliance || 0}%`,
      icon: "fa-shield-halved",
      color: "#FF6319",
    },
    {
      label: "Response Spd.",
      value: user.metrics?.incidentResponseSpeed || "N/A",
      icon: "fa-bolt",
      color: "#FCCC0A",
    },
    {
      label: "Accuracy Rt.",
      value: `${user.metrics?.accuracyRate || 0}%`,
      icon: "fa-bullseye",
      color: "#00853E",
    },
    {
      label: "Fleet Log.",
      value: `${user.metrics?.fleetManagementScore || 0}%`,
      icon: "fa-truck-front",
      color: "#A7A9AC",
    },
    {
      label: "Safety Std.",
      value: `${user.metrics?.safetyCompliance || 0}%`,
      icon: "fa-hard-hat",
      color: "#EE352E",
    },
  ];

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
        <div className="space-y-6">
          {/* POWERED BY LOGO BANNER */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl shadow-[0_10px_40px_rgba(255,255,255,0.1)] border border-white/20">
              <img src="logo.png" alt="We Move NY" className="h-10 w-auto" />
              <div className="h-8 w-[2px] bg-black/10"></div>
              <span className="text-black text-[12px] font-black uppercase tracking-[0.2em]">
                Powered by We Move NY
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-[#111] px-4 py-2.5 rounded-2xl border border-white/5">
              <span className="w-2 h-2 rounded-full bg-[#00853E] animate-pulse">
              </span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                S.O.D.A. Core Terminal Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-4 h-14 bg-[#0039A6] rounded-full shadow-[0_0_20px_rgba(0,57,166,0.4)]">
            </div>
            <div>
              <h2 className="text-7xl font-black tracking-tighter text-white uppercase leading-none">
                SYSTEM MONITOR
              </h2>
              <div className="flex items-center gap-4 mt-3">
                <p className="text-[#FF6319] font-black uppercase tracking-[0.4em] text-[11px]">
                  Candidate: {user.name}
                </p>
                <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  ID: {user.employeeId}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111] p-10 rounded-[3rem] border border-white/5 shadow-2xl flex items-center gap-10 w-full xl:w-auto">
          <div className="flex-grow min-w-[280px]">
            <div className="flex justify-between items-end mb-4">
              <span className="text-[11px] font-black text-[#0039A6] uppercase tracking-[0.3em]">
                Academy Rank {user.level}
              </span>
              <span className="text-[11px] font-bold text-slate-500 tabular-nums">
                {user.xp.toLocaleString()} /{" "}
                {user.xpToNextLevel.toLocaleString()} XP
              </span>
            </div>
            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-[#0039A6] to-[#00AEEF] rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(0,57,166,0.6)]"
                style={{ width: `${xpProgress}%` }}
              >
              </div>
            </div>
          </div>
          <div className="w-24 h-24 bg-white text-black rounded-3xl flex items-center justify-center text-5xl font-black border-4 border-[#0039A6] shadow-2xl transform rotate-3">
            {user.level}
          </div>
        </div>
      </header>

      {/* READINESS INDEX PANEL - CRITICAL TRACKING */}
      <div className="bg-gradient-to-br from-[#111] to-[#050505] p-14 rounded-[3.5rem] border border-white/10 flex flex-col md:flex-row items-center gap-16 shadow-[0_0_80px_rgba(0,0,0,1)] relative overflow-hidden group">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#0039A6]/10 blur-[120px] rounded-full transition-all group-hover:bg-[#0039A6]/20">
        </div>
        <div className="relative flex-shrink-0">
          <svg
            width="240"
            height="240"
            viewBox="0 0 200 200"
            className="transform -rotate-90"
          >
            <circle
              cx="100"
              cy="100"
              r="85"
              stroke="#1A1A1A"
              strokeWidth="26"
              fill="none"
            />
            <circle
              cx="100"
              cy="100"
              r="85"
              stroke={readinessIndex > 80
                ? "#00853E"
                : readinessIndex > 50
                ? "#FCCC0A"
                : "#EE352E"}
              strokeWidth="26"
              fill="none"
              strokeDasharray="534.07"
              strokeDashoffset={534.07 - (readinessIndex / 100) * 534.07}
              strokeLinecap="round"
              className="transition-all duration-[2.5s] ease-out drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-7xl font-black text-white">
              {readinessIndex}%
            </span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mt-3">
              Readiness
            </span>
          </div>
        </div>
        <div className="flex-grow space-y-8">
          <div className="space-y-4">
            <h3 className="text-5xl font-black text-white uppercase tracking-tighter">
              Operational Readiness Index
            </h3>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl">
              This consolidated metric monitors your capability in the field.
              Maintain a score above{" "}
              <span className="text-[#00853E] font-black">85%</span>{" "}
              to be cleared for the Master Dispatcher Examination.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="bg-white/5 px-8 py-4 rounded-2xl border border-white/10 shadow-inner">
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                Service Status
              </p>
              <p
                className={`text-xl font-black uppercase tracking-tight ${
                  readinessIndex > 70 ? "text-[#00853E]" : "text-[#EE352E]"
                }`}
              >
                {readinessIndex > 70
                  ? "READY FOR DEPLOYMENT"
                  : "INTENSIVE RE-TRAINING"}
              </p>
            </div>
            <div className="bg-white/5 px-8 py-4 rounded-2xl border border-white/10 shadow-inner">
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                Academy Cycle
              </p>
              <p className="text-xl font-black text-white uppercase tracking-tight">
                SODA-2025.Q1
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Surface Operations Metrics */}
      <section className="space-y-10">
        <div className="flex items-center gap-6">
          <span className="px-6 py-2.5 bg-white text-black text-[13px] font-black uppercase tracking-[0.3em] rounded-xl shadow-xl">
            Performance Indices
          </span>
          <div className="h-[2px] flex-grow bg-gradient-to-r from-white/20 to-transparent">
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {sodaMetrics.map((metric, i) => (
            <div
              key={i}
              className="bg-[#111]/60 glass-blur p-10 rounded-[2.5rem] border border-white/5 group hover:border-[#0039A6] transition-all hover:-translate-y-3 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-2xl transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${metric.color}22`,
                    color: metric.color,
                  }}
                >
                  <i className={`fa-solid ${metric.icon}`}></i>
                </div>
                <div
                  className="w-3.5 h-3.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor]"
                  style={{ backgroundColor: metric.color, color: metric.color }}
                >
                </div>
              </div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
                {metric.label}
              </p>
              <p className="text-5xl font-black text-white tracking-tighter">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics Graph */}
      <div className="bg-[#111]/50 glass-blur p-12 rounded-[3rem] border border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h3 className="font-black text-4xl text-white tracking-tighter uppercase leading-none">
              Telemetry Scan
            </h3>
            <p className="text-[10px] font-black text-[#0039A6] uppercase tracking-[0.4em] mt-3">
              Readiness History Feed
            </p>
          </div>
          <div className="px-6 py-2 bg-black border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
            Live Analytics Active
          </div>
        </div>
        <div className="h-96">
          {user.history && user.history.length > 0
            ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={user.history}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0039A6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0039A6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="5 5"
                    vertical={false}
                    stroke="#222"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#666", fontWeight: "900" }}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#666", fontWeight: "900" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      borderRadius: "1.5rem",
                      border: "1px solid #333",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#0039A6", fontWeight: "900" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#0039A6"
                    strokeWidth={8}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )
            : (
              <div className="h-full flex flex-col items-center justify-center text-slate-800 border-4 border-dotted border-white/10 rounded-[2.5rem]">
                <i className="fa-solid fa-tower-observation text-7xl mb-6 opacity-20">
                </i>
                <p className="font-black uppercase tracking-widest text-sm">
                  Waiting for Simulation Telemetry
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Footer Info */}
      <footer className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
          <img src="logo.png" className="h-10 w-auto" alt="NYC DOT" />
          <div className="text-[10px] font-black text-white uppercase tracking-[0.5em]">
            NYC Surface Ops • 2025
          </div>
        </div>
        <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.6em]">
          PROMETHEUS SECURE NODE v2.5.0
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
