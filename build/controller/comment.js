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
import User from '../models/user.js';
import Comment from '../models/comment.js';
import Film from '../models/film.js';
export const postComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filmId = req.params.filmId;
        const body = req.body;
        const userDecodedData = req.app.locals.decoded;
        const comment = new Comment({
            content: body.comment,
        });
        yield comment.save();
        const commentId = comment._id;
        const film = yield Film.findById(filmId);
        if (film) {
            film.comments.push(commentId);
            yield film.save();
        }
        else {
            const error = new ExtendedError("Film not found", 404);
            throw error;
        }
        const user = yield User.findById(userDecodedData.userId);
        if (user) {
            user.comments.push(commentId);
            yield user.save();
        }
        else {
            const error = new ExtendedError("User not found", 404);
            throw error;
        }
        res.status(200).json({ film: film });
    }
    catch (error) {
        next(error);
    }
});
