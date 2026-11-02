import React from 'react';

export default function WaterQualityGauge({ score = 85, status = 'SAFE', size = 180 }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return { stroke: '#10B981', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (s >= 65) return { stroke: '#F59E0B', text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    if (s >= 40) return { stroke: '#F97316', text: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' };
    return { stroke: '#EF4444', text: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
  };

  const theme = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} viewBox="0 0 180 180" className="transform -rotate-90">
        {/* Background Arc */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="#1E293B"
          strokeWidth="12"
          fill="transparent"
        />
        {/* Progress Arc */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke={theme.stroke}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="gauge-arc transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Inner Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold text-slate-100 tracking-tight">{score}</span>
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest -mt-1">/ 100</span>
        <span className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${theme.bg} ${theme.text}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
