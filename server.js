import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import './models/Student.js';
import './models/Attendance.js';
import './models/Message.js';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import { initCronJobs } from './services/cronJobs.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/api/system/trigger-cron', async (req, res) => {
  try {
     const { checkAlerts, sendMotivations } = await import('./services/cronJobs.js');
     await checkAlerts();
     await sendMotivations();
     res.json({ message: 'Manual cron jobs executed successfully' });
  } catch(err) {
     console.error(err);
     res.status(500).json({ message: 'Error running manual cron jobs' });
  }
});

const PORT = process.env.PORT || 5000;

// Connect DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      initCronJobs();
  });
});
