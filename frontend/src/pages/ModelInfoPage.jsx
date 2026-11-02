import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle, BarChart3, Database } from 'lucide-react';
import { modelService } from '../services/api';

export default function ModelInfoPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await modelService.getModelInfo();
        setData(res);
      } catch (err) {
        console.error("Failed to load model specs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading ML Model Specifications...</div>;
  }

  const perf = data?.best_model_performance || {};
  const allModels = data?.all_models_metrics || {};

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 mb-2">
          <Cpu className="w-3.5 h-3.5" />
          <span>Machine Learning Pipeline Architecture</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100">Model Specifications & Benchmark Metrics</h1>
        <p className="text-xs text-slate-400 mt-1">Multi-model evaluation comparison across 6 algorithms.</p>
      </div>

      {/* Top Model Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-cyan-950/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
              Selected Production Model
            </span>
            <h2 className="text-2xl font-bold text-slate-100 mt-1">{data?.model_name}</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Dataset Samples: 3,500</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <p className="text-2xl font-extrabold text-emerald-400">{(perf.accuracy * 100).toFixed(1)}%</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Accuracy</p>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <p className="text-2xl font-extrabold text-cyan-400">{(perf.precision * 100).toFixed(1)}%</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Precision</p>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <p className="text-2xl font-extrabold text-blue-400">{(perf.recall * 100).toFixed(1)}%</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Recall</p>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <p className="text-2xl font-extrabold text-purple-400">{(perf.f1_score * 100).toFixed(1)}%</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">F1 Score</p>
          </div>
        </div>
      </div>

      {/* Model Benchmark Comparison Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h3 className="text-base font-bold text-slate-100 mb-4">Multi-Algorithm Benchmark Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Algorithm Name</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Precision</th>
                <th className="py-3 px-4">Recall</th>
                <th className="py-3 px-4">F1 Score</th>
                <th className="py-3 px-4">ROC-AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {Object.entries(allModels).map(([name, m]) => (
                <tr key={name} className={`hover:bg-slate-800/40 transition ${name === data?.model_name ? 'bg-cyan-500/10 font-bold text-cyan-300' : 'text-slate-300'}`}>
                  <td className="py-3 px-4 font-semibold">{name} {name === data?.model_name && '(Selected)'}</td>
                  <td className="py-3 px-4 font-mono">{(m.accuracy * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 font-mono">{(m.precision * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 font-mono">{(m.recall * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 font-mono">{(m.f1_score * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 font-mono">{(m.roc_auc * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
