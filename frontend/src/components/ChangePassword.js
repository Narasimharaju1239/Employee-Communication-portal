import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to change your password.');
      return;
    }
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/change-password',
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message || 'Password changed successfully');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage('Session expired or unauthorized. Please log in again.');
      } else {
        setMessage(error.response?.data?.message || 'Something went wrong');
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #e0e7ff 0%, #f7fafd 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
    }}>
      <form
        onSubmit={handleChangePassword}
        style={{
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 6px 32px 0 rgba(25, 118, 210, 0.10)',
          padding: '44px 36px 36px 36px',
          maxWidth: '420px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
          border: '1.5px solid #e3e7ee',
        }}
      >
        <h2 style={{
          textAlign: 'center',
          color: '#1976d2',
          fontWeight: 900,
          marginBottom: '10px',
          fontSize: '2rem',
          letterSpacing: '1px',
          textShadow: '0 2px 8px #e3e7ee'
        }}>
          Change Password
        </h2>
        <div style={{ position: 'relative', marginBottom: '-8px' }}>
          <input
            type={showOld ? 'text' : 'password'}
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            style={{
              padding: '14px',
              borderRadius: '10px',
              border: '1.5px solid #dbeafe',
              fontSize: '17px',
              background: '#f4f8fb',
              boxShadow: '0 1px 4px #e3e7ee',
              width: '100%',
              outline: 'none',
              fontWeight: 500
            }}
          />
          <button
            type="button"
            onClick={() => setShowOld(v => !v)}
            style={{
              position: 'absolute',
              right: 12,
              top: 13,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 15,
              color: '#1976d2',
              fontWeight: 700
            }}
            tabIndex={-1}
            aria-label={showOld ? 'Hide old password' : 'Show old password'}
          >
            {showOld ? 'Hide' : 'Show'}
          </button>
        </div>
        <div style={{ position: 'relative', marginBottom: '-8px' }}>
          <input
            type={showNew ? 'text' : 'password'}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{
              padding: '14px',
              borderRadius: '10px',
              border: '1.5px solid #dbeafe',
              fontSize: '17px',
              background: '#f4f8fb',
              boxShadow: '0 1px 4px #e3e7ee',
              width: '100%',
              outline: 'none',
              fontWeight: 500
            }}
          />
          <button
            type="button"
            onClick={() => setShowNew(v => !v)}
            style={{
              position: 'absolute',
              right: 12,
              top: 13,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 15,
              color: '#1976d2',
              fontWeight: 700
            }}
            tabIndex={-1}
            aria-label={showNew ? 'Hide new password' : 'Show new password'}
          >
            {showNew ? 'Hide' : 'Show'}
          </button>
        </div>
        <button
          type="submit"
          style={{
            padding: '14px 0',
            background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '18px',
            marginTop: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(25,118,210,0.10)',
            letterSpacing: '0.5px',
            transition: 'background 0.2s'
          }}
        >
          Change Password
        </button>
        {message && (
          <p style={{
            color: message.toLowerCase().includes('success') ? '#43a047' : '#e53935',
            textAlign: 'center',
            marginTop: '8px',
            fontWeight: 700,
            fontSize: '1.08rem',
            minHeight: '24px',
            letterSpacing: '0.2px'
          }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ChangePassword;
