import axios from 'axios';

import { globalErrors, errorCode } from '../constants/messages';
import { CustomError } from '../';

export const checkEmail = async (email: string): Promise<void> => {
  let result;
  try {
    result = await axios.get(`https://disposable.debounce.io/?email=${email}`, {
      timeout: 3000,
    });
  } catch (error) {
    console.log('disposable.debounce.io crashed :(');
  }
  if (result && result.data['disposable'] === 'true') {
    throw new CustomError(globalErrors.incorrectEmail, errorCode.server);
  }
};
