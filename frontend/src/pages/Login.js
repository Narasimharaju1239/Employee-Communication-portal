import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role); // Make sure this is 'SuperAdmin', 'Admin', or 'Employee'
      localStorage.setItem('userId', user._id);

      // Redirect based on role
      if (user.role === 'SuperAdmin') navigate('/super-admin');
      else if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Employee') navigate('/employee');
      else navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
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
        }}>Login</h2>
        <form onSubmit={handleLogin}>
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
              paddingRight: '70px', // Match password box
              boxSizing: 'border-box'
            }}
          />
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
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Login
          </button>
        </form>
        <div style={{
          textAlign: 'center',
          marginTop: '18px',
          color: '#333',
          fontSize: '15px'
        }}>
          Don't have an account?
          <span
            style={{
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
              marginLeft: '4px',
              fontWeight: 500
            }}
            onClick={() => navigate('/signup')}
          >
            Sign up
          </span>
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: '10px',
          color: '#007bff',
          fontSize: '15px',
          cursor: 'pointer',
          textDecoration: 'underline',
          fontWeight: 500
        }}
          onClick={() => navigate('/forgot-password')}
        >
          Forgot Password?
        </div>
      </div>
    </div>
  );
};

export default Login;
