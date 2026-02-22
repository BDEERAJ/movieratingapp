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

export default router;

