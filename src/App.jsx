import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import { Activity, Users, Settings } from 'lucide-react';

function App() {
  const location = useLocation();

  return (
    <>
      <nav className="nav-bar glass-panel animate-fade-in" style={{ margin: '1rem', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Activity color="var(--accent-color)" size={28} />
          <h2 className="title-gradient" style={{ margin: 0 }}>AttendAI</h2>
        </div>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} /> Admin Console
            </div>
          </Link>
          <Link to="/student/1" className={location.pathname.startsWith('/student') ? 'active' : ''}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={18} /> Student Portal
            </div>
          </Link>
        </div>
      </nav>

      <div className="container animate-fade-in">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/student/:id" element={<StudentDashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
