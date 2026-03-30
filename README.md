# AI-Powered College Attendance Management System

A production-ready, full-stack application that tracks student attendance, automatically sends AI-generated warnings for low attendance (<70%), and sends AI-generated motivational messages for perfect attendance streaks.

## Tech Stack
- **Frontend**: React (Vite), React Router, Vanilla CSS (Modern Glassmorphism Design)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **AI Integration**: OpenAI SDK (GPT-3.5-turbo / GPT-4)
- **Automation**: Node-Cron
- **Email Delivery**: Nodemailer

## File Structure
```
attendance-system/
│
├── backend/                  # Node.js REST API
│   ├── config/               # Database connection
│   ├── controllers/          # Business logic
│   ├── models/               # MongoDB Schemas (Student, Attendance, Message)
│   ├── routes/               # Express Routes
│   ├── services/             # AI generating and Cron scheduling services
│   ├── .env                  # Backend credentials
│   └── server.js             # Main server entry point
│
└── frontend/                 # React Application
    ├── src/
    │   ├── components/       # Admin and Student dashboards
    │   ├── App.jsx           # Routing architecture
    │   ├── index.css         # Premium UI styles & Glassmorphism
    │   └── main.jsx          # React initialization
    ├── vite.config.js        # Vite config with API proxy
    └── package.json          # Frontend dependencies
```

## Setup Instructions

### Prerequisites
- Node.js installed
- A running MongoDB instance (Local or Atlas)
- An OpenAI API Key
- An Email account for sending alerts (Gmail with App Password recommended)

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
2. Update the `backend/.env` file with your actual keys:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/attendance-system
   OPENAI_API_KEY=your_openai_api_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```
   *(Note: If the email configuration is missing, the AI service will safely fallback and log the intended emails directly to the console).*
3. Start the backend server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

## Features & Usage
- **Admin Dashboard**: Manage attendance records and view statistics. Hit the "Execute AI Cron Jobs" button to manually test the daily scheduled automation (which detects <70% attendance and >1 streaks).
- **Student Dashboard**: Navigate to the "Student Portal" to view beautiful attendance rings and see historical AI communications securely.
