import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: ""
  });

  // Fetch employees and tasks
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const [usersRes, tasksRes] = await Promise.all([
          axios.get("/api/users", config),
          axios.get("/api/tasks?assignedBy=me", config)
        ]);
        setUsers(usersRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error("User/task fetch error:", err);
        toast.error("Failed to load data");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Handle form changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Assign a new task
  const handleAssign = async e => {
    e.preventDefault();
    setAssigning(true);
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const selectedUser = users.find(u => u._id === form.assignedTo);
      const payload = {
        ...form,
        assigneeEmail: selectedUser ? selectedUser.email : ""
      };
      const res = await axios.post("/api/tasks/assign", payload, config);
      setTasks([res.data, ...tasks]);
      setForm({ title: "", description: "", assignedTo: "", dueDate: "" });
      toast.success("Task assigned successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign task");
    }
    setAssigning(false);
  };

  // Cancel a task
  const handleCancel = async id => {
    if (!window.confirm("Are you sure you want to cancel this task?")) return;
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`/api/tasks/${id}`, config);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success("Task cancelled successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel task");
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#333'
    }}>
      <div style={{ 
        marginBottom: '2.5rem', 
        textAlign: 'center' 
      }}>
        <h2 style={{ 
          color: '#2c3e50',
          fontSize: '2rem',
          marginBottom: '0.5rem'
        }}>Task Management</h2>
        <p style={{ 
          color: '#7f8c8d',
          fontSize: '1.1rem'
        }}>Assign and manage tasks for your team members</p>
      </div>

      <div style={{ 
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <h3 style={{ 
          color: '#2c3e50',
          marginBottom: '1.5rem'
        }}>Assign New Task</h3>
        <form onSubmit={handleAssign} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ 
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#2c3e50'
            }}>Task Title</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="Enter task title" 
              required 
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ 
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#2c3e50'
            }}>Description</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Enter task description" 
              required 
              rows="3"
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ 
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column' }}>
              <label style={{ 
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#2c3e50'
              }}>Assign To</label>
              <select 
                name="assignedTo" 
                value={form.assignedTo} 
                onChange={handleChange} 
                required
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: '#fff'
                }}
              >
                <option value="">Select Team Member</option>
                {loading ? (
                  <option disabled>Loading users...</option>
                ) : (
                  (() => {
                    const filtered = users.filter(u => u.role === 'Employee' || u.role === 'Admin');
                    if (filtered.length === 0) {
                      return <option disabled>No team members available</option>;
                    }
                    return filtered.map(u => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email}) - {u.role}
                      </option>
                    ));
                  })()
                )}
              </select>
            </div>

            <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column' }}>
              <label style={{ 
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#2c3e50'
              }}>Due Date</label>
              <input 
                name="dueDate" 
                type="date" 
                value={form.dueDate} 
                onChange={handleChange} 
                required 
                min={new Date().toISOString().split('T')[0]}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={assigning}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              alignSelf: 'flex-start',
              opacity: assigning ? '0.7' : '1'
            }}
            onMouseOver={e => !assigning && (e.target.style.backgroundColor = '#2980b9')}
            onMouseOut={e => !assigning && (e.target.style.backgroundColor = '#3498db')}
          >
            {assigning ? "Assigning..." : "Assign Task"}
          </button>
        </form>
      </div>

      <div>
        <h3 style={{ 
          color: '#2c3e50',
          marginBottom: '1.5rem'
        }}>Assigned Tasks</h3>
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        ) : tasks.length === 0 ? (
          <div style={{ 
            textAlign: 'center',
            padding: '2rem',
            color: '#7f8c8d',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px'
          }}>
            No tasks have been assigned yet.
          </div>
        ) : (
          <div style={{ 
            overflowX: 'auto',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
          }}>
            <table style={{ 
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#fff'
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: '#f8f9fa',
                  borderBottom: '2px solid #eee'
                }}>
                  <th style={{ 
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>Team Member</th>
                  <th style={{ 
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>Task</th>
                  <th style={{ 
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>Description</th>
                  <th style={{ 
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>Deadline</th>
                  <th style={{ 
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>Status</th>
                  <th style={{ 
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => {
                  const isEmployee = task.assignedTo?.role === 'Employee';
                  const isAdminTask = task.assignedTo?.role === 'Admin';
                  const rowKey = task._id || `${task.title}-${task.dueDate}`;
                  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';
                  
                  return (
                    <tr 
                      key={rowKey} 
                      style={{ 
                        borderBottom: '1px solid #eee',
                        backgroundColor: task.status === 'Completed' ? '#f8f9fa' : '#fff',
                        opacity: task.status === 'Completed' ? '0.8' : '1'
                      }}
                    >
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div style={{ fontWeight: '500' }}>{task.assignedTo?.name}</div>
                          <div style={{ 
                            fontSize: '0.85rem',
                            color: '#7f8c8d'
                          }}>{task.assignedTo?.email}</div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>{task.title}</td>
                      <td style={{ 
                        padding: '1rem',
                        maxWidth: '300px',
                        wordBreak: 'break-word'
                      }}>{task.description}</td>
                      <td style={{ padding: '1rem' }}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                        {isOverdue && (
                          <span style={{
                            display: 'inline-block',
                            marginLeft: '0.5rem',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            fontSize: '0.75rem',
                            borderRadius: '4px'
                          }}>Overdue</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          backgroundColor: 
                            task.status === 'Completed' ? '#2ecc71' :
                            task.status === 'In Progress' ? '#f39c12' : '#3498db',
                          color: 'white'
                        }}>
                          {task.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {(isEmployee || isAdminTask) && task.status !== 'Completed' && (
                          <button 
                            onClick={() => handleCancel(task._id)} 
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#e74c3c',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseOver={e => e.target.style.backgroundColor = '#c0392b'}
                            onMouseOut={e => e.target.style.backgroundColor = '#e74c3c'}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTasksPage;