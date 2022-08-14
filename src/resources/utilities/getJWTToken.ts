import * as jwt from 'jsonwebtoken';

export interface JWTInfo {
  [key: string]: any;
}

export const getJWTToken = (
  info: JWTInfo,
  type: string = process.env.TOKEN_SECRET,
  range: string = process.env.TOKEN_VALIDITY,
): string => {
  return jwt.sign(
    {
      ...info,
      exp: Date.now() + Number(range) * 1000,
    },
    type,
  );
};
