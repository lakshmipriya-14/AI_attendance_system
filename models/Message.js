import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Student from './Student.js';

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('Alert', 'Motivation'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sentVia: {
    type: DataTypes.STRING,
    defaultValue: 'Email'
  },
  dateSent: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Relationships
Student.hasMany(Message, { foreignKey: 'studentId' });
Message.belongsTo(Student, { foreignKey: 'studentId' });

export default Message;
