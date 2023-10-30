import { Router } from 'express';
import { getFilms } from '../controller/film.js';
import { isAuth } from '../middleware/is-auth.js';
const router = Router();
router.get('/films', isAuth, getFilms);
export default router;
