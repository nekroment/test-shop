import { Injectable } from '@nestjs/common';

import {
  CustomError,
  errorCode,
  GoogleAuthenticator,
  MessageAnswer,
} from 'src/resources';
import { UsersService } from 'src/services/users.service';
import { tfaErrors, tfaSuccesses } from './resources';

@Injectable()
export class TfaService {
  constructor(private usersService: UsersService) {}

  async toggleUserTfa(id: number, key: string): Promise<MessageAnswer> {
    const user = await this.usersService.findUserById(id);
    const checkResult = GoogleAuthenticator.verifyCode(user.tfa_key, key);
    if (!checkResult) {
      throw new CustomError(tfaErrors.incorrectToken, errorCode.tfa);
    }
    await this.usersService.toggleTfa(id);
    const message = user.tfa_enabled
      ? tfaSuccesses.disableTfa
      : tfaSuccesses.enableTfa;
    return {
      message,
    };
  }
}
