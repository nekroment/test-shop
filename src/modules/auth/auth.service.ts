import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/services/users.service';
import {
  authSuccesses,
  loginConstants,
  authErrors,
  Registration,
  User,
} from './resources';
import {
  checkEmail,
  CustomError,
  errorCode,
  getJWTToken,
  MessageAnswer,
  UserJWTokenType,
  validateToken,
} from 'src/resources';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(email: string, password: string, ip: string): Promise<User> {
    const user = await this.usersService.checkUserExist(
      email,
      authErrors.incorrect,
    );
    const fifteenMinutes = 15 * 60 * 1000;
    if (
      user.failed_logins >= loginConstants.attempts &&
      user.last_failed_login > Date.now() - fifteenMinutes
    ) {
      throw new CustomError(authErrors.attempts, errorCode.login, {
        attempts: loginConstants.attempts,
      });
    }
    const isCorrectPassword = validateToken(password, user.password_hash);
    if (!isCorrectPassword) {
      const lastFailed = Date.now();
      await this.usersService.userFailedLogin(user.id, lastFailed);
      throw new CustomError(authErrors.incorrectPassword, errorCode.login);
    }
    const tokenInfo: UserJWTokenType = {
      _id: user.id,
      _ip: ip,
    };
    if (user.tfa_enabled) {
      const tfa_token = getJWTToken(
        tokenInfo,
        process.env.TFA_SECRET,
        process.env.TFA_VALIDITY,
      );
      const data = {
        tfa_token: tfa_token,
        tfa_enabled: user.tfa_enabled,
      };
      throw new CustomError(authErrors.tfa, errorCode.tfa, data);
    }
    await this.usersService.updateLoginInfo(user.id);
    const token = getJWTToken(tokenInfo);
    const info: User = {
      ...user,
      token,
    };
    return info;
  }

  async registration(data: Registration, ip: string): Promise<MessageAnswer> {
    await checkEmail(data.email);
    await this.usersService.checkUserExist(
      data.email,
      authErrors.userExist,
      true,
    );
    await this.usersService.saveUser({
      ip,
      ...data,
    });
    return {
      message: authSuccesses.register,
    };
  }
}
