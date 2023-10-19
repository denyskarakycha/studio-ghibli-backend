import { Request, Response, NextFunction } from 'express';
import { ExtendedError } from '../class/error.js';
import jwt, { Jwt } from 'jsonwebtoken';

interface IToken {
  email: string,
  userId: string
}

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new ExtendedError('Not autheticated.', 401);
      throw error;
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'secret', (error: any, decoded: any ) => {
      if(error) {
        const error = new ExtendedError('Wrong token.', 401);
        throw error; 
      }
      if (!decoded) {
        const error = new ExtendedError('Wrong token', 500);
        throw error;  
      } else {
        res.locals.user = decoded;
        next();
      }
    });
  } catch (error) {
    next(error);
  }
};
