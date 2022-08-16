import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ContextType, TransformContextPipe } from 'src/resources/pipes';
import { MessageAnswer } from 'src/resources';
import { TfaService } from './tfa.service';
import { AuthGuard, TfaGuard } from 'src/guards';
import { User } from '../auth/resources';

@Resolver()
export class TfaResolver {
  constructor(private tfaService: TfaService) {}

  @Mutation(() => MessageAnswer)
  @UseGuards(AuthGuard)
  async toggleTfa(
    @Args('token') token: string,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<MessageAnswer> {
    return await this.tfaService.toggleUserTfa(id, token);
  }

  @Query(() => User)
  @UseGuards(TfaGuard)
  async tfaAuthorization(
    @Args('token') token: string,
    @Context(TransformContextPipe) { id, ip }: ContextType,
  ): Promise<User> {
    return await this.tfaService.tfaAuthorization(id, ip, token);
  }
}
