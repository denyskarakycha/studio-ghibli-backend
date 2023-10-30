var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose, { Schema } from 'mongoose';
import { ExtendedError } from '../class/error.js';
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    watchLater: [
        {
            type: Schema.Types.ObjectId,
        },
    ],
    watched: [
        {
            type: Schema.Types.ObjectId,
        },
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    ratings: [
        {
            ratingId: {
                type: Schema.Types.ObjectId,
                ref: 'Rating',
            },
            mark: {
                type: Number,
            },
        },
    ],
});
userSchema.method('addMark', function (ratingId, mark) {
    return __awaiter(this, void 0, void 0, function* () {
        this.ratings.forEach((items) => {
            if (items.ratingId.toString() === ratingId.toString()) {
                throw new ExtendedError('Mark is exists', 409);
            }
        });
        this.ratings.push({ ratingId: ratingId, mark: mark });
        return yield this.save();
    });
});
userSchema.method('updateMark', function (ratingId, mark, oldmark) {
    return __awaiter(this, void 0, void 0, function* () {
        this.ratings.forEach((items) => {
            if (items.ratingId.toString() === ratingId.toString()) {
                if (oldmark !== items.mark) {
                    const error = new ExtendedError('Bad request', 400);
                    throw error;
                }
                items.mark = mark;
            }
        });
        return yield this.save();
    });
});
export default mongoose.model('User', userSchema);
