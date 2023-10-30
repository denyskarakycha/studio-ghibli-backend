var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validationResult } from 'express-validator';
import { ExtendedError } from '../class/error.js';
import User from '../models/user.js';
import Film from '../models/film.js';
import Rating from '../models/rating.js';
export const updateWatchStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isWatched = req.query.watched;
        const filmId = req.params.filmId;
        const userDecodedData = req.app.locals.decoded;
        const film = yield Film.findById(filmId);
        if (!film) {
            const error = new ExtendedError('Film not found', 404);
            throw error;
        }
        const user = yield User.findById(userDecodedData.userId);
        if (!user) {
            const error = new ExtendedError('User not found', 404);
            throw error;
        }
        const isExistsInWatched = user.watched.indexOf(film._id) !== -1;
        const isExistsInWatchLater = user.watchLater.indexOf(film._id) !== -1;
        if (isWatched !== 'true' && isExistsInWatchLater) {
            const error = new ExtendedError('Film is already in watchLater', 400);
            throw error;
        }
        else if (isWatched === 'true' && isExistsInWatched) {
            const error = new ExtendedError('Film is already in watched', 400);
            throw error;
        }
        if (isWatched !== 'true') {
            user.watchLater.push(film._id);
        }
        else {
            user.watched.push(film._id);
        }
        yield user.save();
        res.status(200).json({ messages: 'done' });
    }
    catch (error) {
        next(error);
    }
});
export const deleteWatchStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isWatched = req.query.watched;
        const filmId = req.params.filmId;
        const userDecodedData = req.app.locals.decoded;
        const film = yield Film.findById(filmId);
        if (!film) {
            const error = new ExtendedError('Film not found', 404);
            throw error;
        }
        const user = yield User.findById(userDecodedData.userId);
        if (!user) {
            const error = new ExtendedError('User not found', 404);
            throw error;
        }
        if (isWatched) {
            yield User.updateOne({ _id: user._id }, { $pull: { watched: film._id } });
        }
        else {
            yield User.updateOne({ _id: user._id }, { $pull: { watchLater: film._id } });
        }
        res.status(200).json({ messages: 'done' });
    }
    catch (error) {
        next(error);
    }
});
export const postRating = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new ExtendedError('Validation failed', 422, errors.array());
            throw error;
        }
        const filmId = req.params.filmId;
        const userDecodedData = req.app.locals.decoded;
        const body = req.body;
        const film = yield Film.findById(filmId);
        if (!film) {
            const error = new ExtendedError('Film not found', 404);
            throw error;
        }
        const user = yield User.findById(userDecodedData.userId);
        if (!user) {
            const error = new ExtendedError('User not found', 404);
            throw error;
        }
        const isExistsFilmRating = yield Rating.findOne({ filmId: filmId });
        if (isExistsFilmRating) {
            yield user.addMark(isExistsFilmRating._id, body.mark);
            yield isExistsFilmRating.setRating(body.mark);
            return res.status(200).json({ message: 'Rating set' });
        }
        const rating = new Rating({
            filmId: filmId,
            totalCountVotes: 1,
            totalSum: body.mark,
            averageRating: body.mark,
        });
        yield rating.save();
        user.ratings.push({ ratingId: rating._id, mark: body.mark });
        yield user.save();
        film.rating = rating._id;
        yield film.save();
        res.status(200).json({ rating: rating });
    }
    catch (error) {
        next(error);
    }
});
export const updateRating = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new ExtendedError('Validation failed', 422, errors.array());
            throw error;
        }
        const filmId = req.params.filmId;
        const userDecodedData = req.app.locals.decoded;
        const body = req.body;
        const film = yield Film.findById(filmId);
        if (!film) {
            const error = new ExtendedError('Film not found', 404);
            throw error;
        }
        const user = yield User.findById(userDecodedData.userId);
        if (!user) {
            const error = new ExtendedError('User not found', 404);
            throw error;
        }
        const isExistsFilmRating = yield Rating.findOne({ filmId: filmId });
        if (!isExistsFilmRating) {
            const error = new ExtendedError('Bad request', 400);
            throw error;
        }
        if (!body.oldmark) {
            const error = new ExtendedError('Bad request', 400);
            throw error;
        }
        yield user.updateMark(isExistsFilmRating._id, body.mark, body.oldmark);
        yield isExistsFilmRating.updateRating(body.oldmark, body.mark);
        res.status(200).json({ message: 'Rating update' });
    }
    catch (error) {
        next(error);
    }
});
