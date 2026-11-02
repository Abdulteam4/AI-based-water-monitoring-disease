import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sliders, Cpu, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { modelService } from '../services/api';

export default function ExplainableAiPage() {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const info = await modelService.getModelInfo();
        setModelInfo(info);
      } catch (err) {
        console.error("Failed to load model info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh] text-xs text-slate-400">
        Loading Explainable AI Feature Importances...
      </div>
    );
  }

  const importances = modelInfo?.feature_importances || {};
  const chartData = Object.entries(importances).map(([key, value]) => ({
    name: key.replace('_', ' ').toUpperCase(),
    importance: Math.round(value * 1000) / 10
  })).sort((a, b) => b.importance - a.importance);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 mb-2">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Explainable AI (XAI) Portal</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100">Model Feature Importance & Transparency</h1>
        <p className="text-xs text-slate-400 mt-1">
          Quantitative feature attribution rankings explaining how the ML classifier evaluates water potability.
        </p>
      </div>

      {/* Feature Importance Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h2 className="text-base font-bold text-slate-100 mb-2 flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Relative Feature Weight Rankings (%)</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">Derived from {modelInfo?.model_name} feature weight trees</p>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis type="number" stroke="#64748B" fontSize={10} unit="%" />
              <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={10} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#38BDF8' }}
              />
              <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index < 3 ? '#0EA5E9' : (index < 6 ? '#0284C7' : '#0369A1')} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Parameter Threshold Guide */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h2 className="text-base font-bold text-slate-100 mb-4">WHO & EPA Parameter Safety Config</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modelInfo?.parameter_configurations?.map((cfg, idx) => (
            <div key={idx} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-slate-100">{cfg.name}</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">{cfg.unit}</span>
              </div>
              <p className="text-[11px] font-mono text-emerald-400 mb-2">Safe Range: {cfg.safe_range}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{cfg.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
