import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const pageStyle = {
    backgroundImage: 'url("/background.jpg")', // ✅ Place your image in `public/background.jpg`
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  };

  const boxStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: 'white',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center',
    width: '90%',
    maxWidth: '600px'
  };

  const buttonContainer = {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    textDecoration: 'none'
  };

  const loginStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    color: 'white'
  };

  const signupStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  return (
    <div style={pageStyle}>
      <div style={boxStyle}>
        <h2>Welcome to InCor Group Employee Portal</h2>
        <p>
          This portal is designed to streamline communication and resource
          management within InCor Group. Please login or signup to access the features.
        </p>
        <div style={buttonContainer}>
          <Link to="/login" style={loginStyle}>Login</Link>
          <Link to="/signup" style={signupStyle}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
