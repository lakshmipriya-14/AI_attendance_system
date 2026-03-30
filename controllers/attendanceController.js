import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

export const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, subject } = req.body;
    
    const queryDate = new Date(date).toISOString().split('T')[0]; // Format 'YYYY-MM-DD'
    
    // Check if already exists for this subject/date
    const existing = await Attendance.findOne({ 
      where: { studentId, date: queryDate, subject } 
    });
    
    if (existing) {
      existing.status = status;
      await existing.save();
    } else {
      await Attendance.create({
        studentId,
        date: queryDate,
        status,
        subject
      });
    }

    // Recalculate student stats
    const student = await Student.findByPk(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const allRecords = await Attendance.findAll({
      where: { studentId },
      order: [['date', 'DESC']]
    });
    const total = allRecords.length;
    const attended = allRecords.filter(r => r.status === 'Present').length;
    
    let streak = 0;
    for (let record of allRecords) {
       if (record.status === 'Present') streak++;
       else break;
    }

    student.totalClasses = total;
    student.attendedClasses = attended;
    student.overallAttendancePercentage = total === 0 ? 100 : Math.round((attended / total) * 100);
    student.currentStreak = streak;
    await student.save();

    res.status(200).json({ message: 'Attendance recorded successfully', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceByDate = async (req, res) => {
  try {
    const { date, subject } = req.query;
    const queryDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    
    const whereClause = { date: queryDate };
    if (subject) whereClause.subject = subject;
    
    const records = await Attendance.findAll({
      where: whereClause,
      include: [{ model: Student, attributes: ['name', 'rollNumber'] }]
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
