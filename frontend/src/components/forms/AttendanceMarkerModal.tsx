import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Calendar, Users, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AttendanceMarkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
  courseCode: string;
  onSuccess?: () => void;
}

interface StudentAttendanceRow {
  student_id: string;
  name: string;
  roll_number: string;
  academic_risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  current_status?: 'PRESENT' | 'ABSENT' | 'LATE';
  remarks?: string;
}

export const AttendanceMarkerModal: React.FC<AttendanceMarkerModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseName,
  courseCode,
  onSuccess,
}) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<StudentAttendanceRow[]>([]);
  const [statuses, setStatuses] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && courseId) {
      loadRoster();
    }
  }, [isOpen, courseId, date]);

  const loadRoster = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCourseAttendance(courseId, date);
      if (res.success && res.data) {
        setStudents(res.data);
        const initialStatus: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
        const initialRemarks: Record<string, string> = {};
        res.data.forEach((s: any) => {
          initialStatus[s.student_id] = s.current_status || 'PRESENT';
          initialRemarks[s.student_id] = s.remarks || '';
        });
        setStatuses(initialStatus);
        setRemarks(initialRemarks);
      }
    } catch {
      toast.error('Failed to load class roster');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: 'PRESENT' | 'ABSENT') => {
    const updated: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
    students.forEach(s => {
      updated[s.student_id] = status;
    });
    setStatuses(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const records = students.map(s => ({
        studentId: s.student_id,
        status: statuses[s.student_id] || 'PRESENT',
        remarks: remarks[s.student_id] || '',
      }));

      const res = await api.markAttendanceBatch({
        courseId,
        date,
        records,
      });

      if (res.success) {
        toast.success('Attendance Recorded', `Successfully saved records for ${records.length} students on ${date}`);
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error('Submission Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const presentCount = Object.values(statuses).filter(s => s === 'PRESENT').length;
  const absentCount = Object.values(statuses).filter(s => s === 'ABSENT').length;
  const lateCount = Object.values(statuses).filter(s => s === 'LATE').length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Calendar className="w-4 h-4" />
          </div>
          <span>Mark Class Attendance — {courseCode}</span>
        </div>
      }
      description={courseName}
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Session Date:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-1 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => handleMarkAll('PRESENT')}>
              Mark All Present
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleMarkAll('ABSENT')}>
              Mark All Absent
            </Button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <div className="font-bold text-base text-white">{presentCount}</div>
            <div>Present</div>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <div className="font-bold text-base text-white">{lateCount}</div>
            <div>Late</div>
          </div>
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <div className="font-bold text-base text-white">{absentCount}</div>
            <div>Absent</div>
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="max-h-72 overflow-y-auto custom-scrollbar border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {students.map((student) => {
                const currentStatus = statuses[student.student_id] || 'PRESENT';
                return (
                  <tr key={student.student_id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white">{student.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{student.roll_number}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={student.risk_level === 'HIGH' ? 'danger' : student.risk_level === 'MEDIUM' ? 'warning' : 'success'}
                        size="sm"
                      >
                        {student.risk_level} Risk
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleStatusChange(student.student_id, 'PRESENT')}
                          className={cn(
                            'px-2 py-1 rounded text-[11px] font-semibold transition-all',
                            currentStatus === 'PRESENT'
                              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          )}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.student_id, 'LATE')}
                          className={cn(
                            'px-2 py-1 rounded text-[11px] font-semibold transition-all',
                            currentStatus === 'LATE'
                              ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          )}
                        >
                          Late
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.student_id, 'ABSENT')}
                          className={cn(
                            'px-2 py-1 rounded text-[11px] font-semibold transition-all',
                            currentStatus === 'ABSENT'
                              ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          )}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isSubmitting}>
            Save Attendance
          </Button>
        </div>
      </div>
    </Modal>
  );
};
