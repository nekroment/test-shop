import * as bcrypt from 'bcrypt';

export const getAccessToken = (
  id: number | string,
  customSalt?: number,
): string => {
  let salt;
  if (customSalt) {
    salt = bcrypt.genSaltSync(customSalt);
  } else {
    salt = bcrypt.genSaltSync(Number(process.env.SALT));
  }
  return bcrypt.hashSync(String(id), salt);
};
