import Student from '../models/Student.js';
import Message from '../models/Message.js';

export const getStudents = async (req, res) => {
  try {
    const students = await Student.findAll({ order: [['name', 'ASC']] });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (student) {
      const messages = await Message.findAll({ 
        where: { studentId: student.id },
        order: [['dateSent', 'DESC']]
      });
      res.json({ student, messages });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, email, rollNumber } = req.body;
    const studentExists = await Student.findOne({ where: { rollNumber } });
    if (studentExists) return res.status(400).json({ message: 'Student already exists' });
    
    const student = await Student.create({ name, email, rollNumber });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
