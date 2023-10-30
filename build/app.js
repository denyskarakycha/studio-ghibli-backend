var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import "./config/passport.js";
import { ExtendedError } from './class/error.js';
import filmRoutes from './router/film.js';
import authRoutes from './router/auth.js';
import googleRoutes from './router/google-auth.js';
import commentRoutes from './router/comment.js';
import userRoutes from "./router/user.js";
const MONGODB_URI = 'mongodb+srv://denys:295q6722822@cluster0.fk2cpgo.mongodb.net/studioGhibli?retryWrites=true&w=majority';
const app = express();
app.use(bodyParser.json());
app.use(cors({ credentials: true }));
app.use('/google', googleRoutes);
app.use('/comment', commentRoutes);
app.use('/user', userRoutes);
app.use(filmRoutes);
app.use(authRoutes);
app.use((req, res, next) => {
    const error = new ExtendedError('Page not found!', 404);
    next(error);
});
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message || 'Server ocurred';
    const validationData = error.validationData || message;
    res.status(status).json({ message: message, validationData: validationData });
});
mongoose
    .connect(MONGODB_URI)
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    const server = http.createServer(app);
    server.listen(8080, () => {
        console.log('start server');
    });
}))
    .catch((error) => {
    console.log(error);
});
