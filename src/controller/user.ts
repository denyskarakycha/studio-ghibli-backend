import { RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import { ExtendedError } from '../class/error.js';

import User, { IUserModel } from '../models/user.js';
import Comment, { ICommentModel } from '../models/comment.js';
import mongoose, { Query } from 'mongoose';
import Film from '../models/film.js';

export const postWatchState: RequestHandler = async (req, res, next) => {
  try {
    // const isWatched: boolean = req.query.watched
    const filmId = req.params.filmId;
    const userDecodedData = req.app.locals.decoded;
    const film = await Film.findById(filmId);
    if (film) {
      const user = await User.findById(userDecodedData.userId);
      if (user) {
        // if (!isWatched) {
        //     user.watchLater.push(film._id);
        // }
        user.watched.push(film._id);
        await user.save();
      } else {
        const error = new ExtendedError('User not found', 404);
        throw error;
      }
    } else {
      const error = new ExtendedError('Film not found', 404);
      throw error;
    }

    res.status(200).json({messages: "done"});
  } catch (error) {
    next(error);
  }
};

