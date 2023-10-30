var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { ExtendedError } from '../class/error.js';
import { createToken } from '../utils/create-token.js';
import User from '../models/user.js';
export const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new ExtendedError('Validation failed', 422, errors.array());
            throw error;
        }
        const body = req.body;
        const user = yield User.findOne({ email: body.email });
        if (!user) {
            const error = new ExtendedError('User not found', 404);
            throw error;
        }
        const isEqual = yield bcrypt.compare(body.password, user.password);
        if (!isEqual) {
            const error = new ExtendedError('Wrong password', 404);
            throw error;
        }
        const token = createToken(user.email, user._id.toString());
        res.status(200).json({ token: token });
    }
    catch (error) {
        next(error);
    }
});
export const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new ExtendedError('Validation failed', 422, errors.array());
            throw error;
        }
        const body = req.body;
        const hashedPw = yield bcrypt.hash(body.password, 12);
        const user = new User({
            email: body.email,
            password: hashedPw,
        });
        yield user.save();
        res.status(200).json({ message: 'User created!' });
    }
    catch (error) {
        next(error);
    }
});
export const handleGoogleAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            const error = new ExtendedError('User not found', 404);
            throw error;
        }
        const googleUser = req.user;
        const isExistsUser = yield User.findOne({ email: googleUser.email });
        if (isExistsUser) {
            const token = createToken(isExistsUser.email, isExistsUser._id.toString());
            return res.status(200).json({ token: token });
        }
        else {
            const newGoogleUser = new User({
                email: googleUser.email,
            });
            yield newGoogleUser.save();
            const token = createToken(newGoogleUser.email, newGoogleUser._id.toString());
            return res.status(200).json({ token: token, message: 'New user Created!' });
        }
    }
    catch (error) {
        next(error);
    }
});
