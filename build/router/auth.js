var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import { body } from 'express-validator';
import User from '../models/user.js';
import { signup, login } from '../controller/auth.js';
const router = Router();
router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const isUserExists = yield User.findOne({ email: value }).exec();
        if (isUserExists) {
            return Promise.reject('User exists!');
        }
    }))
        .normalizeEmail(),
    body('password').trim().isLength({ min: 5 })
], signup);
router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password').trim().isLength({ min: 5 })
], login);
export default router;
