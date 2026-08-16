import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Star,
  Users,
  Award,
  FileCheck2,
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (id) loadCourse();
  }, [id]);

  const loadCourse = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCourseById(id!);
      if (res.success && res.data) {
        setCourse(res.data);
      }
    } catch (err) {
      console.error('Failed to load course details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      const res = await api.enrollInCourse(course.id);
      if (res.success) {
        toast.success('Enrolled!', `You are now enrolled in ${course.name}`);
        loadCourse();
      }
    } catch (err: any) {
      toast.error('Enrollment Failed', err.message);
    }
  };

  if (isLoading || !course) {
    return <LoadingSpinner message="Retrieving course curriculum, syllabus, and schedules..." />;
  }

  // Parse syllabus modules
  const syllabusModules = course.syllabus
    ? course.syllabus.split(';').map((m: string) => m.trim())
    : [
        'Module 1: Fundamental Principles & Theoretical Architecture',
        'Module 2: Algorithmic Formulations & Complexity Analysis',
        'Module 3: Advanced Optimization & Empirical System Design',
        'Module 4: Enterprise Implementation & Capstone Evaluation',
      ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Course Catalog</span>
      </Link>

      {/* 1. HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-slate-800 p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30">
                {course.code}
              </span>
              <span className="text-xs text-slate-400">
                {course.department} • Semester {course.semester}
              </span>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold ml-2">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{course.rating}</span>
              </div>
            </div>

            <h1 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight">
              {course.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shrink-0 text-center space-y-3 w-full lg:w-56">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Academic Credits</div>
              <div className="text-2xl font-black text-white">{course.credits} Units</div>
            </div>

            {user?.role === 'STUDENT' && (
              <Button variant="primary" size="md" onClick={handleEnroll} className="w-full text-xs">
                Enroll in Course
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Syllabus & Schedules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Syllabus Modules */}
          <Card className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Curriculum & Syllabus Modules</span>
            </h3>

            <div className="space-y-2.5">
              {syllabusModules.map((mod: string, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs"
                >
                  <div className="p-1 rounded-md bg-brand-500/15 text-brand-400 font-mono font-bold text-[10px] shrink-0 mt-0.5">
                    0{idx + 1}
                  </div>
                  <span className="text-slate-200 leading-relaxed font-medium">{mod}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Lecture & Lab Schedules */}
          <Card className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Class Timetable & Room Locations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.classes && course.classes.length > 0 ? (
                course.classes.map((cls: any) => (
                  <div
                    key={cls.id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-sky-400" />
                        <span>{cls.day_of_week}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">
                        {cls.start_time} - {cls.end_time} (Section {cls.section})
                      </div>
                    </div>
                    <Badge variant="outline" size="sm" className="gap-1">
                      <MapPin className="w-3 h-3 text-brand-400" />
                      <span>{cls.room_number}</span>
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 py-3 col-span-2">Regular schedule: Mon / Wed 09:00 - 10:30 AM (Room 301)</div>
              )}
            </div>
          </Card>

          {/* Assignments & Assessments in this Course */}
          <Card className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Course Assignments & Assessments</span>
            </h3>

            <div className="space-y-2 text-xs">
              {course.assignments && course.assignments.length > 0 ? (
                course.assignments.map((asgn: any) => (
                  <div
                    key={asgn.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">{asgn.title}</div>
                      <div className="text-[11px] text-slate-400">Max Score: {asgn.max_score} pts • Weightage: {asgn.weightage}%</div>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                      Due {new Date(asgn.due_date).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 py-2">No active assignments uploaded yet.</div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Col: Instructor Card & Academic Quality */}
        <div className="space-y-6">
          {/* Instructor Card */}
          <Card className="space-y-4 border border-slate-800 bg-slate-900/90">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Lead Faculty Member</h3>
            <div className="flex items-center gap-3">
              <img
                src={course.teacher_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={course.teacher_name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/30"
              />
              <div>
                <h4 className="font-bold text-white text-sm">{course.teacher_name || 'Prof. Alan Turing'}</h4>
                <p className="text-xs text-slate-400">{course.designation || 'Professor & HOD'}</p>
                <p className="text-[11px] text-brand-400">{course.teacher_email || 'teacher@demo.com'}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Specialization:</span>
                <span className="font-medium text-right max-w-[150px] truncate">{course.specialization || 'Algorithms & AI'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Office Room:</span>
                <span className="font-medium">{course.office_room || 'Tech Tower 401'}</span>
              </div>
            </div>
          </Card>

          {/* AI Intelligence Assurance Card */}
          <Card className="border border-purple-500/30 bg-purple-950/20 shadow-ai-glow space-y-3 text-xs">
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <Award className="w-4 h-4 text-purple-400" />
              <span>AI Academic Quality Assurance</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              This course is actively monitored by the EduIntelli Early Intervention Engine. Automated attendance tracking and continuous assessment diagnostics ensure students receive remediation roadmaps before critical exam failure thresholds.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
