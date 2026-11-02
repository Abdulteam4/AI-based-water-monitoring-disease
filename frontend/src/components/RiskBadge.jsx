import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, Flame } from 'lucide-react';

export default function RiskBadge({ status = 'SAFE', size = 'normal' }) {
  const badgeConfig = {
    SAFE: {
      label: 'SAFE',
      icon: ShieldCheck,
      style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    MODERATE: {
      label: 'MODERATE RISK',
      icon: AlertTriangle,
      style: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    },
    UNSAFE: {
      label: 'UNSAFE',
      icon: AlertCircle,
      style: 'bg-orange-500/10 text-orange-400 border-orange-500/30'
    },
    CRITICAL: {
      label: 'CRITICAL HAZARD',
      icon: Flame,
      style: 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse'
    }
  };

  const current = badgeConfig[status?.toUpperCase()] || badgeConfig.SAFE;
  const Icon = current.icon;

  const padding = size === 'large' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]';

  return (
    <span className={`inline-flex items-center space-x-1.5 font-bold uppercase tracking-wider rounded-full border ${current.style} ${padding}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{current.label}</span>
    </span>
  );
}
