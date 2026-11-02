import React from 'react';
import { FileSpreadsheet, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 mb-2">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Automated Compliance Reporting Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100">Report Generator</h1>
        <p className="text-xs text-slate-400 mt-1">Export publication-grade PDF and CSV water safety audits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <FileSpreadsheet className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-100 mb-2">Full CSV Data Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Export complete historical dataset including all 12 parameters, water safety scores, status classifications, and timestamps.
            </p>
          </div>
          <a
            href="http://localhost:8000/api/reports/csv"
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download All Data (CSV)</span>
          </a>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <FileText className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-100 mb-2">PDF Executive Compliance Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Generate formatted PDF audit reports containing WHO threshold comparison tables, Explainable AI rankings, disease risk assessments, and disclaimers.
            </p>
          </div>
          <a
            href="http://localhost:8000/api/reports/pdf/1"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center space-x-2 glass-panel hover:bg-slate-800 text-slate-200 font-bold text-xs py-3 rounded-xl border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Generate Sample Audit (PDF)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
