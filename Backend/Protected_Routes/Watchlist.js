import express from 'express';
import { User, Movie, Review, Watchlist } from '../DataBase/Schema.js';
import { protect } from '../AUTH/middleWare.js';
const router = express.Router();

router.get('/users/:id/watchlist',protect, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const watchlistEntries = await Watchlist.find({ userId: req.params.id })
      .populate('movieId')
      .sort({ createdAt: -1 });

    const movies = watchlistEntries.map(entry => entry.movieId).filter(m => m != null);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Add movie to watchlist
router.post('/users/:id/watchlist', protect,async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { movieId } = req.body;

    const exists = await Watchlist.findOne({ userId: req.params.id, movieId });
    if (exists) return res.status(400).json({ message: 'Movie already in watchlist' });

    await Watchlist.create({ userId: req.params.id, movieId });
    res.status(201).json({ message: 'Added to watchlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Remove movie from watchlist
router.delete('/users/:id/watchlist/:movieId', protect, async (req, res) => {
  try {
    console.log('imhere aloo');
    
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Watchlist.findOneAndDelete({ 
      userId: req.params.id, 
      movieId: req.params.movieId 
    });

    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
export default router;