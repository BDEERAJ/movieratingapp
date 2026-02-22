import React, { useState } from 'react';
import './Auth.css';
const API_BASE_URL = 'http://localhost:3000';


export default function App() {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Input Change Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle between Login and Sign Up
  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setMessage({ type: '', text: '' });
  };

  // Auth Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    console.log(formData);
    
    const endpoint = mode === 'login' ? '/login' : '/signup';
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // On Success: Store Token
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('Role', data.role);
        // If your API returns userId, store it too
        if (data.userId) localStorage.setItem('userId', data.userId);
        
        setMessage({ type: 'success', text: `Success! Redirecting to ${mode === 'login' ? 'home' : 'login'}...` });
        
        setTimeout(() => {
          if (mode === 'signup') {
            setMode('login');
          } else {
             window.location.href = '/Home'; // Or use your router navigation
          }
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      // Fallback message for demo/local testing
      setMessage({ type: 'error', text: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <span className="brand-logo">MOVIFLEX</span>
        
        <h2 className="auth-title">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="auth-subtitle">
          {mode === 'login' 
            ? 'Sign in to access your watchlist' 
            : 'Join our community of movie lovers'}
        </p>

        {message.text && (
          <div className={`status-msg msg-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                name="username"
                className="input-field" 
                placeholder="Enter your username" 
                value={formData.username}
                onChange={handleChange}
                required={mode === 'signup'}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              name="email"
              className="input-field" 
              placeholder="name@example.com" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password"
              className="input-field" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Processing...' : (mode === 'login' ? 'SIGN IN' : 'GET STARTED')}
          </button>
        </form>

        <p className="toggle-text">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          <span className="toggle-link" onClick={toggleMode}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
}