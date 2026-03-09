import express from 'express';
import { User, Movie, Review, Watchlist } from '../DataBase/Schema.js';
import { protect } from '../AUTH/middleWare.js';
const router = express.Router();

// @desc Update user profile
router.put('/users/:id', protect, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = req.body.username || req.body.name || user.username;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
// @desc Get user profile with reviews
router.get('/users/:id',protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
   
    const reviews = await Review.find({ userId: req.params.id })
      .populate('movieId', 'title imageUrl')
      .sort({ createdAt: -1 });
      console.log(reviews);
      
    res.json({ ...user.toObject(), reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc Delete a review by the user
router.delete('/reviews/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Check if the review belongs to the logged-in user
    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized: Cannot delete this review' });
    }

    const movieId = review.movieId;

    // Delete the review
    await Review.findByIdAndDelete(req.params.id);

    // Update the movie's rating and review count
    const remainingReviews = await Review.find({ movieId });
    const numReviews = remainingReviews.length;
    const averageRating = numReviews > 0 
      ? Number((remainingReviews.reduce((acc, item) => item.rating + acc, 0) / numReviews).toFixed(1))
      : 0;

    await Movie.findByIdAndUpdate(movieId, {
      numReviews,
      averageRating
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;

