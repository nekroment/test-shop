import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from 'src/guards';
import { MessageAnswer, Review } from 'src/resources';
import { ContextType, TransformContextPipe } from 'src/resources/pipes';
import { ReviewsService } from 'src/services/reviews.service';
import { CreateReview, UpdateReview, GetPhoneReviews } from './resources/dto';
import { ReviewService } from './review.service';

@Resolver()
export class ReviewResolver {
  constructor(
    private reviewService: ReviewService,
    private reviewsService: ReviewsService,
  ) {}

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

  @Query(() => [Review])
  async getReviews(@Args('data') data: GetPhoneReviews): Promise<Review[]> {
    const { phone_id, take, skip } = data;
    return await this.reviewsService.getPhoneReviews(phone_id, take, skip);
  }
}
