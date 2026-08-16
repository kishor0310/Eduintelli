import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import { useAuth } from '../context/AuthContext';

// Pages
import { HomePage } from '../pages/Home/HomePage';
import { CoursesPage } from '../pages/Courses/CoursesPage';
import { CourseDetailsPage } from '../pages/CourseDetails/CourseDetailsPage';
import { StudentDashboard } from '../pages/Student/StudentDashboard';
import { TeacherDashboard } from '../pages/Teacher/TeacherDashboard';
import { AdminDashboard } from '../pages/Admin/AdminDashboard';
import { AttendancePage } from '../pages/Attendance/AttendancePage';
import { AssignmentsPage } from '../pages/Assignments/AssignmentsPage';
import { ExaminationsPage } from '../pages/Examinations/ExaminationsPage';
import { ReportPage } from '../pages/Reports/ReportPage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { RegisterPage } from '../pages/Auth/RegisterPage';

export const AppRouter: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Authenticated Dashboard Pages */}
      <Route element={<DashboardLayout />}>
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailsPage />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/examinations" element={<ExaminationsPage />} />
        <Route path="/reports" element={<ReportPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
