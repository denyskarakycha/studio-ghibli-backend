import { Router } from 'express';
import { body } from 'express-validator';

import User, {IUserModel} from '../models/user.js'
import {signup, login} from '../controller/auth.js'

const router = Router();


router.post('/signup', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(async (value: string)=>{
        const isUserExists: IUserModel | null = await User.findOne({email: value}).exec();
        if (isUserExists) {
            return Promise.reject('User exists!');
        }
    })
    .normalizeEmail(),
    body('password').trim().isLength({min: 5})
], signup)

router.post('/login', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
    body('password').trim().isLength({min: 5})
], login);


export default router;