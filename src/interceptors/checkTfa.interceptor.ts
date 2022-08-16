import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { verifyJWTToken } from 'src/resources';

@Injectable()
export class CheckTfaInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const access = req.headers['access-token'];
    const tfa = req.headers['tfa-token'];
    let payload;
    if (access) {
      payload = verifyJWTToken(access);
    } else {
      payload = verifyJWTToken(tfa, process.env.TFA_SECRET);
    }
    if (payload) {
      req['id'] = payload['_id'];
    }
    return next.handle();
  }
}
