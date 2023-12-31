import { RequestHandler } from 'express';
import { ExtendedError } from '../class/error.js';
import { validationResult } from 'express-validator';

import User from '../models/user.js';
import Comment from '../models/comment.js';
import mongoose from 'mongoose';
import Film from '../models/film.js';

type RequestBody = {
  comment: string;
};


export const postComment: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ExtendedError('Validation failed', 422, errors.array());
      throw error;
    }
    const filmId = req.params.filmId; 
    const body: RequestBody = req.body;
    const userDecodedData = req.app.locals.decoded;

    const comment = new Comment({
      content: body.comment,
    });
    await comment.save();

    const commentId: mongoose.Types.ObjectId = comment._id;

    const film = await Film.findById(filmId);
    if (film) {
      film.comments.push(commentId);
      await film.save();
    } else {
      const error = new ExtendedError("Film not found", 404);
      throw error;
    }
    // await Film.updateOne({_id: filmId}, {$push: {comments: comment}});
 
    const user = await User.findById(userDecodedData.userId);
    if (user) {
      user.comments.push(commentId); 
      await user.save();
    } else {
      const error = new ExtendedError("User not found", 404);
      throw error;
    }
    // await User.updateOne({_id: userDecodedData.userId}, {$push: {comments: comment}});

    res.status(200).json({film: film});
  } catch (error) {
    next(error);
  }
};
