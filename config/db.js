import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite Database Connected - No background services required!');
    await sequelize.sync(); // Auto-create tables if they don't exist
  } catch (error) {
    console.error(`Error connecting to SQLite: ${error.message}`);
    process.exit(1);
  }
};

export default sequelize;
