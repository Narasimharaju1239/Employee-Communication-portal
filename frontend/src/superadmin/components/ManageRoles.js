import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const contentContainerStyle = {
  padding: '40px 24px',
  maxWidth: '1100px',
  margin: '40px auto',
  background: '#f7f8fa',
  minHeight: '100vh',
  boxSizing: 'border-box'
};

const tableContainerStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 2px 16px rgba(30,64,175,0.08)',
  padding: '0',
  marginTop: '32px',
  minHeight: 'unset',
  boxSizing: 'border-box',
  border: '1px solid #e3e7ee',
  overflowX: 'auto'
};

const cellHeader = {
  border: '1px solid #e3e7ee',
  padding: '16px',
  textAlign: 'center',
  fontSize: '1.08rem',
  fontWeight: 700,
  color: '#1a237e',
  background: '#f5f5f5'
};

const cell = {
  border: '1px solid #e3e7ee',
  padding: '14px',
  textAlign: 'center',
  fontSize: '1rem',
  background: '#fff'
};


const ManageRoles = () => {
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const token = localStorage.getItem('token');
  const currentUserEmail = localStorage.getItem('userEmail');
  const currentUserId = localStorage.getItem('userId');

  // Calculate counts for each tab
  const superAdminCount = users.filter(u => String(u.role).toLowerCase() === 'superadmin').length;
  const adminCount = users.filter(u => String(u.role).toLowerCase() === 'admin').length;
  const employeeCount = users.filter(u => String(u.role).toLowerCase() === 'employee').length;
  const newUserCount = users.filter(u => String(u.status).toLowerCase() === 'pending').length;
  const allUsersCount = users.length;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
  const res = await axios.get(`${process.env.REACT_APP_API_URL || 'https://employee-communication-portal.onrender.com'}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
        const defaults = {};
        res.data.forEach((user) => {
          defaults[user._id] = user.role;
        });
        setSelectedRoles(defaults);
      } catch (err) {
        toast.error('❌ Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleAssignClick = async (id) => {
    const newRole = selectedRoles[id];
    try {
      await axios.put(
  `${process.env.REACT_APP_API_URL || 'https://employee-communication-portal.onrender.com'}/api/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
      toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      toast.error('❌ Failed to update role');
    }
  };

  const handleFilter = (role) => {
    setFilter(role);
  };

  // Show only users with status 'pending' for new users filter
  const filteredUsers = filter === 'All'
    ? users
    : filter === 'NewUser'
      ? users.filter(u => String(u.status).toLowerCase() === 'pending')
      : users.filter(u => String(u.role).toLowerCase() === filter.toLowerCase());

  return (
    <div style={contentContainerStyle}>
      <ToastContainer position="top-right" autoClose={2000} />

      <h2
        style={{
          marginBottom: '28px',
          textAlign: 'left',
          color: '#1976d2',
          fontWeight: 800,
          letterSpacing: '1px',
          fontSize: '2.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <span role="img" aria-label="lock">🔐</span> Manage User Roles
      </h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
        <button
          style={{
            padding: '8px 18px',
            background: filter === 'SuperAdmin' ? '#1976d2' : '#e3e7ee',
            color: filter === 'SuperAdmin' ? '#fff' : '#1a237e',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: filter === 'SuperAdmin' ? '0 2px 8px rgba(25,118,210,0.07)' : 'none',
            transition: 'background 0.2s'
          }}
          onClick={() => handleFilter('SuperAdmin')}
        >SuperAdmin ({superAdminCount})</button>
        <button
          style={{
            padding: '8px 18px',
            background: filter === 'Admin' ? '#1976d2' : '#e3e7ee',
            color: filter === 'Admin' ? '#fff' : '#1a237e',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: filter === 'Admin' ? '0 2px 8px rgba(25,118,210,0.07)' : 'none',
            transition: 'background 0.2s'
          }}
          onClick={() => handleFilter('Admin')}
        >Admin ({adminCount})</button>
        <button
          style={{
            padding: '8px 18px',
            background: filter === 'Employee' ? '#1976d2' : '#e3e7ee',
            color: filter === 'Employee' ? '#fff' : '#1a237e',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: filter === 'Employee' ? '0 2px 8px rgba(25,118,210,0.07)' : 'none',
            transition: 'background 0.2s'
          }}
          onClick={() => handleFilter('Employee')}
        >Employee ({employeeCount})</button>
        <button
          style={{
            padding: '8px 18px',
            background: filter === 'NewUser' ? '#1976d2' : '#e3e7ee',
            color: filter === 'NewUser' ? '#fff' : '#1a237e',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: filter === 'NewUser' ? '0 2px 8px rgba(25,118,210,0.07)' : 'none',
            transition: 'background 0.2s'
          }}
          onClick={() => handleFilter('NewUser')}
        >New Users ({newUserCount})</button>
        <button
          style={{
            padding: '8px 18px',
            background: filter === 'All' ? '#1976d2' : '#e3e7ee',
            color: filter === 'All' ? '#fff' : '#1a237e',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: filter === 'All' ? '0 2px 8px rgba(25,118,210,0.07)' : 'none',
            transition: 'background 0.2s'
          }}
          onClick={() => handleFilter('All')}
        >All Users ({allUsersCount})</button>
      </div>

      <div style={tableContainerStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e3e7ee' }}>
          <thead>
            <tr>
              <th style={cellHeader}>Email</th>
              <th style={cellHeader}>Role</th>
              <th style={cellHeader}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} style={cell}>Loading users...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={3} style={cell}>No users found.</td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isSelfById = currentUserId && user._id && user._id === currentUserId;
                const isSelfByEmail =
                  !isSelfById && currentUserEmail && user.email &&
                  user.email.toLowerCase().trim() === currentUserEmail.toLowerCase().trim();
                const isSelf = isSelfById || isSelfByEmail;
                const isSelfSuperAdmin = isSelf && String(user.role).toLowerCase() === 'superadmin';
                const isNewUser = String(user.role).toLowerCase() === 'newuser';
                return (
                  <tr key={user._id}>
                    <td style={cell}>{user.email}</td>
                    <td style={cell}>
                      <select
                        value={(() => {
                          // Always use capitalized role values for backend compatibility
                          const val = selectedRoles[user._id] || user.role || 'Employee';
                          if (isNewUser && (val.toLowerCase() === 'newuser')) return 'Employee';
                          if (val.toLowerCase() === 'employee') return 'Employee';
                          if (val.toLowerCase() === 'admin') return 'Admin';
                          if (val.toLowerCase() === 'superadmin') return 'SuperAdmin';
                          return 'Employee';
                        })()}
                        onChange={(e) =>
                          setSelectedRoles({ ...selectedRoles, [user._id]: e.target.value })
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '6px',
                          border: '1px solid #bfc9d1',
                          fontSize: '1rem',
                          background: isSelfSuperAdmin ? '#e0e0e0' : '#f7f8fa',
                          color: '#1a237e',
                          fontWeight: 500
                        }}
                        disabled={isSelfSuperAdmin}
                      >
                        <option value="Employee">Employee</option>
                        <option value="Admin">Admin</option>
                        <option value="SuperAdmin">SuperAdmin</option>
                      </select>
                    </td>
                    <td style={cell}>
                      <button
                        onClick={() => handleAssignClick(user._id)}
                        style={{
                          padding: '10px 28px',
                          background: isSelfSuperAdmin ? '#bdbdbd' : 'linear-gradient(90deg, #1976d2 60%, #0d47a1 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '7px',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          cursor: isSelfSuperAdmin ? 'not-allowed' : 'pointer',
                          boxShadow: '0 2px 8px rgba(25,118,210,0.07)',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={e => {
                          if (!isSelfSuperAdmin) e.target.style.background = '#0d47a1';
                        }}
                        onMouseOut={e => {
                          if (!isSelfSuperAdmin) e.target.style.background = 'linear-gradient(90deg, #1976d2 60%, #0d47a1 100%)';
                        }}
                        disabled={isSelfSuperAdmin}
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRoles;
