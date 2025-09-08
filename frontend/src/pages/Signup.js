// client/src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'https://employee-communication-portal.onrender.com'}/api/auth/send-signup-otp`, {
        name,
        email
      });
      setOtpSent(true);
      setMessage('OTP sent to your email. Please enter it below.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send OTP.');
    }
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'https://employee-communication-portal.onrender.com'}/api/auth/verify-signup-otp`, {
        email,
        otp
      });
      setOtpVerified(true);
      setMessage('OTP verified! Please set your password to complete signup.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'OTP verification failed.');
    }
    setLoading(false);
  };

  // Step 3: Final Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'https://employee-communication-portal.onrender.com'}/api/auth/signup`, {
        name,
        email,
        password
      });
      if (res.status === 201) {
        setMessage('Signup successful. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Signup failed.';
      setMessage(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
      }}
    >
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
        }}>Signup</h2>
        {message && (
          <p style={{
            color: message.includes('successful') ? 'green' : 'red',
            textAlign: 'center',
            fontWeight: 500,
            marginBottom: '18px'
          }}>
            {message}
          </p>
        )}
        {/* Step 1: Send OTP */}
        {!otpSent && (
          <form onSubmit={handleSendOtp}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                margin: '12px 0',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '16px',
                background: '#f8fafc',
                transition: 'border 0.2s',
                paddingRight: '70px',
                boxSizing: 'border-box'
              }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                margin: '12px 0',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '16px',
                background: '#f8fafc',
                transition: 'border 0.2s',
                paddingRight: '70px',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(90deg, #007bff 60%, #0056b3 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '17px',
                fontWeight: 600,
                marginTop: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}
        {/* Step 2: Verify OTP */}
        {otpSent && !otpVerified && (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              required
              onChange={(e) => setOtp(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                margin: '12px 0',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '16px',
                background: '#f8fafc',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(90deg, #007bff 60%, #0056b3 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '17px',
                fontWeight: 600,
                marginTop: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {loading ? 'Verifying OTP...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSendOtp}
              style={{
                width: '100%',
                padding: '10px',
                background: '#f8fafc',
                color: '#007bff',
                border: '1px solid #007bff',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: 500,
                marginTop: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              Resend OTP
            </button>
          </form>
        )}
        {/* Step 3: Final Signup */}
        {otpVerified && (
          <form onSubmit={handleSignup}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  margin: '12px 0',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  background: '#f8fafc',
                  paddingRight: '70px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: '18px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#007bff',
                  cursor: 'pointer',
                  fontSize: '15px',
                  padding: 0,
                  height: '100%',
                  zIndex: 2
                }}
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(90deg, #007bff 60%, #0056b3 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '17px',
                fontWeight: 600,
                marginTop: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {loading ? 'Signing up...' : 'Signup'}
            </button>
          </form>
        )}
        <div style={{
          textAlign: 'center',
          marginTop: '18px',
          color: '#333',
          fontSize: '15px'
        }}>
          Already have an account?
          <span
            style={{
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
              marginLeft: '4px',
              fontWeight: 500
            }}
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
