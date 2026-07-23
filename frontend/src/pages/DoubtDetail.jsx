import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

function DoubtDetail() {
  const { id } = useParams();
  const [doubt, setDoubt] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const doubtRes = await API.get(`/doubts/${id}`);
      setDoubt(doubtRes.data);

      const answersRes = await API.get(`/answers/${id}`);
      setAnswers(answersRes.data);
    } catch (err) {
      console.error('Error fetching doubt details:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post(`/answers/${id}`, { content: newAnswer });
      setNewAnswer('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post answer');
    }
  };

  if (!doubt) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '20px' }}>
      <h2>{doubt.title}</h2>
      <p>{doubt.description}</p>
      <div style={{ fontSize: '14px', color: '#888', marginBottom: '20px' }}>
        Subject: {doubt.subject} | Posted by: {doubt.postedBy?.name}
      </div>

      <h3>Answers ({answers.length})</h3>
      {answers.length === 0 ? (
        <p>No answers yet. Be the first to help!</p>
      ) : (
        answers.map((ans) => (
          <div
            key={ans._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '10px'
            }}
          >
            <p>{ans.content}</p>
            <div style={{ fontSize: '13px', color: '#888' }}>
              — {ans.answeredBy?.name}
            </div>
          </div>
        ))
      )}

      <h3 style={{ marginTop: '30px' }}>Post an Answer</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAnswerSubmit}>
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Write your answer..."
          required
          style={{ width: '100%', minHeight: '80px', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Submit Answer</button>
      </form>
    </div>
  );
}

export default DoubtDetail;