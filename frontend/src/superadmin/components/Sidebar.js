import React from 'react';
import { NavLink } from 'react-router-dom';

const superAdminLinks = [
  { path: '/super-admin', label: 'Dashboard', icon: <span role="img" aria-label="dashboard">🏠</span> },
  { path: '/super-admin/manage-roles', label: 'Manage Roles', icon: <span role="img" aria-label="roles">🧑‍🤝‍🧑</span> },
  { path: '/super-admin/book-room', label: 'Book Room', icon: <span role="img" aria-label="book room">🗓️</span> },
  { path: '/super-admin/all-announcements', label: 'All Announcements', icon: <span role="img" aria-label="announcements">📣</span> },
  { path: '/super-admin/all-bookings', label: 'All Bookings', icon: <span role="img" aria-label="bookings">📑</span> },
  { path: '/super-admin/all-issues', label: 'All Issues', icon: <span role="img" aria-label="issues">🛠️</span> },
  { path: '/super-admin/manage-rooms', label: 'Manage Rooms', icon: <span role="img" aria-label="rooms">🏢</span> },
  { path: '/super-admin/calendar', label: 'Calendar', icon: <span role="img" aria-label="calendar">📅</span> },
  { path: '/super-admin/create-poll', label: 'Create Poll', icon: <span role="img" aria-label="poll">🗳️</span> },
  { path: '/super-admin/tasks', label: 'Task Manager', icon: <span role="img" aria-label="tasks">✅</span> },
  { path: '/super-admin/profile', label: 'Profile', icon: <span role="img" aria-label="profile">👤</span> },
  { path: '/super-admin/change-password', label: 'Change Password', icon: <span role="img" aria-label="change password">🔑</span> },
];

const Sidebar = () => {
  return (
    <aside
      style={{
        width: '240px',
        background: '#111',
        height: 'calc(100vh - 72px)',
        color: '#fff',
        padding: 0,
        position: 'fixed',
        top: '72px',
        left: 0,
        boxShadow: '2px 0 12px rgba(0,0,0,0.13)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1100
      }}
    >
      <div style={{
        height: '56px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: '18px',
        background: '#111',
        borderBottom: '1px solid #222'
      }}>
        <span style={{
          fontSize: '1.45rem',
          color: '#00bfff',
          fontWeight: 900,
          letterSpacing: '1.5px',
          marginTop: '2px'
        }}>
          Super Admin
        </span>
      </div>
      {/* Scrollable menu */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE 10+,
        }}
      >
        <style>
          {`
            /* Hide scrollbar for Chrome, Safari and Opera */
            div[style*="overflow-y: auto"]::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        <ul style={{ listStyle: 'none', padding: '24px 0 0 0', margin: 0 }}>
          {superAdminLinks.map(({ path, label, icon }) => (
            <li key={path} style={{ marginBottom: '10px' }}>
              <NavLink
                to={path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  color: isActive ? '#00bfff' : '#e3e9f7',
                  textDecoration: 'none',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '1.13rem',
                  padding: '12px 28px',
                  borderRadius: '8px 0 0 8px',
                  background: isActive ? 'rgba(0,191,255,0.13)' : 'none',
                  boxShadow: isActive ? '0 2px 12px rgba(0,191,255,0.08)' : 'none',
                  transition: 'background 0.18s, color 0.18s, box-shadow 0.18s'
                })}
              >
                <span style={{ marginRight: '14px', fontSize: '1.3em' }}>{icon}</span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      {/* Copyright always at bottom */}
      <div style={{
        padding: '18px 0 10px 0',
        textAlign: 'center',
        fontSize: '0.93rem',
        color: '#bbdefb',
        borderTop: '1px solid #222'
      }}>
        &copy; {new Date().getFullYear()} INCOR
      </div>
    </aside>
  );
};

export default Sidebar;