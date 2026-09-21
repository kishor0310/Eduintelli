import React from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SpeakButton } from '../voice/SpeakButton';
import { RiskAnalysis } from '../../types';
import { Sparkles, AlertTriangle, CheckCircle, Info, Calculator, Target } from 'lucide-react';

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
  const { riskScore, riskLevel, factors, reasons, recommendedActions } = risk;

  const badgeVariant =
    riskLevel === 'HIGH' ? 'danger' :
    riskLevel === 'MEDIUM' ? 'warning' : 'success';

  const diagnosticNarration = `Explainable AI Risk Diagnostic: Your risk score is ${riskScore} out of 100, placing you in the ${riskLevel} risk category. Primary reasons include: ${reasons.join('. ')}. Your remediation priorities are: ${recommendedActions.join('. ')}.`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>Explainable AI Risk Diagnostic</span>
        </div>
      }
      description="Full mathematical transparency into academic indicators and causal contributors."
      maxWidth="2xl"
    >
      <div className="space-y-5 text-slate-800 dark:text-slate-100">
        {/* Top Summary Banner */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Calculated Risk Index</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {riskScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SpeakButton
              text={diagnosticNarration}
              title="Full AI Diagnostic"
              label="Listen"
            />
            <Badge variant={badgeVariant} size="md">
              {riskLevel} Risk
            </Badge>
          </div>
        </div>

        {/* 1. Why am I at risk? (Causal Analysis) */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Why am I in this risk bracket?</span>
          </h4>
          <div className="space-y-2">
            {reasons.map((reason, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
              >
                <div className="p-1 rounded-md bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-transparent mt-0.5 shrink-0">
                  <AlertTriangle className="w-3 h-3" />
                </div>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Transparent Multi-Factor Formula Breakdown */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-sky-500" />
            <span>Risk Formula & Factor Weights</span>
          </h4>
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-2">
            <div className="text-slate-500 dark:text-slate-400 text-[11px]">
              Risk = (Attendance × 25%) + (Assignments × 20%) + (Exams × 35%) + (Trend × 20%)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400">Attendance</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{factors.attendanceRisk}/100</div>
                <div className="text-[10px] text-sky-600 dark:text-sky-400">Weight: 25%</div>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400">Assignments</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{factors.assignmentRisk}/100</div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400">Weight: 20%</div>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400">Exams</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{factors.examRisk}/100</div>
                <div className="text-[10px] text-rose-600 dark:text-rose-400">Weight: 35%</div>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400">Trajectory</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{factors.trendRisk}/100</div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400">Weight: 20%</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Recommended Remediation Plan */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-500" />
            <span>Prescribed Action Roadmap to Lower Risk</span>
          </h4>
          <div className="space-y-2">
            {recommendedActions.map((action, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-200"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
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
