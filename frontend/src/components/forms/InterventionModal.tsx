import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ShieldAlert, UserCheck, Send, BookOpen, Clock } from 'lucide-react';

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  rollNumber: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  courseId?: string;
  courseName?: string;
  onSuccess?: () => void;
}

export const InterventionModal: React.FC<InterventionModalProps> = ({
  isOpen,
  onClose,
  studentId,
  studentName,
  rollNumber,
  riskScore,
  riskLevel,
  courseId,
  courseName = 'Discrete Mathematics',
  onSuccess,
}) => {
  const [actionType, setActionType] = useState<'ACADEMIC_ALERT' | 'STUDY_PLAN' | 'MEETING_REQUEST' | 'PEER_TUTORING'>('ACADEMIC_ALERT');
  const [notes, setNotes] = useState(
    `Early academic risk detected. Please meet with the instructor during office hours (Tuesday 2-4 PM) to review graph proof techniques and establish an attendance recovery plan.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.triggerIntervention({
        studentId,
        courseId,
        actionType,
        notes,
      });

      if (res.success) {
        toast.success('Intervention Dispatched', `Academic alert and custom study roadmap sent to ${studentName}`);
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error('Intervention Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span>Trigger Early Academic Intervention</span>
        </div>
      }
      description={`Faculty Action for ${studentName} (${rollNumber})`}
      maxWidth="lg"
    >
      <form onSubmit={handleSend} className="space-y-4 text-xs">
        {/* Student Risk Profile Banner */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">{studentName}</div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">{courseName}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400">Risk Score</div>
              <div className="font-extrabold text-rose-600 dark:text-rose-400 text-sm">{riskScore}/100</div>
            </div>
            <Badge variant="danger" size="sm">
              {riskLevel} Risk
            </Badge>
          </div>
        </div>

        {/* Intervention Strategy Selector */}
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
            Intervention Action Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'ACADEMIC_ALERT', label: 'Academic Alert & Warning', desc: 'Notify student of attendance/grade risk' },
              { id: 'MEETING_REQUEST', label: '1-on-1 Mentoring Meeting', desc: 'Schedule office hours counseling session' },
              { id: 'STUDY_PLAN', label: 'Curated 7-Day Study Plan', desc: 'Assign mandatory remedial problem set' },
              { id: 'PEER_TUTORING', label: 'Peer Tutoring Assignment', desc: 'Pair with high-performing class peer' },
            ].map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setActionType(type.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  actionType === type.id
                    ? 'border-brand-500 bg-brand-500/15 text-slate-900 dark:text-white shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white">{type.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Personalized Notes */}
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Personalized Guidance & Action Instructions
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 leading-relaxed"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" size="sm" isLoading={isSubmitting} className="gap-1.5">
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Academic Intervention</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
