import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  // Remove unused variables
  // const { token } = useParams();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  React.useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setError('');
    setMessage('');
    if (!email) {
      setError('Please enter your email to receive OTP.');
      return;
    }
    setOtpLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message || 'OTP sent to your email.');
      setOtpTimer(30); // Start 30s timer
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!email || !otp) {
      setError('Please enter your email and OTP.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      setMessage(res.data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #f0f4f8 60%, #c9e7fa 100%)',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: 'rgba(255,255,255,0.97)',
        padding: '32px 28px 24px 28px',
        borderRadius: '14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        backdropFilter: 'blur(2px)'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '28px',
          color: '#222',
          fontWeight: 700,
          letterSpacing: '1px'
        }}>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" style={{ fontWeight: 500, color: '#333' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', margin: '12px 0', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '16px', background: '#f8fafc', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <input
              type="text"
              id="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '16px', background: '#f8fafc', boxSizing: 'border-box', marginRight: 8 }}
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpLoading || !email || otpTimer > 0}
              style={{ padding: '10px 16px', background: otpTimer > 0 ? '#b0b8c1' : '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: otpTimer > 0 ? 'not-allowed' : 'pointer', fontSize: 15 }}
            >
              {otpLoading ? 'Sending...' : (otpTimer > 0 ? `Resend OTP (${otpTimer}s)` : (otp ? 'Resend OTP' : 'Send OTP'))}
            </button>
          </div>
          <label htmlFor="newPassword" style={{ fontWeight: 500, color: '#333' }}>New Password:</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showNew ? 'text' : 'password'}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', margin: '12px 0', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '16px', background: '#f8fafc', boxSizing: 'border-box' }}
            />
            <button
              type="button"
              onClick={() => setShowNew(v => !v)}
              style={{ position: 'absolute', right: 10, top: 18, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: '#1976d2', fontWeight: 700 }}
              tabIndex={-1}
              aria-label={showNew ? 'Hide new password' : 'Show new password'}
            >
              {showNew ? 'Hide' : 'Show'}
            </button>
          </div>
          <label htmlFor="confirmPassword" style={{ fontWeight: 500, color: '#333' }}>Confirm Password:</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirm ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', margin: '12px 0', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '16px', background: '#f8fafc', boxSizing: 'border-box' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              style={{ position: 'absolute', right: 10, top: 18, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: '#1976d2', fontWeight: 700 }}
              tabIndex={-1}
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: 'linear-gradient(90deg, #007bff 60%, #0056b3 100%)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '17px', fontWeight: 600, marginTop: '10px', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        {message && <p style={{ color: '#28a745', textAlign: 'center', marginTop: '18px', fontWeight: 500 }}>{message}</p>}
        {error && <p style={{ color: '#d32f2f', textAlign: 'center', marginTop: '18px', fontWeight: 500 }}>{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
