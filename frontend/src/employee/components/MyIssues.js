import React, { useEffect, useState } from 'react';

const MyIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
    fetchIssues();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: 'auto' }}>
      <h2>My Issues</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {issues.map(issue => (
          <li key={issue._id} style={{ marginBottom: 16, border: '1px solid #ccc', padding: 12 }}>
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
    </div>
  );
};

export default MyIssues;
