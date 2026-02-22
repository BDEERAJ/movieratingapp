import React, { useState, useEffect } from 'react';
import './Profile.css';
const API_BASE_URL = 'https://movieratingapp-dx5u.onrender.com';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
     
      if (!token || !userId) {
        setError("User session not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error("Failed to fetch profile data");

        const data = await response.json();
        setUser(data);
        console.log(data);
        
        setNewName(data.username);
      } catch (err) {
        console.error(err);
      
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!newName.trim() || newName === user.name) {
      setIsEditing(false);
      return;
    }

    setUpdateLoading(true);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedUser = await response.json();
      setUser(prev => ({ ...prev, name: updatedUser.name }));
      setIsEditing(false);
    } catch (err) {
      alert("Error updating name. Using local update for preview.");
      setUser(prev => ({ ...prev, name: newName }));
      setIsEditing(false);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <div className="p-5 text-center text-white">Loading your profile...</div>;
  if (error) return <div className="p-5 text-center text-danger">{error}</div>;

  return (
    <div className="profile-page">
      <div className="desktop-wrapper">
        <div className="profile-header">
          <div className="avatar-circle">
            {user.username.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-grow-1">
            <span className="user-id-badge">USER ID: {user.userId}</span>
            
            {isEditing ? (
              <form onSubmit={handleUpdateName} className="d-flex align-items-center gap-3">
                <input 
                  autoFocus
                  className="edit-input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  disabled={updateLoading}
                />
                <button type="submit" className="btn btn-warning fw-bold px-4" disabled={updateLoading}>
                  {updateLoading ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
              </form>
            ) : (
              <div className="d-flex align-items-center gap-4">
                <h1 className="display-name">{user.username}</h1>
                <button className="edit-btn" onClick={() => setIsEditing(true)}>EDIT NAME</button>
              </div>
            )}
            
            <p className="text-secondary mt-2 mb-0">{user.email}</p>
          </div>
        </div>

        <div className="review-history-section">
          <span className="section-label">Your Review History</span>
          
          {user.reviews && user.reviews.length > 0 ? (
            user.reviews.map(review => (
              <div className="review-card" key={review._id}>
                <div className="d-flex justify-content-between align-items-start">
                  <h3 className="review-movie">{review.movieId.title}</h3>
                  <span className="text-secondary small">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="review-meta">
                  <span className="star-rating">★ {review.rating}/5</span>
                  <span>•</span>
                  <span>Verified Review</span>
                </div>
                
                <p className="review-text">"{review.comment}"</p>
              </div>
            ))
          ) : (
            <div className="no-reviews">
              <h4>No reviews yet</h4>
              <p>When you rate and review movies, they will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}