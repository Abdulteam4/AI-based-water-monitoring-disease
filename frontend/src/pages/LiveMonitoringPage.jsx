import React, { useState, useEffect } from 'react';
import { Activity, Wifi, Radio, Cpu, RefreshCw, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function LiveMonitoringPage() {
  const [telemetry, setTelemetry] = useState([]);
  const [currentReadings, setCurrentReadings] = useState({
    ph: 7.35,
    turbidity: 1.42,
    tds: 265,
    temp: 21.4,
    dissolved_oxygen: 8.6,
    status: 'OPTIMAL'
  });

  useEffect(() => {
    // Generate initial history
    const initialData = [];
    const now = new Date();
    for (let i = 10; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 3000);
      initialData.push({
        time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ph: parseFloat((7.2 + Math.random() * 0.3).toFixed(2)),
        turbidity: parseFloat((1.2 + Math.random() * 0.5).toFixed(2)),
        tds: Math.round(250 + Math.random() * 30)
      });
    }
    setTelemetry(initialData);

    // Live update interval
    const interval = setInterval(() => {
      const newPh = parseFloat((7.2 + Math.random() * 0.4).toFixed(2));
      const newTurb = parseFloat((1.2 + Math.random() * 0.6).toFixed(2));
      const newTds = Math.round(250 + Math.random() * 35);
      const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setCurrentReadings({
        ph: newPh,
        turbidity: newTurb,
        tds: newTds,
        temp: parseFloat((21.0 + Math.random() * 0.8).toFixed(1)),
        dissolved_oxygen: parseFloat((8.4 + Math.random() * 0.5).toFixed(1)),
        status: newTurb > 5.0 ? 'WARNING' : 'OPTIMAL'
      });

      setTelemetry((prev) => [
        ...prev.slice(1),
        { time: newTime, ph: newPh, turbidity: newTurb, tds: newTds }
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Simulated Real-Time IoT Telemetry</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100">Live IoT Water Monitoring Hub</h1>
          <p className="text-xs text-slate-400 mt-1">
            Continuous streaming sensor parameters with instant threshold trigger support.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center space-x-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-semibold">
            <Wifi className="w-4 h-4" />
            <span>Sensors Online (4 Node Array)</span>
          </span>
        </div>
      </div>

      {/* Live Reading Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">pH Sensor Node</p>
          <h3 className="text-3xl font-extrabold text-cyan-400 mt-1 font-mono">{currentReadings.ph}</h3>
          <p className="text-[11px] text-slate-500 mt-1">Normal: 6.5 - 8.5 pH</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Turbidity Sensor</p>
          <h3 className="text-3xl font-extrabold text-teal-400 mt-1 font-mono">{currentReadings.turbidity} <span className="text-xs font-normal">NTU</span></h3>
          <p className="text-[11px] text-slate-500 mt-1">Normal: &lt; 5.0 NTU</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">TDS Sensor Node</p>
          <h3 className="text-3xl font-extrabold text-blue-400 mt-1 font-mono">{currentReadings.tds} <span className="text-xs font-normal">mg/L</span></h3>
          <p className="text-[11px] text-slate-500 mt-1">Normal: 100 - 500 mg/L</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Temperature</p>
          <h3 className="text-3xl font-extrabold text-amber-400 mt-1 font-mono">{currentReadings.temp} <span className="text-xs font-normal">°C</span></h3>
          <p className="text-[11px] text-slate-500 mt-1">DO: {currentReadings.dissolved_oxygen} mg/L</p>
        </div>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h2 className="text-sm font-bold text-slate-100 mb-4">Real-Time pH Stream</h2>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                <YAxis domain={[6, 9]} stroke="#64748B" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="ph" stroke="#38BDF8" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h2 className="text-sm font-bold text-slate-100 mb-4">Real-Time Turbidity Stream (NTU)</h2>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                <YAxis domain={[0, 5]} stroke="#64748B" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="turbidity" stroke="#2DD4BF" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
