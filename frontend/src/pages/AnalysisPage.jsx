import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FlaskConical,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Download,
  Info,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Sliders
} from 'lucide-react';

import WaterQualityGauge from '../components/WaterQualityGauge';
import RiskBadge from '../components/RiskBadge';
import { waterService } from '../services/api';

const DEFAULT_PARAMS = {
  ph: 7.2,
  hardness: 135,
  solids: 280,
  chloramines: 2.1,
  sulfate: 140,
  conductivity: 420,
  organic_carbon: 2.8,
  trihalomethanes: 42,
  turbidity: 1.5,
  dissolved_oxygen: 8.5,
  nitrate: 3.5,
  lead: 0.003
};

const SAMPLE_PRESETS = [
  {
    name: 'Safe Tap Water (WHO Compliant)',
    params: { ph: 7.4, hardness: 120, solids: 220, chloramines: 2.2, sulfate: 130, conductivity: 390, organic_carbon: 2.1, trihalomethanes: 32, turbidity: 1.1, dissolved_oxygen: 8.9, nitrate: 2.5, lead: 0.002 }
  },
  {
    name: 'Contaminated Surface Water',
    params: { ph: 5.4, hardness: 310, solids: 1250, chloramines: 0.2, sulfate: 480, conductivity: 1100, organic_carbon: 12.8, trihalomethanes: 115, turbidity: 12.5, dissolved_oxygen: 3.1, nitrate: 22.0, lead: 0.035 }
  },
  {
    name: 'High Nitrate Well Water',
    params: { ph: 6.8, hardness: 180, solids: 420, chloramines: 1.5, sulfate: 190, conductivity: 520, organic_carbon: 4.2, trihalomethanes: 50, turbidity: 3.2, dissolved_oxygen: 7.1, nitrate: 28.5, lead: 0.004 }
  }
];

export default function AnalysisPage() {
  const [searchParams] = useSearchParams();
  const sampleIdParam = searchParams.get('id');

  const [formData, setFormData] = useState(DEFAULT_PARAMS);
  const [locationName, setLocationName] = useState('Central Water Station');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sampleIdParam) {
      const fetchSample = async () => {
        setLoading(true);
        try {
          const detail = await waterService.getSampleDetail(sampleIdParam);
          setResult(detail);
          setFormData({
            ph: detail.ph, hardness: detail.hardness, solids: detail.solids,
            chloramines: detail.chloramines, sulfate: detail.sulfate, conductivity: detail.conductivity,
            organic_carbon: detail.organic_carbon, trihalomethanes: detail.trihalomethanes, turbidity: detail.turbidity,
            dissolved_oxygen: detail.dissolved_oxygen, nitrate: detail.nitrate, lead: detail.lead
          });
        } catch (err) {
          setError('Failed to fetch sample details.');
        } finally {
          setLoading(false);
        }
      };
      fetchSample();
    }
  }, [sampleIdParam]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const applyPreset = (preset) => {
    setFormData(preset.params);
    setResult(null);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await waterService.analyzeSample({
        location_name: locationName,
        ...formData
      });
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis service error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 mb-2">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Interactive Water Quality Analysis</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">
            AI Water Potability & Risk Evaluator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Input physical & chemical parameters to calculate 0-100 safety score and disease risk factors.
          </p>
        </div>

        {/* Presets dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Presets:</span>
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-[11px] font-semibold bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 hover:text-cyan-400 text-slate-300 px-3 py-1.5 rounded-xl transition"
            >
              {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Input Panel */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Water Sample Parameters</span>
              </h2>
              <span className="text-[11px] text-slate-400">12 Parameters</span>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Sampling Location Name
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 transition"
                  placeholder="e.g. Domestic Tap - Zone 4"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {/* Parameter Fields */}
                {[
                  { key: 'ph', label: 'pH Level', unit: 'pH', safe: '6.5 - 8.5', step: 0.1 },
                  { key: 'turbidity', label: 'Turbidity', unit: 'NTU', safe: '0.1 - 5.0', step: 0.1 },
                  { key: 'solids', label: 'Solids / TDS', unit: 'mg/L', safe: '100 - 500', step: 10 },
                  { key: 'hardness', label: 'Hardness', unit: 'mg/L', safe: '60 - 200', step: 5 },
                  { key: 'chloramines', label: 'Chloramines', unit: 'mg/L', safe: '0.5 - 4.0', step: 0.1 },
                  { key: 'sulfate', label: 'Sulfate', unit: 'mg/L', safe: '10 - 250', step: 5 },
                  { key: 'conductivity', label: 'Conductivity', unit: 'µS/cm', safe: '150 - 800', step: 10 },
                  { key: 'organic_carbon', label: 'Organic Carbon', unit: 'mg/L', safe: '1.0 - 5.0', step: 0.1 },
                  { key: 'trihalomethanes', label: 'THMs', unit: 'µg/L', safe: '10 - 80', step: 1 },
                  { key: 'dissolved_oxygen', label: 'Dissolved O₂', unit: 'mg/L', safe: '6.0 - 14.0', step: 0.1 },
                  { key: 'nitrate', label: 'Nitrate', unit: 'mg/L', safe: '0 - 10.0', step: 0.1 },
                  { key: 'lead', label: 'Lead (Pb)', unit: 'mg/L', safe: '< 0.015', step: 0.001 }
                ].map((item) => (
                  <div key={item.key} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-semibold text-slate-300">{item.label}</span>
                      <span className="text-[9px] text-slate-500 font-mono">{item.unit}</span>
                    </div>
                    <input
                      type="number"
                      step={item.step}
                      value={formData[item.key]}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                    />
                    <div className="text-[9px] text-slate-500 mt-1">Normal: {item.safe}</div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm py-3.5 rounded-2xl shadow-xl shadow-cyan-500/25 transition transform active:scale-95 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI Model Analyzing Sample...</span>
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Potability & Disease Analysis</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Prediction Results & XAI */}
        <div className="lg:col-span-6 space-y-6">
          {!result ? (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-cyan-400">
                <FlaskConical className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">No Active Analysis</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Enter parameters on the left or choose a sample preset, then click 'Run AI Analysis' to view predictions.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score & Prediction Header Card */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-br from-slate-900 to-slate-950">
                <WaterQualityGauge score={result.water_safety_score} status={result.status} size={160} />

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                    <RiskBadge status={result.status} size="large" />
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      {result.sample_code}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">
                    Water Potability: {result.is_potable ? 'Potable (Safe)' : 'Non-Potable (Unsafe)'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    AI Probability: <span className="font-bold text-slate-200">{(result.potability_probability * 100).toFixed(1)}%</span>
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <a
                      href={`http://localhost:8000/api/reports/pdf/${result.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Explainable AI Feature Breakdown */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800">
                <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Explainable AI — Risk Contributors</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">{result.explanation?.explanation_summary}</p>

                <div className="space-y-3">
                  {result.explanation?.ranked_contributions?.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-semibold text-slate-200">{item.name}</span>
                        <span className={`text-[10px] font-bold ${item.impact_level.includes('High') ? 'text-red-400' : (item.impact_level.includes('Moderate') ? 'text-amber-400' : 'text-slate-400')}`}>
                          {item.impact_level} ({item.value} {item.unit})
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${item.impact_level.includes('High') ? 'bg-red-500' : (item.impact_level.includes('Moderate') ? 'bg-amber-500' : 'bg-cyan-500')}`}
                          style={{ width: `${Math.min(100, Math.max(10, item.contribution_score * 30))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disease Risk Module Findings */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800">
                <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Disease & Pathogen Risk Assessment</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">{result.disease_risks?.assessment_summary}</p>

                {result.disease_risks?.detected_risks?.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>No elevated waterborne pathogen or disease transmission risks detected.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {result.disease_risks?.detected_risks?.map((risk, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-xs text-amber-300">{risk.name}</h4>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                            {risk.risk_level}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{risk.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actionable Recommendations */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800">
                <h3 className="text-base font-bold text-slate-100 mb-4">Purification & Safety Advisories</h3>
                <div className="space-y-3">
                  {result.recommendations?.map((rec, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                      <div className="font-bold text-cyan-400 mb-0.5">{rec.action} ({rec.category})</div>
                      <p className="text-slate-300 text-[11px]">{rec.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
