import OpenAI from 'openai';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const transporter = nodemailer.createTransport({
  service: 'gmail', // Ensure to use App Passwords for Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const generateAlertMessage = async (studentName, attendancePercentage, neededToRecover) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a supportive but firm college administrator."
        },
        {
          role: "user",
          content: `Write a short, personalized alert message for a student named ${studentName}. Their current attendance is ${attendancePercentage}%, which is below the required 70%. They need to attend ${neededToRecover} more classes to recover. Keep it professional but encouraging.`
        }
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating alert:', error);
    return `Dear ${studentName}, your attendance has dropped to ${attendancePercentage}%. Please attend ${neededToRecover} more classes to reach 70%.`;
  }
};

export const generateMotivationMessage = async (studentName, streakDays) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an enthusiastic and highly motivating college AI assistant."
        },
        {
          role: "user",
          content: `Write a very short, creative, and personalized motivational message for a student named ${studentName} who has a ${streakDays}-day perfect attendance streak. Make it sound unique and not generic. Max 2-3 sentences.`
        }
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating motivation:', error);
    return `Great job ${studentName}! You have an amazing ${streakDays}-day attendance streak! Keep it up.`;
  }
};

export const sendEmail = async (toEmail, subject, textContent) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[Email Mock] To: ${toEmail} | Subject: ${subject} | Content: ${textContent}`);
      return;
    }
    await transporter.sendMail({
      from: `"College Attendance System" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      text: textContent,
    });
    console.log(`Email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Failed to send email to ${toEmail}:`, error);
  }
};
