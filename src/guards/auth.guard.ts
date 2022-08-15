import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { UsersService } from '../services/users.service';
import {
  CustomError,
  errorCode,
  getFormatDate,
  ipFormat,
  verifyJWTToken,
} from 'src/resources';

const messages = {
  incorrectToken: 'Incorrect auth token. Please, try login again.',
  tokenExpired: 'The token has expired. Please, try to login again.',
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req, connection } = ctx.getContext();
    const second_req = context['args'][1]['req'];
    const headers = req
      ? req['headers']
      : connection
      ? connection['headers']
      : second_req['headers'];
    const payload = verifyJWTToken(headers['access-token']);
    if (!payload) {
      throw new CustomError(
        `${messages.incorrectToken}: access_token = ${
          headers['access-token']
        }, date = ${getFormatDate()}`,
        errorCode.login,
      );
    }
    if (payload['exp'] - Date.now() < 0) {
      throw new CustomError(
        `${messages.tokenExpired}: payload = ${JSON.stringify(
          payload,
        )}, difference = ${
          payload['exp'] - Date.now()
        }, date = ${getFormatDate()}`,
        errorCode.login,
      );
    }
    const user_id = payload['_id'];
    await this.usersService.checkUserReauthorization(user_id);
    req ? (req['id'] = user_id) : (second_req['id'] = user_id);
    return true;
  }
}
