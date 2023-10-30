import { Router } from 'express';
import { isAuth } from '../middleware/is-auth.js';
import { postComment } from '../controller/comment.js';
import { body } from 'express-validator';

const router = Router();

router.post('/film/:filmId', [
    body('comment').isLength({min: 5, max: 200})
], isAuth, postComment);

export default router;