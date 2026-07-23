import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

function Doubts() {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const res = await API.get('/doubts');
        setDoubts(res.data);
      } catch (err) {
        console.error('Error fetching doubts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoubts();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading doubts...</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '20px' }}>
      <h2>All Doubts</h2>
      {doubts.length === 0 ? (
        <p>No doubts posted yet.</p>
      ) : (
        doubts.map((doubt) => (
          <div
            key={doubt._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px'
            }}
          >
            <h3>
              <Link to={`/doubts/${doubt._id}`} style={{ textDecoration: 'none', color: '#1f2937' }}>
                {doubt.title}
              </Link>
            </h3>
            <p style={{ color: '#555' }}>{doubt.description.slice(0, 100)}...</p>
            <div style={{ fontSize: '14px', color: '#888' }}>
              Subject: {doubt.subject} | Posted by: {doubt.postedBy?.name} | Answers: {doubt.answersCount}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Doubts;