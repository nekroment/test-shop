export const authErrors = {
  incorrect: `Email or password incorrect`,
  userExist: `User with this email already exist!`,
  attempts: 'Too many login attempts. Please try again later.',
  incorrectPassword: `Password incorrect`,
  tfa: `You must pass two-factor authentication to authorize.`,
  email: {
    format: 'Incorrect email format.',
  },
  password: {
    length: (min: number, max: number) =>
      `The password must be at least ${min} characters long and not more than ${max}.`,
    same: `Passwords must be the same.`,
    reset: `Invalid user name or email address.`,
    incorrect: `Password incorrect`,
    lowercase: 'password must contain at least 1 lowercase',
    uppercase: 'password must contain at least 1 uppercase',
    number: 'password must contain at least 1 number',
    symbol: 'password must contain at least 1 symbol',
  },
  name: {
    incorrect: `Invalid user name`,
    length: (min: number, max: number) =>
      `The login name must be at least ${min} characters long and not more than ${max}.`,
  },
};

export const authSuccesses = {
  register: 'Register success!',
};
