import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

import { ipFormat } from 'src/resources';

@Injectable()
export class UserIpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const ip = ipFormat(req['connection']['remoteAddress']);
    req['headers']['ip'] = ip;
    return next.handle();
  }
}
