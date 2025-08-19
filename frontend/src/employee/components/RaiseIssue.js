import React, { useState, useEffect } from 'react';

const RaiseIssue = ({ onIssueRaised }) => {
  const [issues, setIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(true);
  // Fetch user's own issues
  const fetchIssues = async () => {
    setLoadingIssues(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/issues/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch issues');
      const data = await res.json();
      setIssues(data);
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoadingIssues(false);
    }
  };

  useEffect(() => { fetchIssues(); }, []);
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
      fetchIssues();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
        <h2>Raise an Issue</h2>
        <div>
          <label>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required />
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
      <div style={{ marginTop: 40 }}>
        <h3>My Raised Issues</h3>
        {loadingIssues ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {issues.map(issue => (
              <li key={issue._id} style={{ marginBottom: 16, border: '1px solid #ccc', padding: 12, borderRadius: 8 }}>
                <strong>{issue.title}</strong> <span style={{ color: '#888' }}>[{issue.status}]</span>
                <div>{issue.description}</div>
                <div>Priority: {issue.priority}</div>
                <div>Created: {new Date(issue.createdAt).toLocaleString()}</div>
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
        )}
      </div>
    </div>
  );
};

export default RaiseIssue;
