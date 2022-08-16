import { Injectable } from '@nestjs/common';

import {
  CustomError,
  errorCode,
  getJWTToken,
  GoogleAuthenticator,
  MessageAnswer,
  UserJWTokenType,
} from 'src/resources';
import { UsersService } from 'src/services/users.service';
import { User } from '../auth/resources';
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

  async tfaAuthorization(id: number, ip: string, key: string): Promise<User> {
    const user = await this.usersService.findUserById(id);
    if (!user.tfa_enabled) {
      throw new CustomError(tfaErrors.tfaDisabled, errorCode.tfa);
    }
    const fifteen_minutes = 15 * 60 * 1000;
    const correct_time = Date.now() - fifteen_minutes;
    if (
      user.failed_tfa_attempts >= 4 &&
      user.last_failed_tfa_attempt > correct_time
    ) {
      throw new CustomError(tfaErrors.attempt, errorCode.tfa);
    }
    let checkResult = false;
    checkResult = GoogleAuthenticator.verifyCode(user.tfa_key, key);
    if (!checkResult) {
      await this.usersService.updateUserFailedTfa(id);
      throw new CustomError(tfaErrors.incorrectToken, errorCode.tfa);
    }
    await this.usersService.confirmUserTfa(id);
    const token_info: UserJWTokenType = {
      _id: id,
      _ip: ip,
    };
    const token = getJWTToken(token_info);
    return {
      ...user,
      token,
    };
  }
}
