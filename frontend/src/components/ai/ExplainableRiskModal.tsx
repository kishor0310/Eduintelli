import React from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RiskAnalysis } from '../../types';
import { Sparkles, AlertTriangle, CheckCircle, Info, Calculator, Target, ArrowUpRight } from 'lucide-react';

interface ExplainableRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  risk: RiskAnalysis;
}

export const ExplainableRiskModal: React.FC<ExplainableRiskModalProps> = ({
  isOpen,
  onClose,
  risk,
}) => {
  const { riskScore, riskLevel, factors, metrics, reasons, recommendedActions } = risk;

  const badgeVariant =
    riskLevel === 'HIGH' ? 'danger' :
    riskLevel === 'MEDIUM' ? 'warning' : 'success';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>Explainable AI Risk Diagnostic</span>
        </div>
      }
      description="Full mathematical transparency into academic indicators and causal contributors."
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Top Summary Banner */}
        <div className="p-4 rounded-xl glass-card border border-slate-700/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Calculated Risk Index</div>
            <div className="text-2xl font-black text-white mt-0.5">
              {riskScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>
          <Badge variant={badgeVariant} size="md">
            {riskLevel} Risk
          </Badge>
        </div>

        {/* 1. Why am I at risk? (Causal Analysis) */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Why am I in this risk bracket?</span>
          </h4>
          <div className="space-y-2">
            {reasons.map((reason, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300"
              >
                <div className="p-1 rounded-md bg-rose-500/15 text-rose-400 mt-0.5 shrink-0">
                  <AlertTriangle className="w-3 h-3" />
                </div>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Transparent Multi-Factor Formula Breakdown */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-sky-400" />
            <span>Risk Formula & Factor Weights</span>
          </h4>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
            <div className="text-slate-400 text-[11px]">
              Risk = (Attendance × 25%) + (Assignments × 20%) + (Exams × 35%) + (Trend × 20%)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Attendance</div>
                <div className="font-bold text-white mt-0.5">{factors.attendanceRisk}/100</div>
                <div className="text-[10px] text-sky-400">Weight: 25%</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Assignments</div>
                <div className="font-bold text-white mt-0.5">{factors.assignmentRisk}/100</div>
                <div className="text-[10px] text-purple-400">Weight: 20%</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Exams</div>
                <div className="font-bold text-white mt-0.5">{factors.examRisk}/100</div>
                <div className="text-[10px] text-rose-400">Weight: 35%</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Trajectory</div>
                <div className="font-bold text-white mt-0.5">{factors.trendRisk}/100</div>
                <div className="text-[10px] text-amber-400">Weight: 20%</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Recommended Remediation Plan */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Prescribed Action Roadmap to Lower Risk</span>
          </h4>
          <div className="space-y-2">
            {recommendedActions.map((action, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2.5 text-xs text-emerald-200"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            Academic-support indicator, not a punitive measure.
          </span>
          <Button size="sm" variant="primary" onClick={onClose}>
            Got it, take action
          </Button>
        </div>
      </div>
    </Modal>
  );
};
