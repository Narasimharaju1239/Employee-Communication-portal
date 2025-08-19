import React from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  { label: 'Announcements', icon: '📢', path: '/employee/announcements' },
  { label: 'Book Room', icon: '🏢', path: '/employee/book-room' },
  { label: 'My Bookings', icon: '📅', path: '/employee/my-bookings' },
  { label: 'Calendar', icon: '🗓️', path: '/employee/calendar' },
  // { label: 'Raise Issue', icon: '🛠️', path: '/employee/raise-issue' },
  // { label: 'My Issues', icon: '🔎', path: '/employee/my-issues' },
  { label: 'Task Manager', icon: '✅', path: '/employee/tasks' },
  { label: 'Feedback', icon: '💬', path: '/employee/feedback' }
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(120deg, #f8fafc 60%, #e3e9f7 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 0'
    }}>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1a237e', marginBottom: '38px' }}>
        Employee Dashboard
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '32px',
        width: '100%',
        maxWidth: '900px',
        padding: '0 16px',
        boxSizing: 'border-box'
      }}>
        {features.map((f) => (
          <div
            key={f.label}
            onClick={() => navigate(f.path)}
            style={{
              background: '#fff',
              borderRadius: '14px',
              boxShadow: '0 4px 24px rgba(30,64,175,0.07)',
              padding: '38px 0 28px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#1a237e',
              border: '1px solid #e3e9ee',
              minWidth: 0
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(25,118,210,0.13)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(30,64,175,0.07)';
            }}
          >
            <span style={{ fontSize: '2.6rem', marginBottom: '18px' }}>{f.icon}</span>
            {f.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;