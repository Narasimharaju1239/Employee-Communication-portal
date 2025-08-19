
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setPreview(res.data.imageUrl || null);
      } catch {
        setMessage('Failed to load profile');
      }
    };
    fetchProfile();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append('image', image);
    try {
      await axios.post('/api/auth/upload-image', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Image uploaded successfully!');
    } catch {
      setMessage('Failed to upload image');
    }
  };

  if (!user) return <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#7f8c8d'
  }}>Loading profile...</div>;

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#333'
    }}>
      <h2 style={{
        margin: '0 0 30px 0',
        fontSize: '28px',
        fontWeight: '600',
        color: '#2c3e50',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px'
      }}>Profile Settings</h2>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            border: '2px solid #e0e0e0'
          }}>
            {preview ? (
              <img 
                src={preview} 
                alt="Profile" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <span style={{
                fontSize: '60px',
                color: '#bdc3c7'
              }}>👤</span>
            )}
          </div>
          
          <div style={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center'
          }}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              id="profile-upload"
              style={{ display: 'none' }}
            />
            <label 
              htmlFor="profile-upload"
              style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s',
                ':hover': {
                  backgroundColor: '#2980b9'
                }
              }}
            >
              Choose Image
            </label>
            
            <button 
              onClick={handleUpload}
              disabled={!image}
              style={{
                padding: '10px 20px',
                backgroundColor: image ? '#2ecc71' : '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: image ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                transition: 'background-color 0.3s'
              }}
            >
              Upload
            </button>
          </div>
        </div>
        
        <div style={{
          width: '100%',
          maxWidth: '500px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <span style={{
              fontWeight: '500',
              color: '#7f8c8d'
            }}>Name:</span>
            <span>{user.name}</span>
            
            <span style={{
              fontWeight: '500',
              color: '#7f8c8d'
            }}>Email:</span>
            <span>{user.email}</span>
            
            <span style={{
              fontWeight: '500',
              color: '#7f8c8d'
            }}>Role:</span>
            <span style={{
              textTransform: 'capitalize'
            }}>{user.role}</span>
            
            <span style={{
              fontWeight: '500',
              color: '#7f8c8d'
            }}>Phone:</span>
            <span>{user.phone || <span style={{ color: '#95a5a6' }}>Not set</span>}</span>
          </div>
        </div>
        
        {message && (
          <div style={{
            padding: '10px 15px',
            backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da',
            color: message.includes('success') ? '#155724' : '#721c24',
            borderRadius: '4px',
            fontSize: '14px',
            marginTop: '10px'
          }}>
            {message}
          </div>
        )}
      </div>
      {/* Change Password Section Removed - now only on dedicated page */}
    </div>
  );
};

export default ProfilePage;