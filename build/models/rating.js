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
const ratingShema = new Schema({
    filmId: {
        type: Schema.Types.ObjectId,
    },
    totalCountVotes: {
        type: Number,
        default: 0
    },
    totalSum: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0,
    }
});
ratingShema.method('setRating', function (mark) {
    return __awaiter(this, void 0, void 0, function* () {
        this.totalCountVotes++;
        this.totalSum = this.totalSum + mark;
        this.averageRating = Number((this.totalSum / this.totalCountVotes).toFixed(2));
        return yield this.save();
    });
});
ratingShema.method('updateRating', function (oldmark, mark) {
    return __awaiter(this, void 0, void 0, function* () {
        this.totalSum = this.totalSum - oldmark;
        if (!this.totalCountVotes && !this.totalSum) {
            this.averageRating = 0;
        }
        else {
            this.totalSum = this.totalSum + mark;
            this.averageRating = Number((this.totalSum / this.totalCountVotes).toFixed(2));
        }
        return yield this.save();
    });
});
export default mongoose.model("Rating", ratingShema);
