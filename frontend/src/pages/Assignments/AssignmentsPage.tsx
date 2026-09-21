import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { AssignmentSubmitModal } from '../../components/forms/AssignmentSubmitModal';
import { AssignmentGradeModal } from '../../components/forms/AssignmentGradeModal';
import { SpeakButton } from '../../components/voice/SpeakButton';
import { Assignment } from '../../types';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Award,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const AssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Submit Modal
  const [selectedAsgnForSubmit, setSelectedAsgnForSubmit] = useState<Assignment | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Grade Modal for Teachers
  const [selectedSubForGrade, setSelectedSubForGrade] = useState<any>(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, [user]);

  const loadAssignments = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAssignments();
      if (res.success && res.data) {
        setAssignments(res.data);
      }
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Retrieving assignments, submission records, and rubrics..." />;
  }

  const completedCount = assignments.filter(a => a.user_submission).length;
  const gradedCount = assignments.filter(a => a.user_submission?.status === 'GRADED').length;
  const lateCount = assignments.filter(a => a.user_submission?.status === 'LATE').length;

  const assignmentsVoiceSummary = `Continuous Assessment Status: You have ${assignments.length} total coursework tasks. ${completedCount} are submitted and ${gradedCount} have been evaluated with feedback. ${
    lateCount > 0 ? `Notice: You have ${lateCount} overdue or late tasks affecting your risk score.` : 'You have zero late penalty deductions.'
  }`;

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono">
              Continuous Assessment Workbench
            </span>
            <Badge variant="ai" size="sm">
              Weightage: 20% of Risk Index
            </Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            <span>Assignments & Coursework Manager</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Submit coursework, track submission deadlines, and review grading rubrics and faculty feedback.
          </p>
        </div>

        <SpeakButton
          text={assignmentsVoiceSummary}
          label="Listen to Assignments Status"
          size="sm"
          variant="outline"
        />
      </div>

      {/* 2. STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Assignments"
          value={assignments.length}
          subtitle={`${completedCount} Submitted`}
          icon={<FileCheck2 className="w-4 h-4" />}
          variant="primary"
        />

        <StatCard
          title="Graded Submissions"
          value={gradedCount}
          subtitle="Evaluated with feedback"
          icon={<Award className="w-4 h-4" />}
          variant="success"
        />

        <StatCard
          title="Late / Overdue Penalties"
          value={lateCount}
          subtitle={lateCount > 0 ? '⚠️ Incurs risk index penalty' : 'Zero late submissions'}
          icon={<Clock className="w-4 h-4" />}
          variant={lateCount > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* 3. ASSIGNMENTS LIST */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <span>Active Course Assignments</span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {assignments.map((asgn) => {
            const sub = asgn.user_submission;
            const isLate = new Date() > new Date(asgn.due_date) && !sub;

            return (
              <Card key={asgn.id} className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20">
                        {asgn.course_code}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">{asgn.course_name}</span>
                      <Badge variant="outline" size="sm">
                        Max Score: {asgn.max_score} pts
                      </Badge>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight mt-1">{asgn.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">{asgn.description}</p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                      <span>Due: {formatDate(asgn.due_date)}</span>
                    </span>

                    {sub ? (
                      <Badge
                        variant={sub.status === 'GRADED' ? 'success' : sub.status === 'LATE' ? 'warning' : 'info'}
                        size="md"
                      >
                        {sub.status === 'GRADED' ? `Score: ${sub.score}/${asgn.max_score} pts` : sub.status}
                      </Badge>
                    ) : isLate ? (
                      <Badge variant="danger" size="md">
                        Past Deadline
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="md">
                        Pending Submission
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Feedback Box if Graded */}
                {sub?.feedback && (
                  <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/30 text-xs">
                    <div className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 mb-1">
                      <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Faculty Feedback & Evaluation</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 italic">{sub.feedback}</p>
                  </div>
                )}

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Weightage: {asgn.weightage}% towards continuous assessment
                  </div>

                  <div className="flex items-center gap-2">
                    {user?.role === 'STUDENT' && (
                      <Button
                        size="sm"
                        variant={sub ? 'outline' : 'primary'}
                        onClick={() => {
                          setSelectedAsgnForSubmit(asgn);
                          setIsSubmitModalOpen(true);
                        }}
                        className="text-xs gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{sub ? 'Resubmit Solution' : 'Submit Assignment'}</span>
                      </Button>
                    )}

                    {user?.role === 'TEACHER' && (
                      <Button
                        size="sm"
                        variant="ai"
                        onClick={() => {
                          setSelectedSubForGrade({
                            submissionId: sub?.id || 'sub-01',
                            studentName: 'Alex Rivera',
                            assignmentTitle: asgn.title,
                            currentScore: sub?.score || 90,
                            currentFeedback: sub?.feedback || '',
                            maxScore: asgn.max_score,
                          });
                          setIsGradeModalOpen(true);
                        }}
                        className="text-xs gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Grade Submissions</span>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Submission Modal */}
      {selectedAsgnForSubmit && (
        <AssignmentSubmitModal
          isOpen={isSubmitModalOpen}
          onClose={() => {
            setIsSubmitModalOpen(false);
            setSelectedAsgnForSubmit(null);
          }}
          assignmentId={selectedAsgnForSubmit.id}
          assignmentTitle={selectedAsgnForSubmit.title}
          maxScore={selectedAsgnForSubmit.max_score}
          dueDate={selectedAsgnForSubmit.due_date}
          onSuccess={loadAssignments}
        />
      )}

      {/* Grade Modal for Teachers */}
      {selectedSubForGrade && (
        <AssignmentGradeModal
          isOpen={isGradeModalOpen}
          onClose={() => {
            setIsGradeModalOpen(false);
            setSelectedSubForGrade(null);
          }}
          submissionId={selectedSubForGrade.submissionId}
          studentName={selectedSubForGrade.studentName}
          assignmentTitle={selectedSubForGrade.assignmentTitle}
          currentScore={selectedSubForGrade.currentScore}
          currentFeedback={selectedSubForGrade.currentFeedback}
          maxScore={selectedSubForGrade.maxScore}
          onSuccess={loadAssignments}
        />
      )}
    </div>
  );
};
