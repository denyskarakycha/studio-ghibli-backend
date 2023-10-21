import { Router } from 'express';
import { getFilms } from '../controller/film.js'
import { isAuth } from '../middleware/is-auth.js'
import { postWatchState } from '../controller/user.js';

const router = Router();

router.post('/film/watch-state/:filmId', isAuth, postWatchState);

export default router;