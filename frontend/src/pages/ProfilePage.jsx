import React from 'react';
import { User, Shield, Mail, Calendar, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-100">User Profile & Credentials</h1>
        <p className="text-xs text-slate-400 mt-1">Manage specialist profile settings and authentication configuration.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">{user?.full_name || 'Water Specialist'}</h2>
            <p className="text-xs text-cyan-400 font-semibold">{user?.role || 'Environmental Health Analyst'}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="flex items-center space-x-2 text-slate-400">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Email Address</span>
            </span>
            <span className="font-mono text-slate-200">{user?.email || 'admin@watermonitor.ai'}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="flex items-center space-x-2 text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Access Role</span>
            </span>
            <span className="font-semibold text-emerald-400">{user?.role || 'Lead Environmental Scientist'}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="flex items-center space-x-2 text-slate-400">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Member Since</span>
            </span>
            <span className="text-slate-300">August 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
