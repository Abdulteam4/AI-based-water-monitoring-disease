import React from 'react';

export default function KpiCard({ title, value, subtitle, icon: Icon, color = 'cyan', trend }) {
  const colorStyles = {
    cyan: 'from-cyan-500/20 to-blue-500/5 text-cyan-400 border-cyan-500/30',
    green: 'from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/30',
    rose: 'from-rose-500/20 to-red-500/5 text-rose-400 border-rose-500/30',
    blue: 'from-blue-500/20 to-indigo-500/5 text-blue-400 border-blue-500/30',
  };

  const currentStyle = colorStyles[color] || colorStyles.cyan;

  return (
    <div className={`glass-panel glass-panel-hover p-5 rounded-2xl border bg-gradient-to-br ${currentStyle} relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight">{value}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-1.5">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-center ${currentStyle.split(' ')[2]}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center space-x-1.5 text-[11px] font-medium text-slate-300">
          <span className={trend.isPositive ? 'text-emerald-400' : 'text-amber-400'}>{trend.text}</span>
          <span className="text-slate-500">vs last period</span>
        </div>
      )}
    </div>
  );
}
