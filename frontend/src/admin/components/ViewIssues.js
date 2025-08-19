import React, { useEffect, useState } from 'react';

const RaiseIssue = ({ onIssueRaised }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/issues/raise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, priority }),
      });
      if (!res.ok) throw new Error('Failed to raise issue');
      setSuccess('Issue raised successfully!');
      setTitle('');
      setDescription('');
      setPriority('Medium');
      if (onIssueRaised) onIssueRaised();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '24px auto 32px auto', border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
      <h3>Raise an Issue</h3>
      <div>
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%' }} />
      </div>
      <div>
        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{ width: '100%' }} />
      </div>
      <div>
        <label>Priority</label>
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </form>
  );
};

const ViewIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdate, setStatusUpdate] = useState({});
  const [comment, setComment] = useState({});

  const fetchIssues = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/issues/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch issues');
      const data = await res.json();
      setIssues(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIssues(); }, []);

  const handleStatusChange = (id, value) => {
    setStatusUpdate({ ...statusUpdate, [id]: value });
  };

  const updateStatus = async (id) => {
    const status = statusUpdate[id];
    if (!status) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/issues/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchIssues();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCommentChange = (id, value) => {
    setComment({ ...comment, [id]: value });
  };

  const addComment = async (id) => {
    const text = comment[id];
    if (!text) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/issues/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      setComment({ ...comment, [id]: '' });
      fetchIssues();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteIssue = async (id) => {
    if (!window.confirm('Delete this issue?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/issues/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete issue');
      fetchIssues();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto' }}>
      <RaiseIssue onIssueRaised={fetchIssues} />
      <h2>All Issues (Admin View)</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {issues.map(issue => (
          <li key={issue._id} style={{ marginBottom: 16, border: '1px solid #ccc', padding: 12 }}>
            <strong>{issue.title}</strong> <span style={{ color: '#888' }}>[{issue.status}]</span>
            <div>{issue.description}</div>
            <div>Priority: {issue.priority}</div>
            <div>Created: {new Date(issue.createdAt).toLocaleString()}</div>
            <div>Raised By: {issue.raisedBy?.name || 'Unknown'}</div>
            <div>
              <select value={statusUpdate[issue._id] || issue.status} onChange={e => handleStatusChange(issue._id, e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <button onClick={() => updateStatus(issue._id)}>Update Status</button>
            </div>
            <div style={{ marginTop: 8 }}>
              <input
                placeholder="Add comment"
                value={comment[issue._id] || ''}
                onChange={e => handleCommentChange(issue._id, e.target.value)}
              />
              <button onClick={() => addComment(issue._id)}>Add Comment</button>
            </div>
            <button style={{ marginTop: 8, color: 'red' }} onClick={() => deleteIssue(issue._id)}>Delete</button>
            {issue.comments && issue.comments.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <b>Comments:</b>
                <ul>
                  {issue.comments.map((c, i) => (
                    <li key={i}>{c.text} <span style={{ color: '#888' }}>by {c.createdBy?.name || 'Unknown'}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewIssues;
