import express from 'express';
import { getStudents, getStudentById, createStudent } from '../controllers/studentController.js';

const router = express.Router();

router.route('/').get(getStudents).post(createStudent);
router.route('/:id').get(getStudentById);

export default router;
