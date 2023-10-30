import { Router } from 'express';
import { isAuth } from '../middleware/is-auth.js';
import { updateWatchStatus, deleteWatchStatus, postRating, updateRating } from '../controller/user.js';
import { body } from 'express-validator';
const router = Router();
router.put('/film/watch-status/:filmId', isAuth, updateWatchStatus);
router.delete('/film/watch-status/:filmId', isAuth, deleteWatchStatus);
router.post('/film/rating/:filmId', [
    body('mark').isInt({ min: 0, max: 10 })
], isAuth, postRating);
router.put('/film/rating/:filmId', [
    body('mark').isInt({ min: 0, max: 10 }),
    body('oldmark').isInt({ min: 0, max: 10 })
], isAuth, updateRating);
export default router;
