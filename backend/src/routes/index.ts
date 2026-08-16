import { Router } from 'express';
import authRoutes from './authRoutes';
import studentRoutes from './studentRoutes';
import teacherRoutes from './teacherRoutes';
import adminRoutes from './adminRoutes';
import courseRoutes from './courseRoutes';
import attendanceRoutes from './attendanceRoutes';
import assignmentRoutes from './assignmentRoutes';
import examRoutes from './examRoutes';
import aiRoutes from './aiRoutes';
import reportRoutes from './reportRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/admin', adminRoutes);
router.use('/courses', courseRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/examinations', examRoutes);
router.use('/ai', aiRoutes);
router.use('/reports', reportRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'EduIntelli — AI-Powered Academic Intelligence Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

export default router;
