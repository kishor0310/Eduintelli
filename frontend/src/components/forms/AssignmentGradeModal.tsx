import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Award, CheckCircle2 } from 'lucide-react';

interface AssignmentGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId: string;
  studentName: string;
  assignmentTitle: string;
  currentScore?: number;
  currentFeedback?: string;
  maxScore?: number;
  onSuccess?: () => void;
}

export const AssignmentGradeModal: React.FC<AssignmentGradeModalProps> = ({
  isOpen,
  onClose,
  submissionId,
  studentName,
  assignmentTitle,
  currentScore = 85,
  currentFeedback = '',
  maxScore = 100,
  onSuccess,
}) => {
  const [score, setScore] = useState<number>(currentScore);
  const [feedback, setFeedback] = useState<string>(currentFeedback || 'Solid solution implementation with well-documented runtime complexity.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.gradeSubmission({
        submissionId,
        score,
        feedback,
        status: 'GRADED',
      });

      if (res.success) {
        toast.success('Grade Recorded', `Assigned ${score}/${maxScore} pts to ${studentName}`);
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error('Grading Failed', err.message);
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
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Award className="w-4 h-4" />
          </div>
          <span>Grade Student Submission</span>
        </div>
      }
      description={`${studentName} — ${assignmentTitle}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Marks Awarded (Out of {maxScore})
          </label>
          <input
            type="number"
            min={0}
            max={maxScore}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:border-brand-500"
            required
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Detailed Pedagogical Feedback
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            placeholder="Highlight strengths, point out edge case errors, and suggest review topics..."
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 leading-relaxed"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="success" size="sm" isLoading={isSubmitting}>
            Save Grade & Feedback
          </Button>
        </div>
      </form>
    </Modal>
  );
};
