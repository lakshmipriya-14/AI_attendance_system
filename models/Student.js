import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  rollNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  overallAttendancePercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  currentStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalClasses: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  attendedClasses: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

export default Student;
