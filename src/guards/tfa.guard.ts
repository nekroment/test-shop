import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CustomError, errorCode, verifyJWTToken } from 'src/resources';

const messages = {
  incorrectToken: 'Incorrect auth token. Please, try login again.',
  tokenExpired: 'The token has expired. Please, try to login again.',
};

@Injectable()
export class TfaGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req, connection } = ctx.getContext();
    const headers = req['headers'] || connection['context'];
    const payload = verifyJWTToken(
      headers['tfa-token'],
      process.env.TFA_SECRET,
    );
    if (!payload) {
      throw new CustomError(messages.incorrectToken, errorCode.login);
    }
    if (payload['exp'] - Date.now() < 0) {
      throw new CustomError(messages.tokenExpired, errorCode.login);
    }
    const user_id = payload['_id'];
    req['id'] = user_id;
    return true;
  }
}
