import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('Computer Science 101');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  
  // New Student State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRoll, setNewRoll] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students');
      setStudents(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      await axios.post('/api/attendance', {
        studentId,
        date: attendanceDate,
        status,
        subject
      });
      fetchStudents(); // Refresh data
    } catch (err) {
      console.error('Failed to mark attendance:', err);
      alert('Error marking attendance');
    }
  };

  const triggerCronJobs = async () => {
    try {
      await axios.get('/api/system/trigger-cron');
      alert('AI Jobs Executed Successfully! Emails / Logs generated.');
      fetchStudents();
    } catch (err) {
      alert('Error running AI Jobs');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      if (!newName || !newEmail || !newRoll) return alert('Please fill in all fields');
      await axios.post('/api/students', { name: newName, email: newEmail, rollNumber: newRoll });
      setNewName(''); setNewEmail(''); setNewRoll('');
      setIsAdding(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error adding student');
    }
  };

  if (loading) return <h2 className="title-gradient">Loading Students...</h2>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 className="title-gradient">Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage student attendance and trigger AI notifications.</p>
        </div>
        <button className="btn" onClick={triggerCronJobs}>⚙️ Execute AI Cron Jobs</button>
      </div>

      <div className="card-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card glass-panel">
          <span className="stat-label">Total Students</span>
          <span className="stat-value">{students.length}</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-label">At Risk (&lt;70%)</span>
          <span className="stat-value" style={{ color: 'var(--danger-color)' }}>
            {students.filter(s => s.overallAttendancePercentage < 70).length}
          </span>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-label">Perfect Streaks (&ge; 1)</span>
          <span className="stat-value" style={{ color: 'var(--success-color)' }}>
            {students.filter(s => s.currentStreak > 0).length}
          </span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="stat-label">Subject</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="stat-label">Date</label>
              <input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} />
            </div>
          </div>
          <button className="btn" onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? 'Cancel' : '+ Add New Student'}
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <input type="text" placeholder="Full Name" value={newName} onChange={e => setNewName(e.target.value)} style={{ flex: 1 }} />
            <input type="email" placeholder="Email Address" value={newEmail} onChange={e => setNewEmail(e.target.value)} style={{ flex: 1 }} />
            <input type="text" placeholder="Roll Number" value={newRoll} onChange={e => setNewRoll(e.target.value)} style={{ width: '150px' }} />
            <button type="submit" className="btn" style={{ background: 'var(--success-color)' }}>Save Student</button>
          </form>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Student info</th>
                <th>Roll Number</th>
                <th>Overall Attendance</th>
                <th>Streak</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{student.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {student.email} • ID: {student.id}
                    </div>
                  </td>
                  <td>{student.rollNumber}</td>
                  <td>
                    <span className={`badge ${student.overallAttendancePercentage >= 70 ? 'badge-success' : 'badge-danger'}`}>
                      {student.overallAttendancePercentage}%
                    </span>
                  </td>
                  <td>{student.currentStreak} 🔥</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn" style={{ padding: '0.4rem 0.8rem', display: 'flex', gap: '0.3rem', alignItems: 'center' }} onClick={() => markAttendance(student.id, 'Present')}>
                        <CheckCircle size={14} /> Present
                      </button>
                      <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', display: 'flex', gap: '0.3rem', alignItems: 'center' }} onClick={() => markAttendance(student.id, 'Absent')}>
                        <XCircle size={14} /> Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No students found. Click "+ Add New Student" above to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
