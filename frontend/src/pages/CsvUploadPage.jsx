import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowRight, Download } from 'lucide-react';
import { waterService } from '../services/api';

export default function CsvUploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setResult(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a valid CSV file.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await waterService.uploadCsv(file);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process CSV file.');
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent = "ph,hardness,solids,chloramines,sulfate,conductivity,organic_carbon,trihalomethanes,turbidity,dissolved_oxygen,nitrate,lead\n7.2,130,280,2.2,140,420,2.8,42,1.8,8.5,3.5,0.002\n4.8,290,1100,0.1,450,1100,12.5,115,14.2,3.2,25.0,0.045\n6.8,180,450,1.8,190,520,3.5,55,2.4,7.8,12.0,0.004\n";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "sample_water_quality_input.csv";
    a.click();
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 mb-2">
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Batch Data Processing</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100">CSV Batch Dataset Upload</h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload bulk water sample datasets for automated multi-sample AI predictions and risk reports.
        </p>
      </div>

      {/* Main Upload Box */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-slate-700/80 hover:border-cyan-500/50 rounded-3xl p-8 transition cursor-pointer bg-slate-900/40 relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FileSpreadsheet className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-200">
              {file ? file.name : 'Click or Drag CSV File Here'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports standard column headers: ph, turbidity, solids, chloramines, hardness, sulfate, nitrate, lead.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={downloadSampleCsv}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 glass-panel hover:bg-slate-800 text-slate-300 font-semibold text-xs px-5 py-3 rounded-xl border border-slate-700 transition"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Download Sample CSV Template</span>
            </button>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs px-7 py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
            >
              {loading ? (
                <span>Processing Batch Predictions...</span>
              ) : (
                <>
                  <span>Process Batch Upload</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Summary Box */}
      {result && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 animate-in fade-in">
          <div className="flex items-center space-x-3 text-emerald-400 font-bold text-base mb-4">
            <CheckCircle2 className="w-6 h-6" />
            <span>Batch Analysis Complete!</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <p className="text-2xl font-extrabold text-slate-100">{result.samples_count}</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Total Processed</p>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <p className="text-2xl font-extrabold text-emerald-400">{result.safe_count}</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Safe Samples</p>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <p className="text-2xl font-extrabold text-rose-400">{result.risk_count}</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Risk Detected</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
