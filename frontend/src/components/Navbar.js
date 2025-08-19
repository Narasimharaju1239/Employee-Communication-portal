import React from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // Show logout only on dashboard pages and change-password
  const showLogout =
    location.pathname.startsWith('/super-admin') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/employee') ||
    location.pathname === '/change-password';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <nav style={{
      width: '100%',
      background: 'linear-gradient(90deg,rgb(0, 0, 0) 60%,rgb(0, 0, 0) 100%)',
      color: '#fff',
      padding: '0 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '72px', // Increased navbar height
      boxShadow: '0 2px 12px rgba(25, 118, 210, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      letterSpacing: '0.5px',
      minWidth: 0,
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <span style={{
          fontSize: '1.4rem', // Increased font size
          fontWeight: 700,
          letterSpacing: '1px',
          textShadow: '0 2px 8px rgba(0,0,0,0.08)',
          whiteSpace: 'nowrap'
        }}>
          INCOR GROUP
        </span>
      </div>
      {showLogout && (
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <button
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(90deg, #e74c3c 60%, #c0392b 100%)',
              border: 'none',
              color: '#fff',
              padding: '8px 18px', // Slightly larger button
              borderRadius: '14px',
              fontWeight: 600,
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(231,76,60,0.10)',
              transition: 'background 0.18s',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#c0392b'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #e74c3c 60%, #c0392b 100%)'}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
