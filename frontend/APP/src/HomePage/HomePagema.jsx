import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = 'http://localhost:3000';

export default function App() {
  const Navigate=useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [sortOption, setSortOption] = useState("default");
  
  // Pagination and API state
  const [fetchedMovies, setFetchedMovies] = useState([]); 
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const Navigator=(movie)=>{
    Navigate(`/movie`,{state:movie}); // Example navigation to a movie detail page
  }
  const Admin=()=>{
    if (localStorage.getItem("Role")==="admin") {
      Navigate(`/admin`);
    }
    else{
      alert("You are not an admin!");
    }
  }
  // Fetch movies when the page number changes
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/movies/request/?Page=${page}&limit=10`,{method
: 'GET',
 headers: { 'Content-Type': 'application/json',
  authorization: `Bearer ${localStorage.getItem('token')}`
  }
        });
        const data = await response.json();
        console.log(data);
        
        if (data && data.movies) {
          // Append new movies to the existing fetched movies
          setFetchedMovies(prev => [...prev, ...data.movies]);
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [page]); // Re-run whenever 'page' state changes

  // Use only the dynamically fetched movies
  let displayedMovies = [...fetchedMovies];

  // Apply Search Filter
  if (searchTerm) {
    displayedMovies = displayedMovies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply Genre Filter
  if (genreFilter) {
    displayedMovies = displayedMovies.filter((movie) => movie.genre === genreFilter);
  }

  // Apply Sorting Logic
  if (sortOption === "rating_desc") {
    displayedMovies.sort((a, b) => (b.averageRating || b.rating || 0) - (a.averageRating || a.rating || 0));
  } else if (sortOption === "year_desc") {
    displayedMovies.sort((a, b) => b.year - a.year);
  } else if (sortOption === "year_asc") {
    displayedMovies.sort((a, b) => a.year - b.year);
  }

  return (
    <>

      <nav className="top-nav">
        <h2 className="nav-logo">MOVIFLEX</h2>
        <div className="nav-actions">
          <button className="btn btn-danger" onClick={()=>{Admin()}}>Admin</button>
          <button className="highlight-btn" onClick={()=>{Navigate('/watchlist')}}>Highlights</button>
          <div className="profile-btn " onClick={()=>Navigate('/Profile')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
      </nav>

      <div className="desktop-container">
        <h1 className="page-title">Explore Movies</h1>

        <div className="main-layout">
          <div className="sidebar-column">
            <div className="filter-sidebar">
              
              <div className="filter-section">
                <span className="filter-label">Quick Search</span>
                <input 
                  type="text" 
                  className="search-box" 
                  placeholder="Type title..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-section">
                <span className="filter-label">Sort By</span>
                <ul className="filter-list">
                  <li 
                    className={`filter-item ${sortOption === 'default' ? 'active' : ''}`}
                    onClick={() => setSortOption('default')}
                  >
                    Default
                  </li>
                  <li 
                    className={`filter-item ${sortOption === 'rating_desc' ? 'active' : ''}`}
                    onClick={() => setSortOption('rating_desc')}
                  >
                    Top Rated
                  </li>
                  <li 
                    className={`filter-item ${sortOption === 'year_desc' ? 'active' : ''}`}
                    onClick={() => setSortOption('year_desc')}
                  >
                    Newest First
                  </li>
                  <li 
                    className={`filter-item ${sortOption === 'year_asc' ? 'active' : ''}`}
                    onClick={() => setSortOption('year_asc')}
                  >
                    Oldest First
                  </li>
                </ul>
              </div>

              <div className="filter-section">
                <span className="filter-label">Genres</span>
                <ul className="filter-list">
                  <li 
                    className={`filter-item ${genreFilter === '' ? 'active' : ''}`}
                    onClick={() => setGenreFilter('')}
                  >
                    All Movies
                  </li>
                  <li 
                    className={`filter-item ${genreFilter === 'Action' ? 'active' : ''}`}
                    onClick={() => setGenreFilter('Action')}
                  >
                    Action
                  </li>
                  <li 
                    className={`filter-item ${genreFilter === 'Sci-Fi' ? 'active' : ''}`}
                    onClick={() => setGenreFilter('Sci-Fi')}
                  >
                    Sci-Fi
                  </li>
                </ul>
              </div>

            </div>
          </div>

          <div className="movies-column">
            <div className="row g-3">
              {displayedMovies.length > 0 ? (
                displayedMovies.map((movie, idx) => (
                  <div className="col-4" key={movie._id}>
                    <div className="card movie-card" onClick={()=>{Navigator(movie)}}>
                      <img src={movie.imageUrl} className="card-img-top" alt={movie.title} />
                      <div className="card-body">
                        <h5 className="card-title" title={movie.title}>{movie.title}</h5>
                        
                        <div className="rating-row">
                          <span className="star-icon">★</span>
                          <span className="rating-val">{movie.averageRating || movie.rating || 0}</span>
                          {movie.numReviews > 0 && <span className="rating-total">({movie.numReviews})</span>}
                        </div>

                        <div className="meta-info">
                          <span>{movie.year}</span>
                          <span className="genre-tag">{movie.genre}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <p className="text-muted">{isLoading ? "Loading movies..." : "No movies found in this collection."}</p>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {displayedMovies.length > 0 && !searchTerm && !genreFilter && (
              <div className="text-center mt-5 mb-4">
                <button 
                  className="load-more-btn"
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={isLoading}
                >
                  {isLoading ? 'LOADING...' : 'LOAD MORE MOVIES'}
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
}