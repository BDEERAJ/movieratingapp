About The Project

Moviflex is a dynamic web application that allows users to discover movies, read and post reviews, and manage a personalized watchlist. It features secure user authentication, Role-Based Access Control (RBAC), and an exclusive Admin Dashboard for catalog management.

This project showcases a complete full-stack architecture with a React frontend, a Node.js/Express backend, and a MongoDB database optimized with indexing for rapid data retrieval.

👤 User Features

Secure Authentication: JWT-based signup and login with encrypted passwords (bcrypt).

Discover & Filter: Browse movies, search by title, or filter by genre (Action, Sci-Fi, Drama, etc.) and sort by ratings or release year.

Interactive Reviews: Leave 1-5 star ratings and text reviews on any movie. Ratings are aggregated instantly.

Personal Watchlist: Save movies to your watchlist for later viewing and remove them with a single click.

User Profile: View your account details, update your display name, and track your entire review history.

🛡️ Admin Features

Role-Based Access: Protected routes that only allow authorized admin users.

Add New Movies: A dedicated dashboard to add new movies to the database.

Poster Uploads: Support for direct image URL linking or local file uploads (via Multer).

Auto-Formatting: Automatically structures comma-separated cast lists into database arrays.
