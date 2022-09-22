import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from 'src/guards';
import { CheckAuthInterceptor } from 'src/interceptors';
import { MessageAnswer } from 'src/resources';
import { ContextType, TransformContextPipe } from 'src/resources/pipes';
import { GetReviews } from './resources';
import {
  CreateReview,
  UpdateReview,
  GetPhoneReviews,
  RateReview,
} from './resources/dto';
import { ReviewService } from './review.service';

@UseInterceptors(CheckAuthInterceptor)
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

  @Mutation(() => MessageAnswer)
  @UseGuards(AuthGuard)
  async updateReview(
    @Args('data') data: UpdateReview,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<MessageAnswer> {
    return await this.reviewService.updateReview(id, data);
  }

  @Mutation(() => MessageAnswer)
  @UseGuards(AuthGuard)
  async deleteReview(
    @Args('id', { type: () => Int }) review_id: number,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<MessageAnswer> {
    return await this.reviewService.deleteReview(id, review_id);
  }

  @Mutation(() => MessageAnswer)
  @UseGuards(AuthGuard)
  async rateReview(
    @Args('data') data: RateReview,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<MessageAnswer> {
    return await this.reviewService.rateReview(data, id);
  }

  @Query(() => GetReviews)
  async getReviews(
    @Args('data') data: GetPhoneReviews,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<GetReviews> {
    return await this.reviewService.getReviews(data, id);
  }
}
