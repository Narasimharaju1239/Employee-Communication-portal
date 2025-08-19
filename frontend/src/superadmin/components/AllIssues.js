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
    <form onSubmit={handleSubmit} style={{
      maxWidth: 500,
      margin: '32px auto',
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 8 }}>Raise an Issue</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontWeight: 500 }}>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required style={{ padding: 8, borderRadius: 6, border: '1px solid #bbb' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontWeight: 500 }}>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{ padding: 8, borderRadius: 6, border: '1px solid #bbb', minHeight: 60 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontWeight: 500 }}>Priority</label>
        <select value={priority} onChange={e => setPriority(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #bbb' }}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <button type="submit" disabled={loading} style={{
        background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: 16, marginTop: 8, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
      }}>{loading ? 'Submitting...' : 'Submit'}</button>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      {success && <div style={{ color: 'green', textAlign: 'center' }}>{success}</div>}
    </form>
  );
};

const AllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdate, setStatusUpdate] = useState({});
  const [comment, setComment] = useState({});
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
    <div style={{ maxWidth: 1000, margin: 'auto', padding: '24px 0' }}>
      <RaiseIssue onIssueRaised={fetchIssues} />
      <h2 style={{ textAlign: 'center', color: '#1976d2', margin: '24px 0 32px 0', fontWeight: 700 }}>All Issues (SuperAdmin View)</h2>
      {loading && <div style={{ textAlign: 'center', color: '#1976d2' }}>Loading...</div>}
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        {issues.map(issue => (
          <div key={issue._id} style={{
            width: 340,
            background: '#fafbfc',
            borderRadius: 12,
            boxShadow: '0 2px 12px rgba(25, 118, 210, 0.08)',
            border: '1px solid #e3e9f7',
            padding: 20,
            marginBottom: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <strong style={{ fontSize: 18 }}>{issue.title}</strong>
              <span style={{ color: '#fff', background: issue.status === 'Resolved' ? '#43a047' : issue.status === 'In Progress' ? '#ffa000' : '#bdbdbd', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }}>{issue.status}</span>
            </div>
            <div style={{ color: '#333', fontSize: 15 }}>{issue.description}</div>
            <div style={{ fontSize: 14, color: '#1976d2' }}>Priority: <b>{issue.priority}</b></div>
            <div style={{ fontSize: 13, color: '#888' }}>Created: {new Date(issue.createdAt).toLocaleString()}</div>
            <div style={{ fontSize: 13, color: '#888' }}>Raised By: {issue.raisedBy?.name || 'Unknown'} ({issue.raisedBy?.role || 'Unknown'})</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
              <select value={statusUpdate[issue._id] || issue.status} onChange={e => handleStatusChange(issue._id, e.target.value)} style={{ padding: 6, borderRadius: 6, border: '1px solid #bbb' }}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <button onClick={() => updateStatus(issue._id)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer' }}>Update</button>
              <button style={{ color: '#fff', background: '#e53935', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, marginLeft: 4, cursor: 'pointer' }} onClick={() => deleteIssue(issue._id)}>Delete</button>
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                placeholder="Add comment"
                value={comment[issue._id] || ''}
                onChange={e => handleCommentChange(issue._id, e.target.value)}
                style={{ flex: 1, padding: 6, borderRadius: 6, border: '1px solid #bbb' }}
              />
              <button onClick={() => addComment(issue._id)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer' }}>Add</button>
            </div>
            {issue.comments && issue.comments.length > 0 && (
              <div style={{ marginTop: 8, background: '#f5f7fa', borderRadius: 6, padding: 8 }}>
                <b>Comments:</b>
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  {issue.comments.map((c, i) => (
                    <li key={i} style={{ fontSize: 13, color: '#333', marginBottom: 2 }}>{c.text} <span style={{ color: '#888' }}>by {c.createdBy?.name || 'Unknown'}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllIssues;
