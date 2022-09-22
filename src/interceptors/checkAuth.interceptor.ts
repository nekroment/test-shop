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
export class CheckAuthInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const payload = verifyJWTToken(req.headers['access-token']);
    if (payload) {
      req['id'] = payload['_id'];
    }
    return next.handle();
  }
}
