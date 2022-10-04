import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from 'src/guards';
import { CheckAuthInterceptor } from 'src/interceptors';
import { MessageAnswer } from 'src/resources';
import { ContextType, TransformContextPipe } from 'src/resources/pipes';
import { GetComments, GetReviews } from './resources';
import {
  CreateReview,
  UpdateReview,
  GetPhoneReviews,
  RateReview,
  CreateComment,
  GetReviewComments,
  RateComment,
  ReplyToComment,
  GetReplyComments,
  UpdateComment,
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
  async createComment(
    @Args('data') data: CreateComment,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<MessageAnswer> {
    return await this.reviewService.createComment(id, data);
  }

  @Mutation(() => MessageAnswer)
  @UseGuards(AuthGuard)
  async replyToComment(
    @Args('data') data: ReplyToComment,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<MessageAnswer> {
    return await this.reviewService.replyToComment(id, data);
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
  async updateComment(
    @Args('data') data: UpdateComment,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<MessageAnswer> {
    return await this.reviewService.updateComment(id, data);
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
  async deleteComment(
    @Args('id', { type: () => Int }) comment_id: number,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<MessageAnswer> {
    return await this.reviewService.deleteComment(id, comment_id);
  }

  @Mutation(() => MessageAnswer)
  @UseGuards(AuthGuard)
  async rateReview(
    @Args('data') data: RateReview,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<MessageAnswer> {
    return await this.reviewService.rateReview(data, id);
  }

  @Mutation(() => MessageAnswer)
  @UseGuards(AuthGuard)
  async rateComment(
    @Args('data') data: RateComment,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<MessageAnswer> {
    return await this.reviewService.rateComment(data, id);
  }

  @Query(() => GetReviews)
  async getReviews(
    @Args('data') data: GetPhoneReviews,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<GetReviews> {
    return await this.reviewService.getReviews(data, id);
  }

  @Query(() => GetComments)
  async getReplyComments(
    @Args('data') data: GetReplyComments,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<GetComments> {
    return await this.reviewService.getReplyComments(data, id);
  }

  @Query(() => GetComments)
  async getComments(
    @Args('data') data: GetReviewComments,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<GetComments> {
    return await this.reviewService.getComments(data, id);
  }
}
