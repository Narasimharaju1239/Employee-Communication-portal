import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthConfig } from "../../utils/auth";
import { getCurrentUser } from "../../utils/currentUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskManager = ({ role }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", assigneeEmail: "", dueDate: "" });
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          role === "employee" ? "/api/tasks/mytasks" : "/api/tasks/",
          getAuthConfig()
        );
        setTasks(res.data);
      } catch (err) {
        toast.error("❌ Failed to fetch tasks");
      }
      setLoading(false);
    };
    fetchTasks();
  }, [role]);

  useEffect(() => {
    if (role === "employee") return;
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users", getAuthConfig());
        setUsers(res.data);
      } catch (err) {
        toast.error("❌ Failed to load users");
        setUsers([]);
      }
    };
    fetchUsers();
  }, [role]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAssign = async e => {
    e.preventDefault();
    setAssigning(true);
    const config = getAuthConfig();
    if (!config.headers || !config.headers.Authorization) {
      toast.error("⚠️ You are not authenticated. Please log in again.");
      setAssigning(false);
      return;
    }
    try {
      await axios.post("/api/tasks/assign", form, config);
      toast.success("✅ Task assigned!");
      setForm({ title: "", description: "", assigneeEmail: "", dueDate: "" });
      // Refresh tasks
      const res = await axios.get("/api/tasks/", getAuthConfig());
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("❌ Unauthorized. Please log in again.");
      } else {
        toast.error(err.response?.data?.message || "❌ Failed to assign task");
      }
    } finally {
      setAssigning(false);
    }
  };

  const handleCancel = async (taskId) => {
    if (!window.confirm('Are you sure you want to cancel this task?')) return;
    try {
      await axios.delete(`/api/tasks/cancel/${taskId}`, getAuthConfig());
      toast.error("🗑️ Task cancelled");
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to cancel task");
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#333'
    }}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <main>
        <h2 style={{
          margin: '0 0 25px 0',
          fontSize: '28px',
          fontWeight: '600',
          color: '#2c3e50',
          borderBottom: '1px solid #eee',
          paddingBottom: '15px'
        }}>
          Task Manager
        </h2>

        {role !== "employee" && (
          <form onSubmit={handleAssign} style={{
            marginBottom: '40px',
            paddingBottom: '20px',
            borderBottom: '1px solid #eee'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              fontSize: '20px',
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              Assign New Task
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Task Title"
                required
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border 0.3s'
                }}
              />
              
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border 0.3s'
                }}
              />
              
              <select
                name="assigneeEmail"
                value={form.assigneeEmail}
                onChange={handleChange}
                required
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border 0.3s',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select User</option>
                {users.filter(u => {
                  if (role === "superadmin") return u.role.toLowerCase() !== "superadmin";
                  if (role === "admin") return u.role.toLowerCase() === "employee";
                  return false;
                }).map(u => (
                  <option key={u._id} value={u.email}>
                    {u.name} ({u.email}) - {u.role}
                  </option>
                ))}
              </select>
              
              <input
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                required
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border 0.3s'
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={assigning}
              style={{
                padding: '10px 20px',
                backgroundColor: assigning ? '#95a5a6' : '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'background-color 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {assigning ? (
                <>
                  <span>⏳</span> Assigning...
                </>
              ) : 'Assign Task'}
            </button>
          </form>
        )}

        <h3 style={{
          margin: '0 0 15px 0',
          fontSize: '20px',
          fontWeight: '500',
          color: '#2c3e50'
        }}>
          {role === "employee" ? "My Tasks" : "All Tasks"}
        </h3>

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px',
            color: '#7f8c8d'
          }}>
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div style={{
            color: '#95a5a6',
            fontStyle: 'italic',
            padding: '20px 0',
            textAlign: 'center'
          }}>
            No tasks found.
          </div>
        ) : (
          <div style={{
            overflowX: 'auto',
            width: '100%'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  borderBottom: '1px solid #eee'
                }}>
                  <th style={{
                    padding: '12px 15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>Name</th>
                  <th style={{
                    padding: '12px 15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>Email</th>
                  <th style={{
                    padding: '12px 15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>Task</th>
                  <th style={{
                    padding: '12px 15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>Description</th>
                  <th style={{
                    padding: '12px 15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>Deadline</th>
                  <th style={{
                    padding: '12px 15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>Status</th>
                  <th style={{
                    padding: '12px 15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>Assigned By</th>
                  {role !== "employee" && <th style={{
                    padding: '12px 15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => {
                  let canCancel = false;
                  if (role === "superadmin") {
                    const assignedByRole = task.assignedBy?.role?.toLowerCase();
                    if (assignedByRole === "admin" || assignedByRole === "superadmin") {
                      canCancel = true;
                    }
                  } else if (role === "admin") {
                    if (currentUser && task.assignedBy?._id === currentUser.userId) {
                      canCancel = true;
                    }
                  }
                  return (
                    <tr key={task._id} style={{
                      borderBottom: '1px solid #f5f5f5',
                      ':hover': {
                        backgroundColor: '#f9f9f9'
                      }
                    }}>
                      <td style={{ padding: '12px 15px' }}>{task.assignedTo?.name}</td>
                      <td style={{ padding: '12px 15px' }}>{task.assignedTo?.email}</td>
                      <td style={{ padding: '12px 15px' }}>{task.title}</td>
                      <td style={{ padding: '12px 15px' }}>{task.description}</td>
                      <td style={{ padding: '12px 15px' }}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                      </td>
                      <td style={{ padding: '12px 15px' }}>{task.status}</td>
                      <td style={{ padding: '12px 15px' }}>
                        {task.assignedBy?.name} ({task.assignedBy?.email})
                      </td>
                      {canCancel && (
                        <td style={{ padding: '12px 15px' }}>
                          <button
                            onClick={() => handleCancel(task._id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#e74c3c',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              transition: 'background-color 0.3s',
                              ':hover': {
                                backgroundColor: '#c0392b'
                              }
                            }}
                          >
                            Cancel
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskManager;