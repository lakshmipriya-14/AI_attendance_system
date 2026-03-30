import cron from 'node-cron';
import { Op } from 'sequelize';
import Student from '../models/Student.js';
import Message from '../models/Message.js';
import { generateAlertMessage, generateMotivationMessage, sendEmail } from './aiService.js';

export const checkAlerts = async () => {
  console.log('Running Alert Job...');
  try {
    const atRiskStudents = await Student.findAll({ 
      where: { overallAttendancePercentage: { [Op.lt]: 70 } } 
    });
    
    for (const student of atRiskStudents) {
      let neededToRecover = Math.ceil((0.70 * student.totalClasses - student.attendedClasses) / 0.30);
      if (neededToRecover < 0) neededToRecover = 0;
      
      const content = await generateAlertMessage(student.name, student.overallAttendancePercentage, neededToRecover);
      
      await Message.create({
        studentId: student.id,
        type: 'Alert',
        content,
        sentVia: 'Email'
      });
      
      await sendEmail(student.email, '⚠️ Important: Attendance Alert', content);
    }
    console.log(`Alert Job finished. Processed ${atRiskStudents.length} students.`);
  } catch (err) {
    console.error('Error in checkAlerts cron job:', err);
  }
};

export const sendMotivations = async () => {
  console.log('Running Motivation Job...');
  try {
    const highPerformers = await Student.findAll({ 
      where: { currentStreak: { [Op.gte]: 1 } } 
    });
    
    for (const student of highPerformers) {
      const content = await generateMotivationMessage(student.name, student.currentStreak);
      
      await Message.create({
        studentId: student.id,
        type: 'Motivation',
        content,
        sentVia: 'Email'
      });
      
      await sendEmail(student.email, '🌟 Keep up the great work!', content);
    }
    console.log(`Motivation Job finished. Processed ${highPerformers.length} students.`);
  } catch (err) {
    console.error('Error in sendMotivations cron job:', err);
  }
};

export const initCronJobs = () => {
  cron.schedule('0 20 * * *', async () => {
    console.log('Starting daily AI jobs...');
    await checkAlerts();
    await sendMotivations();
  });
  console.log('Cron jobs initialized');
};
