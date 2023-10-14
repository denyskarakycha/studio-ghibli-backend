import { Router } from 'express';
import { getFilms } from '../controller/film.js'

const router = Router();

router.get('/films', getFilms);

export default router;
