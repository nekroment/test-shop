import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { ContextType, TransformContextPipe } from 'src/resources/pipes';
import { MessageAnswer } from 'src/resources';
import { TfaService } from './tfa.service';
import { AuthGuard } from 'src/guards';

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
}
