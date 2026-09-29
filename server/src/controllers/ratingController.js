import { Rating } from '../models/Rating.js';

// GET /api/ratings
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 });
    res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/:id
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
}

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const rating = await Rating.create(req.body);
    res.status(201).json({ rating });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/summary?movieCode=MV101
export async function getRatingSummary(req, res, next) {
  try {
    const { movieCode } = req.query;

    if (!movieCode) {
      return res.status(400).json({ message: 'movieCode is required' });
    }

    const summaryResult = await Rating.aggregate([
      { $match: { movieCode } },
      {
        $group: {
          _id: '$movieCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        }
      }
    ]);

    if (summaryResult.length === 0) {
      return res.status(200).json({
        movieCode,
        averageRating: 0,
        ratingCount: 0
      });
    }

    const { averageRating, ratingCount } = summaryResult[0];
    res.status(200).json({
      movieCode,
      averageRating,
      ratingCount
    });
  } catch (err) {
    next(err);
  }
}