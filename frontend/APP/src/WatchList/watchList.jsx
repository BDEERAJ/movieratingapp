import React, { useState, useEffect } from 'react';
import './watchList.css';
const API_BASE_URL = 'https://movieratingapp-dx5u.onrender.com';
import { useNavigate } from 'react-router-dom';


export default function App() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Navigate = useNavigate();
  // 1. Initial Fetch on Mount
  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Required by your endpoint structure

    if (!token || !userId) {
      setError("User session not found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/apiW/users/${userId}/watchlist`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error("Failed to fetch watchlist");
      const data = await response.json();
      setWatchlist(data);
    } catch (err) {
      console.error(err);

    } finally {
      setLoading(false);
    }
  };


  if (loading) return <div className="p-5 text-center text-white">Loading your collection...</div>;

  return (
    <div className="watchlist-page">

      <div className="desktop-wrapper">
        <header className="page-header">
          <h1 className="page-title">My Watchlist</h1>
          <div className="back-gallery-btn" onClick={() => window.history.back()}>
            ← BROWSE MORE MOVIES
          </div>
        </header>

        {error && <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger">{error}</div>}

        {watchlist.length > 0 ? (
          <div className="row g-4">
            {watchlist.map((movie) => (
              <div className="col-3" key={movie._id}>
                <div className="movie-card" onClick={() => Navigate(`/movie`,{state:movie})}>
                  <div className="card-image-wrapper">
                    <img src={movie.imageUrl} className="card-img" alt={movie.title} />
                  </div>
                  
                  <div className="card-content">
                    <h3 className="movie-title" title={movie.title}>{movie.title}</h3>
                    
                    <div className="movie-meta">
                      <span className="rating-chip">★ {movie.rating}</span>
                      <span>{movie.year}</span>
                      <span>{movie.genre}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Your watchlist is empty</h3>
            <p>Movies you add will appear here for easy access.</p>
          </div>
        )}
      </div>
    </div>
  );
}