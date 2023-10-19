import jwt from 'jsonwebtoken';

export const createToken = (email: string, userId: string): string => {
  const token = jwt.sign(
    {
      email: email,
      userId: userId
    },
    'secret',
    { expiresIn: '1h' },
  );
  return token;
};
