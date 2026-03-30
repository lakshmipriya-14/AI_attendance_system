import express from 'express';
import { markAttendance, getAttendanceByDate } from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/', markAttendance);
router.get('/', getAttendanceByDate);

export default router;
