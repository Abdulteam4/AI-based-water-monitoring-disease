import React, { useState, useEffect } from 'react';
import { BellRing, CheckCircle, Trash2, AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import { alertsService } from '../services/api';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await alertsService.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to load alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolve = async (id) => {
    await alertsService.resolveAlert(id);
    fetchAlerts();
  };

  const handleDelete = async (id) => {
    await alertsService.deleteAlert(id);
    fetchAlerts();
  };

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-red-400 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 mb-2">
            <BellRing className="w-3.5 h-3.5" />
            <span>Automated Hazard Notification Center</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Intelligent Safety Alerts</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time alerts triggered by critical water quality threshold violations.</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center text-slate-400 text-xs">
            No active water safety alerts detected. All monitored sites compliant.
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`glass-panel p-5 rounded-2xl border flex items-start justify-between gap-4 transition ${
                alert.is_resolved
                  ? 'border-slate-800 opacity-60'
                  : alert.severity === 'CRITICAL'
                  ? 'border-red-500/40 bg-red-500/5'
                  : 'border-amber-500/40 bg-amber-500/5'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {alert.severity === 'CRITICAL' ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-sm text-slate-100">{alert.title}</h3>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                      {alert.location_name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                  <p className="text-[10px] text-slate-500 mt-2">{new Date(alert.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {!alert.is_resolved && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Resolve</span>
                  </button>
                )}
                <button onClick={() => handleDelete(alert.id)} className="p-1.5 text-slate-500 hover:text-red-400 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
