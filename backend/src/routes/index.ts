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
import { healthLimiter } from '../middleware/rateLimiter';

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

// Health check endpoint (rate limited - CWE-770, no version or stack info leakage - CWE-200)
router.get('/health', healthLimiter, (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
