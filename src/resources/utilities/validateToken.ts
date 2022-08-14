import * as bcrypt from 'bcrypt';

export const validateToken = (data: string, token: string) => {
  const isCorrect = bcrypt.compareSync(data, token);
  return isCorrect;
};
