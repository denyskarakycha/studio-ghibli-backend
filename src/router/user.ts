import { Router } from 'express';
import { getFilms } from '../controller/film.js'
import { isAuth } from '../middleware/is-auth.js'
import { updateWatchStatus, deleteWatchStatus, postRating , updateRating} from '../controller/user.js';

const router = Router();

router.put('/film/watch-status/:filmId', isAuth, updateWatchStatus);

router.delete('/film/watch-status/:filmId', isAuth, deleteWatchStatus);

router.post('/film/rating/:filmId', isAuth, postRating);

router.put('/film/rating/:filmId', isAuth, updateRating);

export default router;