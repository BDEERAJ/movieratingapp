import mongoose from './Db.js';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });


const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String },
  year: { type: Number },
  duration: { type: String },
  genre: { type: String },
  description: { type: String },
  cast: [{ type: String }],
  trailerUrl: { type: String },
  averageRating: { type: Number, default: 0 }, 
  numReviews: { type: Number, default: 0 }     
}, { timestamps: true });


const reviewSchema = new mongoose.Schema({
  // Reference the Movie
  movieId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'movies', 
    required: true 
  },
  // Reference the User
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userName: { type: String, required: true }, 
  
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

reviewSchema.index({ movieId: 1 });
reviewSchema.index({ userId: 1 });

reviewSchema.index({ movieId: 1, userId: 1 }, { unique: true });

const watchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'movies', required: true }
}, { timestamps: true });

watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

// Create Models
const User = mongoose.model('User', userSchema);
const Movie = mongoose.model('movies', movieSchema);
const Review = mongoose.model('Review', reviewSchema);
const Watchlist = mongoose.model('Watchlist', watchlistSchema);

export { User, Movie, Review, Watchlist };