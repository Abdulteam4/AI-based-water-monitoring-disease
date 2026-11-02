import React from 'react';
import { ShieldAlert, AlertTriangle, Info, Bug, HeartPulse, Activity } from 'lucide-react';

const DISEASE_MATRIX = [
  {
    title: 'Gastrointestinal Illness Risk',
    category: 'Microbial / Biological',
    severity: 'HIGH',
    triggers: 'High Turbidity (>5 NTU) + Low Chloramines (<0.5 mg/L) + High TOC (>8 mg/L)',
    description: 'Suspended particulate matter shields bacterial pathogens from chemical disinfectants. High organic carbon provides nutrient substrates for microbial biofilm proliferation.',
    pathogens: ['Escherichia coli', 'Giardia lamblia', 'Cryptosporidium parvum']
  },
  {
    title: 'Cholera & Typhoid Vector Risk',
    category: 'Waterborne Bacterial Pathogen',
    severity: 'CRITICAL',
    triggers: 'Turbidity (>8 NTU) + Dissolved Oxygen (<4 mg/L) + Organic Carbon (>10 mg/L)',
    description: 'Severe organic contamination and depleted oxygen levels signify stagnant, sewage-impacted water vectors capable of transmitting acute epidemic enteric fevers.',
    pathogens: ['Vibrio cholerae', 'Salmonella typhi']
  },
  {
    title: 'Methemoglobinemia Risk ("Blue Baby Syndrome")',
    category: 'Inorganic Chemical Toxicity',
    severity: 'CRITICAL',
    triggers: 'Elevated Nitrate (>10.0 mg/L)',
    description: 'Nitrates from agricultural fertilizer runoff convert to nitrites in infantile gastrointestinal tracts, binding irreversibly to hemoglobin and obstructing cellular oxygen distribution.',
    pathogens: ['Nitrate (NO3-) Toxicity']
  },
  {
    title: 'Heavy Metal Toxicity (Lead)',
    category: 'Heavy Metal Contamination',
    severity: 'CRITICAL',
    triggers: 'Lead Level (>0.015 mg/L) + Acidic pH (<6.5)',
    description: 'Corroding lead service lines release soluble lead ions. Chronic exposure induces permanent neuro-developmental deficits, hypertension, and renal dysfunction.',
    pathogens: ['Soluble Lead (Pb2+)']
  },
  {
    title: 'Disinfection Byproduct Toxicity',
    category: 'Chemical Carcinogen Risk',
    severity: 'HIGH',
    triggers: 'Trihalomethanes (>80 µg/L) + High Chlorine',
    description: 'Chlorine disinfectant reacts with ambient natural organic matter to produce halogenated organohalides linked to bladder cancer and central nervous system damage.',
    pathogens: ['Trihalomethanes (THMs)']
  }
];

export default function DiseaseRiskPage() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Waterborne Pathogen & Health Risk Matrix</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100">Disease Risk Assessment Hub</h1>
        <p className="text-xs text-slate-400 mt-1">
          Automated correlation mapping between water parameter anomalies and potential health hazards.
        </p>
      </div>

      {/* Non-Medical Disclaimer */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-start space-x-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-100">IMPORTANT HEALTH & LEGAL NOTICE:</strong> The evaluations listed below represent environmental risk assessments based on physical and chemical parameter thresholds. They are intended for monitoring and decision-support only and do NOT constitute a certified microbiological laboratory assay or medical diagnosis.
        </div>
      </div>

      {/* Disease Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DISEASE_MATRIX.map((item, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                  {item.category}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${item.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                  {item.severity} RISK
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-100 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.description}</p>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-[11px] mb-4">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Trigger Parameter Pattern:</span>
                <span className="font-mono text-amber-300">{item.triggers}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Associated Pathogens / Chemical Vectors:</span>
              <div className="flex flex-wrap gap-1.5">
                {item.pathogens.map((p, pIdx) => (
                  <span key={pIdx} className="text-[10px] font-mono bg-slate-900 text-cyan-400 px-2 py-0.5 rounded border border-slate-800">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
