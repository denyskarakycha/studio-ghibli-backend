import mongoose, { Schema, Document } from 'mongoose';
import { ICommentModel } from './comment.js';
import { error } from 'console';
import { ExtendedError } from '../class/error.js';

type TUserRating = {
  ratingId: mongoose.Types.ObjectId;
  mark: number;
};

export interface IUserModel extends Document {
  email: string;
  password?: String;
  watchLater: mongoose.Types.ObjectId[];
  watched: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  ratings: Array<TUserRating>;
  addMark: (retingId: mongoose.Types.ObjectId, mark: number) => Promise<IUserModel>;
  updateMark: (retingId: mongoose.Types.ObjectId, mark: number, oldmark: number) => Promise<IUserModel>;
}

const userSchema: Schema<IUserModel> = new Schema({
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

userSchema.method('addMark', async function (ratingId: mongoose.Types.ObjectId, mark: number): Promise<IUserModel> {
  this.ratings.forEach((items) => {
    if (items.ratingId.toString() === ratingId.toString()) {
      throw new ExtendedError('Mark is exists', 400);
    }
  });
  this.ratings.push({ ratingId: ratingId, mark: mark });
  return await this.save();
});

userSchema.method( 'updateMark', async function (ratingId: mongoose.Types.ObjectId, mark: number, oldmark: number): Promise<IUserModel> {
    this.ratings.forEach((items) => {
      if (items.ratingId.toString() === ratingId.toString()) {
        if (oldmark !== items.mark) {
          const error = new ExtendedError('Bad request', 400);
          throw error;
        }
        items.mark = mark;
      }
    });
    return await this.save();
  },
);

export default mongoose.model<IUserModel>('User', userSchema);
