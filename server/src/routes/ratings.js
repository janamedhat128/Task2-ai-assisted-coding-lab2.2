import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// Place the summary route BEFORE the /:id route so it doesn't get captured as an id parameter
router.get('/summary', getRatingSummary);

router.get('/', getAllRatings);
router.get('/:id', getRating);
router.post('/', createRating);

export default router;