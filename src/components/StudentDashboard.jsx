import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Award, Mail, Calendar, AlertTriangle } from 'lucide-react';

const StudentDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentIdInput, setStudentIdInput] = useState('');

  useEffect(() => {
    if (id !== '1') {
      fetchStudent(id);
    } else {
      setLoading(false); // ID '1' used as placeholder
    }
  }, [id]);

  const fetchStudent = async (studentId) => {
    try {
      const res = await axios.get(`/api/students/${studentId}`);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (studentIdInput) {
      navigate(`/student/${studentIdInput}`);
    }
  };

  if (loading) return <h2 className="title-gradient">Loading Portal...</h2>;

  if (id === '1' || !data) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
        <h2 className="title-gradient">Student Portal Login</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Enter your internal Database ID to view your records.</p>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Paste your Student Object ID here..." 
            value={studentIdInput}
            onChange={(e) => setStudentIdInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn">View View</button>
        </form>
      </div>
    );
  }

  const { student, messages } = data;

  return (
    <div className="animate-fade-in">
      <h1 className="title-gradient">Welcome back, {student.name.split(' ')[0]}!</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Roll Number: {student.rollNumber} | {student.email}</p>

      <div className="card-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card glass-panel" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className="attendance-ring" style={{ '--percentage': student.overallAttendancePercentage }}>
            <span className="attendance-ring-inner">{student.overallAttendancePercentage}%</span>
          </div>
          <span className="stat-label" style={{ marginTop: '1rem' }}>Overall Attendance</span>
        </div>
        
        <div className="stat-card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Current Streak</span>
            <Award color="var(--accent-color)" size={32} />
          </div>
          <span className="stat-value">{student.currentStreak} Days</span>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Keep it up to get AI motivations!</p>
        </div>

        <div className="stat-card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Classes Attended</span>
            <Calendar color="var(--success-color)" size={32} />
          </div>
          <span className="stat-value">{student.attendedClasses} / {student.totalClasses}</span>
        </div>
      </div>

      <h2 style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Mail size={24} color="var(--accent-color)"/> AI Communications
      </h2>
      
      {messages.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No messages received yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map(msg => (
            <div key={msg.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: `4px solid ${msg.type === 'Alert' ? 'var(--danger-color)' : 'var(--success-color)'}`}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className={`badge ${msg.type === 'Alert' ? 'badge-danger' : 'badge-success'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {msg.type === 'Alert' ? <AlertTriangle size={14}/> : <Award size={14}/>} {msg.type}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(msg.dateSent).toLocaleString()}</span>
              </div>
              <p style={{ lineHeight: '1.6', color: '#fff' }}>"{msg.content}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
