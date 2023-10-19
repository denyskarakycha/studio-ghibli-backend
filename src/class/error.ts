import { ValidationError } from 'express-validator';

export class ExtendedError extends Error {
  statusCode: number;
  validationData?: ValidationError[];

  constructor(message: string, statusCode: number, validationData?: ValidationError[]) {
    super(message);
    this.statusCode = statusCode;
    this.validationData = validationData;
  }
}
