import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  UploadCloud,
  Activity,
  ShieldAlert,
  BrainCircuit,
  History,
  MapPin,
  BellRing,
  FileSpreadsheet,
  Cpu,
  Droplet,
  Globe
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/analysis', label: 'Water Analysis', icon: FlaskConical },
  { path: '/app/upload', label: 'CSV Batch Upload', icon: UploadCloud },
  { path: '/app/disease-risk', label: 'Disease Risk Module', icon: ShieldAlert },
  { path: '/app/xai', label: 'Explainable AI', icon: BrainCircuit },
  { path: '/app/live', label: 'Live IoT Telemetry', icon: Activity },
  { path: '/app/history', label: 'Historical Analytics', icon: History },
  { path: '/app/locations', label: 'Monitoring Sites', icon: MapPin },
  { path: '/app/alerts', label: 'Intelligent Alerts', icon: BellRing },
  { path: '/app/reports', label: 'Report Engine', icon: FileSpreadsheet },
  { path: '/app/model-info', label: 'ML Model Specifications', icon: Cpu },
];

export default function Sidebar() {
  return (
    <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 hidden md:flex">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center space-x-3 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Droplet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-100 tracking-wide leading-tight">WATER AI</h1>
            <p className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Disease Monitor</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-2">
            Monitoring Platform
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Public Landing Link Footer */}
      <div className="p-4 border-t border-slate-800/80">
        <NavLink
          to="/"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition"
        >
          <span className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Public Home</span>
          </span>
          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded font-mono">v1.0</span>
        </NavLink>
      </div>
    </aside>
  );
}
