import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Student from './Student.js';

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Late'),
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Relationships
Student.hasMany(Attendance, { foreignKey: 'studentId' });
Attendance.belongsTo(Student, { foreignKey: 'studentId' });

export default Attendance;
