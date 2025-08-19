import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';

const SuperAdminCalendar = () => {
  const [value, setValue] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
  const res = await axios.get(`${process.env.REACT_APP_API_URL || 'https://employee-communication-portal.onrender.com'}/api/calendar/all`);
      setEvents(res.data);
    } catch {
      toast.error('❌ Error loading calendar events');
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const createdBy = localStorage.getItem('userId');
    try {
      if (editingId) {
  await axios.put(`${process.env.REACT_APP_API_URL || 'https://employee-communication-portal.onrender.com'}/api/calendar/update/${editingId}`, {
          title,
          description: desc,
          date: value,
        });
        toast.success('✅ Event updated!');
      } else {
  await axios.post(`${process.env.REACT_APP_API_URL || 'https://employee-communication-portal.onrender.com'}/api/calendar/create`, {
          title,
          description: desc,
          date: value,
          createdBy,
        });
        toast.success('✅ Event added!');
      }
      setTitle('');
      setDesc('');
      setEditingId(null);
      fetchEvents();
    } catch {
      toast.error('❌ Failed to save event');
    }
  };

  const handleEdit = (event) => {
    setTitle(event.title);
    setDesc(event.description);
    setValue(new Date(event.date));
    setEditingId(event._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
  await axios.delete(`${process.env.REACT_APP_API_URL || 'https://employee-communication-portal.onrender.com'}/api/calendar/delete/${id}`);
      toast.error('🗑️ Event deleted');
      fetchEvents();
    } catch {
      toast.error('❌ Failed to delete event');
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toDateString();

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#333'
    }}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <header style={{
        marginBottom: '30px',
        borderBottom: '1px solid #eee',
        paddingBottom: '20px'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '28px',
          fontWeight: '600',
          color: '#2c3e50'
        }}>
          <span role="img" aria-label="calendar" style={{ marginRight: '10px' }}>🗓️</span> 
          Super Admin Calendar
        </h2>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        marginBottom: '40px'
      }}>
        <div>
          <Calendar 
            value={value} 
            onChange={setValue} 
            style={{
              width: '100%',
              border: 'none',
              borderRadius: '8px'
            }}
          />
        </div>
        
        <form onSubmit={handleCreateOrUpdate} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <h3 style={{
            margin: '0 0 15px 0',
            fontSize: '20px',
            fontWeight: '500',
            color: '#2c3e50'
          }}>
            {editingId ? 'Edit Event' : 'Add Event'} on {value.toDateString()}
          </h3>
          
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            required
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border 0.3s',
              width: '100%'
            }}
          />
          
          <input
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Description"
            required
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border 0.3s',
              width: '100%'
            }}
          />
          
          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '10px'
          }}>
            <button 
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: editingId ? '#3498db' : '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'background-color 0.3s',
                flex: 1
              }}
            >
              {editingId ? 'Update' : 'Add'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTitle('');
                  setDesc('');
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'background-color 0.3s',
                  flex: 1
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <section>
        <h3 style={{
          margin: '0 0 15px 0',
          fontSize: '20px',
          fontWeight: '500',
          color: '#2c3e50'
        }}>
          Events on {value.toDateString()}:
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {events.filter(e => formatDate(e.date) === value.toDateString()).length === 0 ? (
            <p style={{ 
              color: '#95a5a6',
              fontStyle: 'italic',
              margin: 0
            }}>
              No events scheduled for this day.
            </p>
          ) : (
            events
              .filter(e => formatDate(e.date) === value.toDateString())
              .map((e) => (
                <div key={e._id} style={{
                  padding: '15px 0',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong style={{
                      display: 'block',
                      fontSize: '18px',
                      marginBottom: '5px',
                      color: '#2c3e50'
                    }}>{e.title}</strong>
                    <p style={{
                      margin: '0 0 8px 0',
                      color: '#7f8c8d'
                    }}>{e.description}</p>
                    <small style={{
                      color: '#bdc3c7',
                      fontSize: '13px'
                    }}>
                      Created on: {new Date(e.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <button 
                      onClick={() => handleEdit(e)}
                      style={{
                        padding: '8px 15px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background-color 0.3s'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(e._id)}
                      style={{
                        padding: '8px 15px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background-color 0.3s'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </section>
    </div>
  );
};

export default SuperAdminCalendar;