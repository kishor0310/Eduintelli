import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RiskAnalysis } from '../../types';
import { ShieldAlert, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';

interface RiskScoreCardProps {
  risk: RiskAnalysis;
  onExplainClick: () => void;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ risk, onExplainClick }) => {
  const { riskScore, riskLevel, factors } = risk;

  // Determine stroke color and background glow based on risk level
  const colorMap = {
    LOW: { stroke: '#10b981', glow: 'shadow-emerald-500/20', text: 'text-emerald-400', badge: 'success' as const, label: 'Low Risk (On Track)' },
    MEDIUM: { stroke: '#f59e0b', glow: 'shadow-amber-500/20', text: 'text-amber-400', badge: 'warning' as const, label: 'Medium Risk (Action Needed)' },
    HIGH: { stroke: '#ef4444', glow: 'shadow-rose-500/25', text: 'text-rose-400', badge: 'danger' as const, label: 'High Risk (Critical Intervention)' },
  };

  const currentConfig = colorMap[riskLevel] || colorMap.LOW;

  // SVG Circular Gauge calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <Card className="relative flex flex-col justify-between border border-slate-700/60 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-xl overflow-hidden">
      {/* Background Accent Glow */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: currentConfig.stroke }}
      />

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Academic Risk Index</span>
            <button
              onClick={onExplainClick}
              title="Explainable Risk Model"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <Badge variant={currentConfig.badge} size="sm">
            {currentConfig.label}
          </Badge>
        </div>

        {/* Gauge + Factors Row */}
        <div className="flex items-center gap-5 my-2">
          {/* Circular Gauge */}
          <div className="relative flex items-center justify-center shrink-0 w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="#1e293b"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke={currentConfig.stroke}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white">{riskScore}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
            </div>
          </div>

          {/* Factor Breakdown Bars */}
          <div className="flex-1 space-y-1.5 text-xs">
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                <span>Attendance (25%)</span>
                <span className="font-semibold text-slate-200">{factors.attendanceRisk}/100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-400 transition-all duration-500"
                  style={{ width: `${factors.attendanceRisk}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                <span>Assignments (20%)</span>
                <span className="font-semibold text-slate-200">{factors.assignmentRisk}/100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-400 transition-all duration-500"
                  style={{ width: `${factors.assignmentRisk}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                <span>Examinations (35%)</span>
                <span className="font-semibold text-slate-200">{factors.examRisk}/100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-400 transition-all duration-500"
                  style={{ width: `${factors.examRisk}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          {riskLevel === 'HIGH' ? (
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          )}
          <span className="truncate max-w-[200px]">
            {riskLevel === 'HIGH' ? 'Early intervention advised' : 'Academic indicators healthy'}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onExplainClick}
          className="text-xs text-brand-400 hover:text-brand-300 p-0 h-auto gap-1"
        >
          <span>Why am I at risk?</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
};
