import { Router } from 'express';
import passport from 'passport';
import { handleGoogleAuth } from '../controller/auth.js';
const router = Router();
router.get('/auth', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/callback', passport.authenticate('google', { session: false, failureRedirect: '/google/auth' }), handleGoogleAuth);
export default router;
