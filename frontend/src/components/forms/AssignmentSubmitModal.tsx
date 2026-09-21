import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

interface AssignmentSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId: string;
  assignmentTitle: string;
  maxScore: number;
  dueDate: string;
  onSuccess?: () => void;
}

export const AssignmentSubmitModal: React.FC<AssignmentSubmitModalProps> = ({
  isOpen,
  onClose,
  assignmentId,
  assignmentTitle,
  maxScore,
  dueDate,
  onSuccess,
}) => {
  const [submissionText, setSubmissionText] = useState('');
  const [fileUrl, setFileUrl] = useState('https://uploads.eduintelli.com/my-solution.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.submitAssignment({
        assignmentId,
        fileUrl,
        submissionText,
      });

      if (res.success) {
        toast.success('Assignment Submitted', res.message || 'Your work has been uploaded for grading.');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error('Submission Failed', err.message);
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
          <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Upload className="w-4 h-4" />
          </div>
          <span>Submit Assignment</span>
        </div>
      }
      description={`Submit your solutions for "${assignmentTitle}" (Max Score: ${maxScore} pts)`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Upload Simulation Card */}
        <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-brand-500 transition-colors text-center cursor-pointer">
          <div className="p-3 rounded-full bg-slate-200 dark:bg-slate-800 text-brand-600 dark:text-brand-400 inline-block mb-2">
            <FileText className="w-6 h-6" />
          </div>
          <div className="font-bold text-slate-900 dark:text-white text-xs">Solution Document Attached</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{fileUrl}</div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">Accepted: PDF, ZIP, DOCX, IPYNB (Max 25MB)</p>
        </div>

        {/* Text Area for Comments / Code Links */}
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Student Notes & Git Repository Link (Optional)
          </label>
          <textarea
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            rows={3}
            placeholder="Include GitHub commit hashes, setup instructions, or notes for the instructor..."
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Upload & Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
};
