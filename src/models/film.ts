import mongoose, { Schema, Document } from 'mongoose';

type TRating = {
  ratingId: {
    type: Schema.Types.ObjectId;
  };
  averageRAting: {
    type: Number;
    default: 0;
  };
};

export interface IFilmModel extends Document {
  title: string;
  originalTitle: string;
  imageUrl: string;
  bannerUrl: string;
  description: string;
  director: string;
  producer: string;
  releaseDate: string;
  runningTime: string;
  rating: mongoose.Types.ObjectId;
  comments: mongoose.Types.ObjectId[];
}

const filmSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  originalTitle: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  bannerUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  producer: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  runningTime: {
    type: String,
    required: true,
  },
  rating: {
      type: mongoose.Types.ObjectId,
      default: 0,
      ref: 'Rating',
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

export default mongoose.model<IFilmModel>('Film', filmSchema);
