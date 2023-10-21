import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { ExtendedError } from '../class/error.js';

import { createToken } from '../utils/create-token.js';

import User, { IUserModel } from '../models/user.js';

declare global {
  namespace Express {
    export interface User {
      email: string;
    }
  }
}

  type RequestBody = {
    email: string;
    password: string;
  };

export const login: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ExtendedError('Validation failed', 422, errors.array());
      throw error;
    }
    const body: RequestBody = req.body;
    const user = await User.findOne({ email: body.email });
    if (!user) {
      const error = new ExtendedError('User not found', 404);
      throw error;
    }
    const isEqual = await bcrypt.compare(body.password, user.password as string);
    if (!isEqual) {
      const error = new ExtendedError('Wrong password', 404);
      throw error;
    }
    const token = createToken(user.email, user._id.toString());
    res.status(200).json({ token: token });
  } catch (error) {
    next(error);
  }
};

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ExtendedError('Validation failed', 422, errors.array());
      throw error;
    }

    const body: RequestBody = req.body;
    const hashedPw = await bcrypt.hash(body.password, 12);
    const user: IUserModel = new User({
      email: body.email,
      password: hashedPw,
    });
    await user.save();
    res.status(200).json({ message: 'User created!' });
  } catch (error) {
    next(error);
  }
};

export const handleGoogleAuth: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      const error = new ExtendedError('User not found', 404);
      throw error;
    }
    const googleUser = req.user;

    const isExistsUser = await User.findOne({ email: googleUser.email });
    if (isExistsUser) {
      const token = createToken(isExistsUser.email, isExistsUser._id.toString());
      return res.status(200).json({ token: token });
    } else {
      const newGoogleUser: IUserModel = new User({
        email: googleUser.email,
      });
      await newGoogleUser.save();
      const token = createToken(newGoogleUser.email, newGoogleUser._id.toString());
      return res.status(200).json({ token: token, message: 'New user Created!' });
    }
  } catch (error) {
    next(error);
  }
};
