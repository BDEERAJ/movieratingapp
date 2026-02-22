import express from 'express';
import { User, Movie, Review, Watchlist } from '../DataBase/Schema.js';
import { protect } from '../AUTH/middleWare.js';
const router = express.Router();
// @desc    Retrieve reviews for a specific movie
router.get('/movies/:id/reviews',protect,async (req, res) => {
  console.log(`Fetching reviews for movie ID: ${req.params.id}`);
    try {
    const reviews = await Review.find({ movieId: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
// @desc    Submit a new review for a movie
router.post('/movies/:id/reviews', protect, async (req, res) => {
  try {        
    const { rating, comment } = req.body;    
    const movieId = req.params.id;
    const userId = req.user.userId;
   
    const alreadyReviewed = await Review.findOne({ movieId, userId });
    if (alreadyReviewed) return res.status(400).json({ message: 'You have already reviewed this movie' });

    const user = await User.findById(userId);

    const review = await Review.create({
      movieId,
      userId,
      userName: user.username,
      rating: Number(rating),
      comment
    });

    // Update the Movie's aggregate rating & count
    const allReviews = await Review.find({ movieId });
    const numReviews = allReviews.length;
    const averageRating = allReviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

    await Movie.findByIdAndUpdate(movieId, {
      numReviews,
      averageRating: Number(averageRating.toFixed(1))
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
export default router;