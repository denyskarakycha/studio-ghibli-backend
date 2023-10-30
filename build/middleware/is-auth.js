var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ExtendedError } from '../class/error.js';
import jwt from 'jsonwebtoken';
export const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            const error = new ExtendedError('Not autheticated.', 401);
            throw error;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'secret');
        if (!decoded) {
            const error = new ExtendedError('Wrong token', 500);
            throw error;
        }
        else {
            req.app.locals.decoded = decoded;
            next();
        }
    }
    catch (error) {
        next(error);
    }
});
