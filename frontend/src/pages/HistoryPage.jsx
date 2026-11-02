import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History as HistoryIcon, Search, Filter, MapPin, Download, ExternalLink } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import { waterService } from '../services/api';

export default function HistoryPage() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await waterService.getHistory({ status: statusFilter || undefined });
        setSamples(data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [statusFilter]);

  const filteredSamples = samples.filter(s =>
    s.sample_code.toLowerCase().includes(search.toLowerCase()) ||
    (s.location_name && s.location_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 mb-2">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>Historical Log Repository</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100">Historical Water Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, filter, and export past AI water quality classifications.
          </p>
        </div>

        <a
          href="http://localhost:8000/api/reports/csv"
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export All History (CSV)</span>
        </a>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search code or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition"
          >
            <option value="">All Statuses</option>
            <option value="SAFE">SAFE Only</option>
            <option value="MODERATE">MODERATE Only</option>
            <option value="UNSAFE">UNSAFE Only</option>
            <option value="CRITICAL">CRITICAL Only</option>
          </select>
        </div>
      </div>

      {/* Samples Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Sample Code</th>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Turbidity</th>
                <th className="py-3 px-4">pH</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">Loading samples...</td>
                </tr>
              ) : filteredSamples.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">No matching historical samples found.</td>
                </tr>
              ) : (
                filteredSamples.map((sample) => (
                  <tr key={sample.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono text-cyan-400 font-semibold">{sample.sample_code}</td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(sample.created_at).toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-slate-200">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{sample.location_name}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">{sample.turbidity} NTU</td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">{sample.ph} pH</td>
                    <td className="py-3.5 px-4 font-bold text-slate-100">{sample.water_safety_score}/100</td>
                    <td className="py-3.5 px-4"><RiskBadge status={sample.status} /></td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link to={`/app/analysis?id=${sample.id}`} className="text-cyan-400 hover:underline font-semibold">Inspect</Link>
                      <a href={`http://localhost:8000/api/reports/pdf/${sample.id}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-200">PDF</a>
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
