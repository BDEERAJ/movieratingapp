import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './MoviePage.css';
const API_BASE_URL = 'http://localhost:3000/';

export default function App() {
  let location = useLocation();
  

  const [movie, setMovie] = useState(null);
  
  // Persistence & Data state
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  // Form state
  const [reviewText, setReviewText] = useState("");
  const [userRating, setUserRating] = useState(5);

  // 1. Initial Data Setup
  useEffect(() => {
    // Uses location state if passed, otherwise loads the dummy Inception movie for preview
    const initialMovie = location?.state || {
      _id: "699acb05c41c42d8388ceb09",
      title: "Inception",
      imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
      year: 2010,
      duration: "2h 28m",
      genre: "Sci-Fi",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O. The journey through the subconscious layers reveals deep personal trauma and a high-stakes heist that challenges reality itself.",
      cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
      trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
      averageRating: 8.8,
      numReviews: 1250
    };
    
    setMovie(initialMovie);

    const savedWatchlist = localStorage.getItem('moviflex_watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, [location?.state]);

  // 2. Fetch Reviews from Backend
  useEffect(() => {
    if (!movie || !movie._id) return;

    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      setApiError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}api/movies/${movie._id}/reviews`,{
          method: 'GET',
          headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        });
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setApiError("Could not load reviews from server.");
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [movie]);

  // 3. Add to / Remove from Watchlist API
  const toggleWatchlist = async () => {
    if (!movie) return;

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId') || 'demo'; 
    const isAdded = watchlist.some(m => m._id === movie._id);

    if (!token) {
      alert("Please log in to manage your watchlist.");
      return;
    }

    if (!isAdded) {
      // POST API Call to add to watchlist
      try {
        const response = await fetch(`${API_BASE_URL}apiW/users/${userId}/watchlist`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ movieId: movie._id })
        });

        if (!response.ok) {
           const errData = await response.json();
           throw new Error(errData.message || 'Failed to add to watchlist');
        }

        const updatedWatchlist = [...watchlist, movie];
        setWatchlist(updatedWatchlist);
        localStorage.setItem('moviflex_watchlist', JSON.stringify(updatedWatchlist));
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    } else {
      // DELETE API Call to remove from watchlist
      try {
        const response = await fetch(`${API_BASE_URL}apiW/users/${userId}/watchlist/${movie._id}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        });

        if (!response.ok) throw new Error('Failed to remove from watchlist');

        const updatedWatchlist = watchlist.filter(m => m._id !== movie._id);
        setWatchlist(updatedWatchlist);
        localStorage.setItem('moviflex_watchlist', JSON.stringify(updatedWatchlist));
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    }
  };

  // 4. Submit Review to Backend
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    const token = localStorage.getItem('token');
    
    if (!token) {
       alert("Please log in to submit a review.");
       return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}api/movies/${movie._id}/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          rating: userRating,
          comment: reviewText
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to submit review');
      }

      const savedReview = await response.json();
      
      setReviews([savedReview, ...reviews]);
      
      // Clear form
      setReviewText("");
      setUserRating(5);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (!movie) return <div className="p-5 text-center text-white bg-black min-vh-100">Loading Movie Details...</div>;

  const isInWatchlist = watchlist.some(m => m._id === movie._id);

  return (
    <div className="mdp-root">
      
      <div className="mdp-container">
        <div className="mdp-back-nav" onClick={() => window.history.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          BACK TO GALLERY
        </div>

        <div className="row g-5">
          <div className="col-md-4">
            <div className="mdp-sticky-side">
              <img src={movie.imageUrl} className="mdp-movie-poster" alt={movie.title} />
              
              <button 
                onClick={toggleWatchlist}
                className={`mdp-watchlist-btn ${isInWatchlist ? 'mdp-btn-remove' : 'mdp-btn-add'}`}
              >
                {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
            </div>
          </div>

          <div className="col-md-8">
            <div className="mdp-movie-header">
              <h1>{movie.title}</h1>
              <div className="mdp-meta-info">
                <span className="mdp-rating-badge">★ {movie.averageRating || movie.rating || 0}</span>
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.duration}</span>
                <span>•</span>
                <span>{movie.genre}</span>
              </div>
            </div>

            <div className="mb-5">
              <span className="mdp-section-title">The Synopsis</span>
              <p className="lead opacity-75 fw-normal" style={{ lineHeight: '1.8' }}>{movie.description}</p>
            </div>

            <div className="mb-5">
              <span className="mdp-section-title">Starring</span>
              <div>
                {movie.cast && movie.cast.map(actor => (
                  <span key={actor} className="mdp-cast-pill">{actor}</span>
                ))}
              </div>
            </div>

            <div className="mdp-trailer-box">
              <iframe src={movie.trailerUrl} title="Trailer" frameBorder="0" allowFullScreen></iframe>
            </div>

            <div id="reviews">
              <span className="mdp-section-title">User Reviews</span>
              
              <div className="mdp-review-box">
                <h5 className="mb-3">Share your thoughts</h5>
                {apiError && <p className="text-danger">{apiError}</p>}
                <div className="d-flex mb-3">
                  {[1,2,3,4,5].map(star => (
                    <button 
                      key={star} 
                      type="button"
                      className={`mdp-star-button ${userRating >= star ? 'active' : ''}`}
                      onClick={() => setUserRating(star)}
                    >
                      {star}★
                    </button>
                  ))}
                </div>
                <form onSubmit={handleReviewSubmit}>
                  <textarea 
                    className="mdp-review-text" 
                    rows="3" 
                    placeholder="Tell the community what you loved..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <button type="submit" className="btn btn-warning fw-bold px-4 py-2">Post Review</button>
                </form>
              </div>

              <div className="reviews-list">
                {isLoadingReviews ? (
                  <p className="text-muted">Loading reviews...</p>
                ) : reviews.length > 0 ? (
                  reviews.map((r, index) => (
                    <div key={r._id || index} className="mdp-review-item">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="fw-bold text-warning">{r.userName || r.user || "Reviewer"}</span>
                        <span className="small text-secondary">{r.rating}/5 ★</span>
                      </div>
                      <p className="mb-0 opacity-75">{r.comment || r.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No reviews found for this movie. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}