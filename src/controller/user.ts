import { RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import { ExtendedError } from '../class/error.js';

import User, { IUserModel } from '../models/user.js';
import Comment, { ICommentModel } from '../models/comment.js';
import mongoose, { Query, Types } from 'mongoose';
import Film from '../models/film.js';
import Rating from '../models/rating.js';

type RequestBody = {
  mark: number;
  oldmark?: number
};

export const updateWatchStatus: RequestHandler = async (req, res, next) => {
  try {
    const isWatched = req.query.watched;
    const filmId = req.params.filmId;
    const userDecodedData = req.app.locals.decoded;
    const film = await Film.findById(filmId);
    if (!film) {
      const error = new ExtendedError('Film not found', 404);
      throw error;
    }
    const user = await User.findById(userDecodedData.userId);
    if (!user) {
      const error = new ExtendedError('User not found', 404);
      throw error;
    }

    const isExistsInWatched = user.watched.indexOf(film._id) !== -1;
    const isExistsInWatchLater = user.watchLater.indexOf(film._id) !== -1;

    if (isWatched !== 'true' && isExistsInWatchLater) {
      // Якщо користувач вже додав фільм до "watchLater", викинути помилку
      const error = new ExtendedError('Film is already in watchLater', 400);
      throw error;
    } else if (isWatched === 'true' && isExistsInWatched) {
      // Якщо користувач вже додав фільм до "watched", викинути помилку
      const error = new ExtendedError('Film is already in watched', 400);
      throw error;
    }

    if (isWatched !== 'true') {
      user.watchLater.push(film._id);
      // await User.updateOne({_id: userDecodedData.userId}, {$push: {watchLater: film}});
    } else {
      user.watched.push(film._id);
      // await User.updateOne({_id: userDecodedData.userId}, {$push: {watched: film}});
    }

    await user.save();

    res.status(200).json({ messages: 'done' });
  } catch (error) {
    next(error);
  }
};

export const deleteWatchStatus: RequestHandler = async (req, res, next) => {
  try {
    const isWatched = req.query.watched;
    const filmId = req.params.filmId;
    const userDecodedData = req.app.locals.decoded;

    const film = await Film.findById(filmId);
    if (!film) {
      const error = new ExtendedError('Film not found', 404);
      throw error;
    }
    const user = await User.findById(userDecodedData.userId);
    if (!user) {
      const error = new ExtendedError('User not found', 404);
      throw error;
    }

    if (isWatched) {
      await User.updateOne({ _id: user._id }, { $pull: { watched: film._id } });
    } else {
      await User.updateOne({ _id: user._id }, { $pull: { watchLater: film._id } });
    }

    res.status(200).json({ messages: 'done' });
  } catch (error) {
    next(error);
  }
};

export const postRating: RequestHandler = async (req, res, next) => {
  try {
    const filmId = req.params.filmId;
    const userDecodedData = req.app.locals.decoded;
    const body: RequestBody = req.body;
    const film = await Film.findById(filmId);
    if (!film) {
      const error = new ExtendedError('Film not found', 404);
      throw error;
    }
    const user = await User.findById(userDecodedData.userId);
    if (!user) {
      const error = new ExtendedError('User not found', 404);
      throw error;
    }

    const isExistsFilmRating = await Rating.findOne({ filmId: filmId });
    if (isExistsFilmRating) {
      await user.addMark(isExistsFilmRating._id, body.mark);

      await isExistsFilmRating.setRating(body.mark);
      return res.status(200).json({ message: 'Rating set' });

      // await User.findOneAndUpdate(
      //   { _id: user._id, 'ratings.ratingId': updateRating._id },
      //   { $set: { 'ratings.$.mark': body.rating } },
      // );
    }

    const rating = new Rating({
      filmId: filmId,
      totalCountVotes: 1,
      totalSum: body.mark,
      averageRating: body.mark,
    });
    await rating.save();

    user.ratings.push({ ratingId: rating._id, mark: body.mark });
    await user.save();

    film.rating = rating._id;
    await film.save();

    res.status(200).json({ rating: rating });
  } catch (error) {
    next(error);
  }
};

export const updateRating: RequestHandler = async (req, res, next) => {
  try {
    const filmId = req.params.filmId;
    const userDecodedData = req.app.locals.decoded;
    const body: RequestBody = req.body;
    const film = await Film.findById(filmId);
    if (!film) {
      const error = new ExtendedError('Film not found', 404);
      throw error;
    }
    const user = await User.findById(userDecodedData.userId);
    if (!user) {
      const error = new ExtendedError('User not found', 404);
      throw error;
    }
    const isExistsFilmRating = await Rating.findOne({ filmId: filmId });
    if (!isExistsFilmRating) {
      const error = new ExtendedError('Bad request', 400);
      throw error;
    }
    if (!body.oldmark) {
      const error = new ExtendedError('Bad request', 400);
      throw error;
    }
    await user.updateMark(isExistsFilmRating._id, body.mark, body.oldmark);
    await isExistsFilmRating.updateRating(body.oldmark, body.mark);

    res.status(200).json({ message: 'Rating update' });
  } catch (error) {
    next(error);
  }
};
