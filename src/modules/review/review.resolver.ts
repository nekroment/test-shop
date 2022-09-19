import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { AuthGuard } from 'src/guards';
import { MessageAnswer } from 'src/resources';
import { ContextType, TransformContextPipe } from 'src/resources/pipes';
import { CreateReview } from './resources/dto';
import { ReviewService } from './review.service';

@Resolver()
export class ReviewResolver {
  constructor(private reviewService: ReviewService) {}

  @Mutation(() => MessageAnswer)
  @UseGuards(AuthGuard)
  async createReview(
    @Args('data') data: CreateReview,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<MessageAnswer> {
    return await this.reviewService.createReview(id, data);
  }
}
