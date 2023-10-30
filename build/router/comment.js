import { Router } from 'express';
import { isAuth } from '../middleware/is-auth.js';
import { postComment } from '../controller/comment.js';
const router = Router();
router.post('/film/:filmId', isAuth, postComment);
export default router;
