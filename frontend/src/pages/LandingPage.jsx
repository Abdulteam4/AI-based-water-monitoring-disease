import React from 'react';
import { Link } from 'react-router-dom';
import {
  Droplet,
  Brain,
  ShieldCheck,
  Activity,
  FileText,
  ArrowRight,
  CheckCircle2,
  Lock,
  LineChart,
  Sliders,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <header className="h-20 border-b border-slate-800/80 px-6 lg:px-12 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wide leading-none">AI WATER MONITOR</h1>
            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mt-0.5">Environmental Health Intelligence</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-300 hover:text-cyan-400 px-4 py-2 rounded-xl hover:bg-slate-900 transition"
          >
            Sign In
          </Link>
          <Link
            to="/app"
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 transition transform active:scale-95"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 lg:px-12 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glowing Background Blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation AI Water Quality & Disease Risk Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight max-w-4xl mx-auto">
          AI-Powered Water Quality & <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">Disease Risk Monitoring</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Intelligent water parameter analysis, multi-model machine learning predictions, explainable AI contribution factors, and automated health risk advisories.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/app/analysis"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-xl shadow-cyan-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Droplet className="w-4 h-4" />
            <span>Analyze Water Sample Now</span>
          </Link>
          <Link
            to="/app"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 glass-panel hover:bg-slate-900 text-slate-200 font-semibold text-sm px-7 py-3.5 rounded-2xl border border-slate-800 transition"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Explore Dashboard</span>
          </Link>
        </div>

        {/* Live Statistics Ribbon */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 text-center">
            <p className="text-2xl lg:text-3xl font-extrabold text-cyan-400">3,500+</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Samples Analyzed</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 text-center">
            <p className="text-2xl lg:text-3xl font-extrabold text-emerald-400">94.2%</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Model Accuracy</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 text-center">
            <p className="text-2xl lg:text-3xl font-extrabold text-amber-400">12</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">WHO Parameters</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 text-center">
            <p className="text-2xl lg:text-3xl font-extrabold text-blue-400">&lt; 50ms</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Inference Speed</p>
          </div>
        </div>
      </section>

      {/* 4-Step Workflow Section */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800/80 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">How It Works</h2>
            <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight">4-Step Intelligent Workflow</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 font-extrabold flex items-center justify-center mb-4 border border-cyan-500/20 text-sm">
                01
              </div>
              <h4 className="font-bold text-base text-slate-100 mb-2">Collect Water Data</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter physical & chemical parameters manually or upload batch CSV datasets from lab readings or IoT sensors.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 font-extrabold flex items-center justify-center mb-4 border border-blue-500/20 text-sm">
                02
              </div>
              <h4 className="font-bold text-base text-slate-100 mb-2">Analyze Parameters</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated preprocessing standardizes input parameters (pH, Turbidity, Lead, Nitrates, Chloramines, Solids) against WHO thresholds.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 font-extrabold flex items-center justify-center mb-4 border border-teal-500/20 text-sm">
                03
              </div>
              <h4 className="font-bold text-base text-slate-100 mb-2">AI Prediction</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-model Machine Learning pipeline evaluates potability probability and computes a 0-100 Water Safety Score.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 font-extrabold flex items-center justify-center mb-4 border border-amber-500/20 text-sm">
                04
              </div>
              <h4 className="font-bold text-base text-slate-100 mb-2">Risk & Recommendation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identifies health disease risks, provides Explainable AI feature rankings, and outputs actionable purification advisories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Platform Capabilities</h2>
          <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight">Enterprise Environmental Health Features</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-7 rounded-2xl border border-slate-800 glass-panel-hover">
            <Brain className="w-8 h-8 text-cyan-400 mb-4" />
            <h4 className="font-bold text-lg text-slate-100 mb-2">AI Potability Prediction</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trained across Random Forest, Gradient Boosting, SVM, and Neural trees to deliver high-confidence potability classifications.
            </p>
          </div>

          <div className="glass-panel p-7 rounded-2xl border border-slate-800 glass-panel-hover">
            <ShieldCheck className="w-8 h-8 text-teal-400 mb-4" />
            <h4 className="font-bold text-lg text-slate-100 mb-2">Disease Risk Assessment</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maps biological & chemical parameter anomalies to potential risks like Gastroenteritis, Cholera vectoring, and Methemoglobinemia.
            </p>
          </div>

          <div className="glass-panel p-7 rounded-2xl border border-slate-800 glass-panel-hover">
            <Sliders className="w-8 h-8 text-blue-400 mb-4" />
            <h4 className="font-bold text-lg text-slate-100 mb-2">Explainable AI (XAI)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent feature importance rankings showing exactly which parameters contributed to unsafe classifications.
            </p>
          </div>

          <div className="glass-panel p-7 rounded-2xl border border-slate-800 glass-panel-hover">
            <Activity className="w-8 h-8 text-purple-400 mb-4" />
            <h4 className="font-bold text-lg text-slate-100 mb-2">Live IoT Telemetry</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulated real-time sensor stream ready for hardware integrations (pH, Turbidity, TDS, DO sensors).
            </p>
          </div>

          <div className="glass-panel p-7 rounded-2xl border border-slate-800 glass-panel-hover">
            <FileText className="w-8 h-8 text-amber-400 mb-4" />
            <h4 className="font-bold text-lg text-slate-100 mb-2">Automated PDF Reports</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate publication-grade PDF and CSV compliance reports with full parameter breakdowns and advisories.
            </p>
          </div>

          <div className="glass-panel p-7 rounded-2xl border border-slate-800 glass-panel-hover">
            <LineChart className="w-8 h-8 text-emerald-400 mb-4" />
            <h4 className="font-bold text-lg text-slate-100 mb-2">Historical Trend Analytics</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track sampling sites over time, monitor location safety trends, and receive instant alert notifications.
            </p>
          </div>
        </div>
      </section>

      {/* Professional Medical Disclaimer Footer */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-800/80 px-6 lg:px-12 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 mb-8 flex items-start space-x-3 text-slate-400 text-xs leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">PROFESSIONAL DISCLAIMER:</strong> This AI-Based Water Disease Monitoring system is designed as an environmental decision-support tool. Predictions, health risk evaluations, and treatment suggestions do NOT constitute certified laboratory microbiological analysis or professional medical advice. Always verify water potability with certified public health authorities.
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-900 pt-6">
            <p>© 2026 AI Based Water Disease Monitor. Built with FastAPI, React & Scikit-Learn.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/app" className="hover:text-cyan-400 transition">Dashboard</Link>
              <Link to="/app/model-info" className="hover:text-cyan-400 transition">Model Metrics</Link>
              <Link to="/login" className="hover:text-cyan-400 transition">Sign In</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
