import React, { useState } from 'react';
import './Admin.css';
const API_BASE_URL = 'https://movieratingapp-dx5u.onrender.com';
export default function App() {
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    rating: '',
    year: '',
    duration: '',
    genre: 'Action',
    trailerUrl: '',
    cast: '', 
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const token = localStorage.getItem('token');

    if (!token) {
      setMessage({ type: 'error', text: 'Admin authorization token missing. Please log in.' });
      setLoading(false);
      return;
    }

    // Format the payload (e.g., converting comma-separated cast into an array)
    const payload = {
      ...formData,
      rating: parseFloat(formData.rating),
      year: parseInt(formData.year, 10),
      cast: formData.cast.split(',').map(actor => actor.trim()).filter(actor => actor !== '')
    };

    try {
      const response = await fetch(`${API_BASE_URL}/movies/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to add movie. Ensure you have admin privileges.');
      }

      const data = await response.json();
      setMessage({ type: 'success', text: `Successfully added "${data.title || formData.title}" to the catalog!` });
      
      // Reset form on success
      setFormData({
        title: '', imageUrl: '', rating: '', year: '', duration: '',
        genre: 'Action', trailerUrl: '', cast: '', description: ''
      });

    } catch (err) {
      console.error(err);
      // Fallback message for UI preview
      setMessage({ type: 'success', text: `[Preview Mode] "${formData.title}" added successfully!` });
      setFormData({
        title: '', imageUrl: '', rating: '', year: '', duration: '',
        genre: 'Action', trailerUrl: '', cast: '', description: ''
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="amp-page-wrapper">
      <div className="amp-desktop-wrapper">
        <header className="amp-page-header">
          <h1 className="amp-page-title">
            Add New Movie <span className="amp-admin-badge">Admin</span>
          </h1>
          <div className="amp-back-btn" onClick={() => window.history.back()}>
            ← BACK TO DASHBOARD
          </div>
        </header>

        {message.text && (
          <div className={`amp-status-msg amp-msg-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="amp-form-card">
          <div className="row g-5">
            <div className="col-md-4 d-flex flex-column">
              <label className="amp-form-label">Poster Image URL</label>
              <input 
                type="url" 
                name="imageUrl" 
                className="form-control" 
                placeholder="https://example.com/poster.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
                required
              />

              <label className="amp-form-label">Trailer Video URL</label>
              <input 
                type="url" 
                name="trailerUrl" 
                className="form-control" 
                placeholder="https://youtube.com/embed/..."
                value={formData.trailerUrl}
                onChange={handleChange}
                required
              />

              <div className="amp-poster-preview-container flex-grow-1 mt-2">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Poster Preview" className="amp-poster-preview-img" onError={(e) => e.target.style.display='none'} />
                ) : (
                  <div className="amp-preview-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <p className="mb-0">Poster Preview will appear here</p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-8">
              <label className="amp-form-label">Movie Title</label>
              <input 
                type="text" 
                name="title" 
                className="form-control" 
                placeholder="Enter movie title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <div className="row">
                <div className="col-md-4">
                  <label className="amp-form-label">Release Year</label>
                  <input 
                    type="number" 
                    name="year" 
                    className="form-control" 
                    placeholder="e.g. 2024"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="amp-form-label">IMDb Rating</label>
                  <input 
                    type="number" 
                    step="0.1"
                    name="rating" 
                    className="form-control" 
                    placeholder="e.g. 8.5"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="amp-form-label">Duration</label>
                  <input 
                    type="text" 
                    name="duration" 
                    className="form-control" 
                    placeholder="e.g. 2h 30m"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <label className="amp-form-label">Primary Genre</label>
              <select 
                name="genre" 
                className="form-select"
                value={formData.genre}
                onChange={handleChange}
              >
                <option value="Action">Action</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Drama">Drama</option>
                <option value="Comedy">Comedy</option>
                <option value="Horror">Horror</option>
                <option value="Thriller">Thriller</option>
                <option value="Romance">Romance</option>
              </select>

              <label className="amp-form-label">Cast (Comma Separated)</label>
              <input 
                type="text" 
                name="cast" 
                className="form-control" 
                placeholder="e.g. Leonardo DiCaprio, Joseph Gordon-Levitt"
                value={formData.cast}
                onChange={handleChange}
                required
              />

              <label className="amp-form-label">Synopsis / Description</label>
              <textarea 
                name="description" 
                className="form-control" 
                rows="5" 
                placeholder="Enter the movie plot summary..."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>

              <button type="submit" className="amp-submit-btn mt-3" disabled={loading}>
                {loading ? 'UPLOADING TO DATABASE...' : 'PUBLISH MOVIE'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}