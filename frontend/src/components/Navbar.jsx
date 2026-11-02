import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, Bell, Search, User, LogOut, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { alertsService } from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const fetchAlertsCount = async () => {
      try {
        const data = await alertsService.getAlerts({ is_resolved: false });
        setUnreadAlerts(data.length);
      } catch (err) {
        // Silent catch if offline
      }
    };
    fetchAlertsCount();
  }, []);

  return (
    <header className="h-16 glass-panel border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand Search & Indicator */}
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search samples, locations, parameters..."
            className="bg-slate-900/80 border border-slate-700/60 rounded-xl pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition w-64 lg:w-80"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-4">
        {/* Analyze quick button */}
        <Link
          to="/app/analysis"
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs md:text-sm px-3.5 py-1.5 rounded-xl shadow-lg shadow-cyan-500/20 transition transform active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Water Analysis</span>
        </Link>

        {/* Notifications Bell */}
        <Link
          to="/app/alerts"
          className="relative p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-cyan-400 transition"
          title="Alert Center"
        >
          <Bell className="w-5 h-5" />
          {unreadAlerts > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-md shadow-red-500/40">
              {unreadAlerts}
            </span>
          )}
        </Link>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-slate-800/60 transition focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-cyan-500/20">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-200">{user?.full_name || 'Water Specialist'}</div>
              <div className="text-[10px] text-cyan-400 font-medium">{user?.role || 'Environmental Analyst'}</div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl shadow-2xl py-2 border border-slate-700/80 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-slate-200">{user?.full_name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <Link
                to="/app/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition"
              >
                <User className="w-4 h-4" />
                <span>My Profile & Settings</span>
              </Link>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
