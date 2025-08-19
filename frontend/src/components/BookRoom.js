import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  const timeslots = [
    '09:30', '10:30', '11:30', '12:30', '13:30', '14:30',
    '15:30', '16:30', '17:30', '18:30'
  ];

  const to12Hour = (time) => {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = ((h + 11) % 12 + 1);
    return `${hour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const fetchRooms = useCallback(async () => {
    try {
  const res = await axios.get(`${process.env.REACT_APP_API_URL || 'https://employee-communication-portal.onrender.com'}/api/rooms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(res.data);
      if (res.data.length > 0) setSelectedRoom(res.data[0]._id);
    } catch {
      toast.error('❌ Failed to load rooms');
      setRooms([]);
    }
  }, [token]);

  const fetchBookings = useCallback(async () => {
    try {
  const res = await axios.get(`${process.env.REACT_APP_API_URL || 'https://employee-communication-portal.onrender.com'}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch {
      toast.error('❌ Failed to load bookings');
      setBookings([]);
    }
  }, [token]);

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, [fetchRooms, fetchBookings]);

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !selectedRoom) return timeslots;
    const today = new Date();
    const selected = new Date(selectedDate);

    const bookedSlots = bookings
      .filter(
        (booking) =>
          ((booking.room && booking.room._id === selectedRoom) || booking.room === selectedRoom) &&
          formatDate(new Date(booking.startTime)) === selectedDate
      )
      .map((booking) => {
        const d = new Date(booking.startTime);
        const h = d.getHours().toString().padStart(2, '0');
        const m = d.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
      });

    if (
      today.getFullYear() === selected.getFullYear() &&
      today.getMonth() === selected.getMonth() &&
      today.getDate() === selected.getDate()
    ) {
      const nowMinutes = today.getHours() * 60 + today.getMinutes();
      return timeslots.filter((slot) => {
        const [h, m] = slot.split(':').map(Number);
        const slotMinutes = h * 60 + m;
        return slotMinutes > nowMinutes && !bookedSlots.includes(slot);
      });
    }

    return timeslots.filter((slot) => !bookedSlots.includes(slot));
  };

  const handleBook = async () => {
    if (!selectedRoom || !selectedDate || !selectedTime) {
      toast.error('⚠️ Please select all fields.');
      return;
    }

    const today = new Date();
    const [h, m] = selectedTime.split(':').map(Number);
    const bookingDate = new Date(selectedDate);
    bookingDate.setHours(h, m, 0, 0);

    if (
      today.getFullYear() === bookingDate.getFullYear() &&
      today.getMonth() === bookingDate.getMonth() &&
      today.getDate() === bookingDate.getDate()
    ) {
      if (bookingDate <= today) {
        toast.error('⚠️ Cannot book a slot that has already passed.');
        return;
      }
    }

    setIsLoading(true); // Start loading
    try {
  await axios.post(`${process.env.REACT_APP_API_URL || 'https://employee-communication-portal.onrender.com'}/api/bookings`, {
        room: selectedRoom,
        date: selectedDate,
        time: selectedTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ Room booked successfully!');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Booking failed');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const canCancel = (booking) => {
    if (role === 'SuperAdmin') return true;
    if (role === 'Admin') {
      const bookedByRole = booking.bookedBy?.role;
      const bookedById = booking.bookedBy?._id || booking.bookedBy;
      if (bookedByRole === 'SuperAdmin') return false;
      if (bookedById === userId) return true;
      if (bookedByRole === 'Employee') return true;
      return false;
    }
    if (role === 'Employee' && (booking.bookedBy?._id === userId || booking.bookedBy === userId)) return true;
    return false;
  };

  // Role-based inline styles
  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    color: '#333',
    minHeight: '100vh',
    backgroundImage: "url('/Backgound.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundColor:
      role === 'SuperAdmin' ? '#e3fcec' :
      role === 'Admin' ? '#fffbe6' :
      '#f9f9f9'
  };

  const bookBtnStyle = {
    padding: '12px 20px',
    backgroundColor: isLoading
      ? (role === 'SuperAdmin' ? '#7be2b2' : role === 'Admin' ? '#ffd699' : '#6cb5f5')
      : (role === 'SuperAdmin' ? '#43a047' : role === 'Admin' ? '#ff9800' : '#007bff'),
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s ease'
  };

  // Role-based booking item style
  const bookingItemStyle = {
    backgroundColor:
      role === 'SuperAdmin' ? '#eafff3' :
      role === 'Admin' ? '#fff8e1' :
      '#fff',
    border: '1px solid #eee',
    borderRadius: '6px',
    padding: '15px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  };

  // Role-based cancel button style
  const cancelBtnStyle = {
    padding: '8px 15px',
    backgroundColor:
      role === 'SuperAdmin' ? '#388e3c' :
      role === 'Admin' ? '#f57c00' :
      '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s ease'
  };

  return (
    <div style={containerStyle}>
      <h2 style={{
        fontSize: '24px',
        color: '#0056b3',
        marginBottom: '20px',
        textAlign: 'center'
      }}>📅 Book Room</h2>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor:
          role === 'SuperAdmin' ? '#e3fcec' :
          role === 'Admin' ? '#fffbe6' :
          '#f9f9f9'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="room-select" style={{ marginBottom: '5px', fontWeight: 'bold' }}>Room:</label>
          <select
            id="room-select"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>{room.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="date-select" style={{ marginBottom: '5px', fontWeight: 'bold' }}>Date:</label>
          <input
            id="date-select"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={formatDate(new Date())}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="time-select" style={{ marginBottom: '5px', fontWeight: 'bold' }}>Time Slot:</label>
          <select
            id="time-select"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            <option value="">Select</option>
            {getAvailableTimeSlots().length === 0 ? (
              <option value="" disabled>No available slots</option>
            ) : (
              getAvailableTimeSlots().map((slot, idx) => (
                <option key={idx} value={slot}>{to12Hour(slot)}</option>
              ))
            )}
          </select>
        </div>
        <button
          onClick={handleBook}
          disabled={isLoading}
          style={bookBtnStyle}
        >
          {isLoading ? 'Booking...' : 'Book'}
        </button>
      </div>

      <h3 style={{
        fontSize: '20px',
        color: '#0056b3',
        marginTop: '40px',
        marginBottom: '15px',
        textAlign: 'center'
      }}>Current Bookings</h3>
      <ul style={{
        listStyle: 'none',
        padding: '0',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {bookings
          .filter(
            (booking) =>
              (!selectedRoom || booking.room?._id === selectedRoom) &&
              (!selectedDate ||
                formatDate(new Date(booking.startTime)) === selectedDate)
          )
          .map((booking, index) => (
            <li key={index} style={bookingItemStyle}>
              <span style={{ fontSize: '16px', color: '#555' }}>
                <strong style={{ color: '#0056b3' }}>{booking.room?.name || 'Room'}</strong> - {new Date(booking.startTime).toLocaleString()} - <em style={{ color: '#777' }}>{booking.bookedBy?.email || 'Unknown'}</em>
              </span>
              {canCancel(booking) && (
                <button
                  onClick={async () => {
                    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
                    try {
                      await axios.delete(`${process.env.REACT_APP_API_URL || 'https://employee-communication-portal.onrender.com'}/api/bookings/${booking._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      toast.error('🗑️ Booking cancelled');
                      fetchBookings();
                    } catch (err) {
                      toast.error(err.response?.data?.message || '❌ Failed to cancel booking');
                    }
                  }}
                  style={cancelBtnStyle}
                >
                  Cancel
                </button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default BookRoom;