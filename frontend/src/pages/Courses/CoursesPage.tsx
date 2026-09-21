import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Course } from '../../types';
import { Search, Filter, BookOpen, Star, Users, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SpeakButton } from '../../components/voice/SpeakButton';

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    loadCourses();
  }, [selectedDepartment, selectedSemester]);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCourses({
        search,
        department: selectedDepartment !== 'ALL' ? selectedDepartment : undefined,
        semester: selectedSemester !== 'ALL' ? selectedSemester : undefined,
      });
      if (res.success && res.data) {
        setCourses(res.data);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCourses();
  };

  const handleEnroll = async (courseId: string, courseName: string) => {
    try {
      const res = await api.enrollInCourse(courseId);
      if (res.success) {
        toast.success('Enrollment Confirmed', `You are now enrolled in ${courseName}`);
        loadCourses();
      }
    } catch (err: any) {
      toast.error('Enrollment Failed', err.message);
    }
  };

  const coursesVoiceSummary = `Welcome to the Academic Course Catalog. We offer accredited curricula across Computer Science, AI and Data Science, and Information Technology. You are currently viewing ${courses.length} courses. Select any course to inspect the full syllabus, weekly lecture timetable, and assignment schedule.`;

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-brand-600 dark:text-brand-400" />
            <span>Academic Course Catalog</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Explore accredited curricula, syllabi, schedules, and faculty assignments.
          </p>
        </div>

        <SpeakButton
          text={coursesVoiceSummary}
          label="Listen to Catalog Overview"
          size="sm"
          variant="outline"
        />
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by code, subject title, or description..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>
          <Button type="submit" size="sm" variant="primary">
            Search
          </Button>
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="AI & Data Science">AI & Data Science</option>
            <option value="Information Technology">Information Technology</option>
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
          </select>
        </div>
      </div>

      {/* 3. COURSES CARD GRID */}
      {isLoading ? (
        <LoadingSpinner message="Filtering and retrieving course catalog..." />
      ) : courses.length === 0 ? (
        <EmptyState
          title="No Matching Courses"
          description="No courses matched your current keyword or department filters."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearch('');
            setSelectedDepartment('ALL');
            setSelectedSemester('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="p-0 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 flex flex-col justify-between overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-all group"
            >
              {/* Thumbnail Image */}
              <div className="h-44 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-950">
                <img
                  src={course.thumbnail_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400'}
                  alt={course.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 dark:opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 dark:from-slate-950 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-brand-600 dark:text-brand-400 font-mono text-[11px] font-bold border border-slate-200 dark:border-slate-800 shadow-sm">
                    {course.code}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/95 dark:bg-slate-900/90 text-amber-500 dark:text-amber-400 text-xs font-bold border border-slate-200 dark:border-slate-800 shadow-sm">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{course.rating}</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    {course.department} • Semester {course.semester} • {course.credits} Credits
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
                    {course.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div>
                    <span className="text-[10px] uppercase block text-slate-400 dark:text-slate-500">Faculty</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{course.teacher_name || 'Faculty Staff'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase block text-slate-400 dark:text-slate-500">Enrolled</span>
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <Users className="w-3 h-3 text-sky-500 dark:text-sky-400" />
                      {course.enrolled_count || 15}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <Link to={`/courses/${course.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                      <span>View Syllabus</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>

                  {user?.role === 'STUDENT' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEnroll(course.id, course.name)}
                      className="text-xs gap-1"
                    >
                      <span>Enroll</span>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
