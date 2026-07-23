import { useState, useEffect } from 'react';
import API from '../api/axios';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await API.get('/notes');
      setNotes(res.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('file', file);

    setUploading(true);
    try {
      await API.post('/notes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTitle('');
      setSubject('');
      setFile(null);
      fetchNotes();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '20px' }}>
      <h2>Upload a Note</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleUpload} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
          style={{ display: 'block', marginBottom: '10px' }}
        />
        <button type="submit" disabled={uploading} style={{ padding: '8px 16px' }}>
          {uploading ? 'Uploading...' : 'Upload Note'}
        </button>
      </form>

      <h2>All Notes</h2>
      {notes.length === 0 ? (
        <p>No notes uploaded yet.</p>
      ) : (
        notes.map((note) => (
          <div
            key={note._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px'
            }}
          >
            <h3>{note.title}</h3>
            <p style={{ color: '#555' }}>Subject: {note.subject}</p>
            <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">
              View File
            </a>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '5px' }}>
              Uploaded by: {note.uploadedBy?.name}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Notes;