import jwt from 'jsonwebtoken';
export const createToken = (email, userId) => {
    const token = jwt.sign({
        email: email,
        userId: userId
    }, 'secret', { expiresIn: '1h' });
    return token;
};
