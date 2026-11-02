import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplet,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Cpu,
  Sparkles,
  Upload,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

import KpiCard from '../components/KpiCard';
import RiskBadge from '../components/RiskBadge';
import { dashboardService } from '../services/api';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summary = await dashboardService.getSummary();
        setData(summary);
      } catch (err) {
        console.error("Error fetching dashboard summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-medium">Loading AI Dashboard Overview...</p>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const statusDistribution = data?.status_distribution || [];
  const timeline = data?.timeline || [];
  const recentSamples = data?.recent_samples || [];

  return (
    <div className="p-6 space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40">
        <div>
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Model Engine Active ({data?.model_name})</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">
            Water Quality & Disease Control Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time machine learning inference, risk mitigation, and parameter tracking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/app/analysis"
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition transform active:scale-95"
          >
            <Droplet className="w-4 h-4" />
            <span>New Sample</span>
          </Link>
          <Link
            to="/app/upload"
            className="flex items-center space-x-2 glass-panel hover:bg-slate-800 text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Batch Upload</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <KpiCard
          title="Total Samples"
          value={kpis.total_samples || 0}
          subtitle="Analyzed in database"
          icon={Droplet}
          color="cyan"
        />
        <KpiCard
          title="Safe Samples"
          value={kpis.safe_samples || 0}
          subtitle="Compliant with WHO"
          icon={ShieldCheck}
          color="green"
        />
        <KpiCard
          title="Risk Detected"
          value={kpis.risk_samples || 0}
          subtitle="Requires treatment"
          icon={AlertTriangle}
          color="amber"
        />
        <KpiCard
          title="Disease Risk"
          value={kpis.disease_risk_index || 'LOW'}
          subtitle="Overall threat level"
          icon={Activity}
          color={kpis.disease_risk_index === 'MODERATE' ? 'amber' : 'green'}
        />
        <KpiCard
          title="Model Accuracy"
          value={`${kpis.model_accuracy || 94.2}%`}
          subtitle={`Algorithm: ${data?.model_name}`}
          icon={Cpu}
          color="blue"
        />
      </div>

      {/* Analytics Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quality Trend Line Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Water Safety Score Trend Timeline</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Historical 0-100 score trajectory across recent samples</p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              Live Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="created_at" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#38BDF8' }}
                />
                <Area type="monotone" dataKey="score" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#scoreGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 mb-1">Water Status Distribution</h2>
            <p className="text-xs text-slate-400">Classification ratio breakdown</p>
          </div>

          <div className="h-52 my-4 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0F172A" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {statusDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </span>
                <span className="font-bold text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Samples Log Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Recent Water Analyses</h2>
            <p className="text-xs text-slate-400">Latest predictions and parameter evaluations</p>
          </div>
          <Link
            to="/app/history"
            className="flex items-center space-x-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            <span>View Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Sample Code</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Turbidity</th>
                <th className="py-3 px-4">pH</th>
                <th className="py-3 px-4">Safety Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentSamples.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No recent water samples found.
                  </td>
                </tr>
              ) : (
                recentSamples.map((sample) => (
                  <tr key={sample.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono text-cyan-400 font-semibold">{sample.sample_code}</td>
                    <td className="py-3.5 px-4 text-slate-200">
                      <span className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{sample.location_name}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">{sample.turbidity} NTU</td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">{sample.ph} pH</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-100">{sample.score}</span>
                      <span className="text-[10px] text-slate-500"> / 100</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge status={sample.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/app/analysis?id=${sample.id}`}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
