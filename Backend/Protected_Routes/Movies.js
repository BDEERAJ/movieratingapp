import express from 'express';
import { User, Movie, Review, Watchlist } from '../DataBase/Schema.js';
import { protect, admin } from '../AUTH/middleWare.js';
import cors from 'cors';
const router = express.Router();
router.use(cors())
router.get('/request', protect, async (req, res) => {
  try {
    const { Page = 1, limit = 10 } = req.query;


    const skip = (parseInt(Page) - 1) * parseInt(limit);

    const movies = await Movie.find({}).skip(skip).limit(parseInt(limit));
    const total = await Movie.countDocuments({});

    res.json({
      movies
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
router.post('/add', protect, admin, async (req, res) => {
  try {
    const {
      title,
      rating,
      year,
      duration,
      genre,
      trailerUrl,
      description,
      cast,
      imageUrl
    } = req.body;
    console.log(cast);
    const movie = await Movie.insertOne({
      title,
      rating: parseFloat(rating),
      year: parseInt(year),
      duration,
      genre,
      trailerUrl,
      description,
      cast,
      imageUrl
    });
    
    res.status(201).json(movie);

  } catch (error) {
    res.status(400).json({
      message: 'Failed to create movie',
      error: error.message
    });
  }
});
export default router;