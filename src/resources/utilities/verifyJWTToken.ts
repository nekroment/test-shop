import * as jwt from 'jsonwebtoken';

export const verifyJWTToken = (
  token: string,
  type: string = process.env.TOKEN_SECRET,
) => {
  try {
    const isAuth = jwt.verify(token, type);
    return isAuth;
  } catch (error) {
    return false;
  }
};
