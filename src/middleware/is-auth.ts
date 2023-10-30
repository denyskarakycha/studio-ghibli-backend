import { Request, Response, NextFunction } from 'express';
import { ExtendedError } from '../class/error.js';
import jwt from 'jsonwebtoken';

declare module 'jsonwebtoken' {
  export interface UserDataJwtPayload extends jwt.JwtPayload {
    email: string;
    userId: string;
  }
}

declare global {
  namespace Express {
    interface Locals {
      decoded: jwt.UserDataJwtPayload;
    }
  }
}

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new ExtendedError('Not autheticated.', 401);
      throw error;
    }
    const token = authHeader.split(' ')[1];
    const decoded = <jwt.UserDataJwtPayload>jwt.verify(token, 'secret');
    if (!decoded) {
      const error = new ExtendedError('Wrong token', 500);
      throw error;
    } else {
      req.app.locals.decoded = decoded;
      next();
    }
  } catch (error) {
    next(error);
  }
};
