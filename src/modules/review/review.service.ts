import { Injectable } from '@nestjs/common';
import { Connection, QueryRunner } from 'typeorm';

import { ReviewsService } from 'src/services/reviews.service';
import {
  CreateComment,
  CreateReview,
  GetReviewComments,
  GetPhoneReviews,
  GetReviews,
  RateReview,
  reviewErrors,
  reviewSuccesses,
  UpdateReview,
  GetComments,
  RateComment,
  ReplyToComment,
  GetReplyComments,
} from './resources';
import {
  CustomError,
  errorCode,
  initQueryRunner,
  MessageAnswer,
  TransactionLockType,
} from 'src/resources';
import { PhonesService } from 'src/services/phones.service';

@Injectable()
export class ReviewService {
  constructor(
    private reviewsService: ReviewsService,
    private phonesService: PhonesService,
    private connection: Connection,
  ) {}

  async replyToComment(
    user_id: number,
    data: ReplyToComment,
  ): Promise<MessageAnswer> {
    const { comment, comment_id } = data;
    const commentExist = await this.reviewsService.getCommentById(comment_id);
    if (!commentExist) {
      throw new CustomError(reviewErrors.commentNotExist, errorCode.comment);
    }
    await this.reviewsService.replyComment(user_id, comment_id, comment);
    return {
      message: reviewSuccesses.reppyToComment,
    };
  }

  async rateComment(
    data: RateComment,
    user_id: number,
  ): Promise<MessageAnswer> {
    const { comment_id, rating } = data;
    const comment = await this.reviewsService.getCommentById(comment_id);
    if (!comment) {
      throw new CustomError(reviewErrors.commentNotExist, errorCode.comment);
    }
    let message = '';
    const methods = async (query: QueryRunner) => {
      const rateExist = await this.reviewsService.getUserCommentRate(
        comment_id,
        user_id,
        query,
      );
      if (rateExist) {
        await this.reviewsService.deleteCommentRate(
          rateExist.id,
          comment_id,
          !rateExist.rate,
          query,
        );
        message = reviewSuccesses.updateRate;
      } else {
        await this.reviewsService.addUserCommentRate(
          comment_id,
          user_id,
          rating,
          query,
        );
        message = reviewSuccesses.addRate;
      }
    };
    await initQueryRunner({
      connect: this.connection,
      methods,
      lock: TransactionLockType.SERIALIZABLE,
      disableAttemts: true,
    });

    return {
      message,
    };
  }

  async getReplyComments(
    data: GetReplyComments,
    user_id?: number,
  ): Promise<GetComments> {
    const { comment_id, take, skip } = data;
    const [comments, total] = await Promise.all([
      this.reviewsService.getReplyComments(comment_id, take, skip, user_id),
      this.reviewsService.replycommentsCount(comment_id),
    ]);

    return {
      comments,
      total,
    };
  }

  async getComments(
    data: GetReviewComments,
    user_id?: number,
  ): Promise<GetComments> {
    const { review_id, take, skip } = data;
    const [comments, total] = await Promise.all([
      this.reviewsService.getComments(review_id, take, skip, user_id),
      this.reviewsService.commentsCount(review_id),
    ]);

    return {
      comments,
      total,
    };
  }

  async createComment(
    user_id: number,
    data: CreateComment,
  ): Promise<MessageAnswer> {
    const { comment, review_id } = data;
    const review = await this.reviewsService.getReviewById(review_id);
    if (!review) {
      throw new CustomError(reviewErrors.reviewNotExist, errorCode.review);
    }
    await this.reviewsService.addComment(user_id, review_id, comment);
    return {
      message: reviewSuccesses.addComment,
    };
  }

  async rateReview(data: RateReview, user_id: number): Promise<MessageAnswer> {
    const { review_id, rating } = data;
    let message = '';
    const review = await this.reviewsService.getReviewById(review_id);
    if (!review) {
      throw new CustomError(reviewErrors.reviewNotExist, errorCode.review);
    }
    const methods = async (query: QueryRunner) => {
      const rateExist = await this.reviewsService.getUserRate(
        review_id,
        user_id,
        query,
      );
      if (rateExist) {
        await this.reviewsService.deleteRate(
          rateExist.id,
          review_id,
          !rateExist.rate,
          query,
        );
        message = reviewSuccesses.updateRate;
      } else {
        await this.reviewsService.addUserRate(
          review_id,
          user_id,
          rating,
          query,
        );
        message = reviewSuccesses.addRate;
      }
    };
    await initQueryRunner({
      methods,
      connect: this.connection,
      lock: TransactionLockType.SERIALIZABLE,
      disableAttemts: true,
    });

    return {
      message,
    };
  }

  async updateReview(
    user_id: number,
    data: UpdateReview,
  ): Promise<MessageAnswer> {
    const { review_id } = data;
    const review = await this.reviewsService.getUserReview(review_id, user_id);
    if (!review) {
      throw new CustomError(reviewErrors.reviewNotExist, errorCode.review);
    }
    await this.reviewsService.updateReview(data);

    return {
      message: reviewSuccesses.updateReview,
    };
  }

  async deleteReview(user_id: number, id: number): Promise<MessageAnswer> {
    const review = await this.reviewsService.getUserReview(id, user_id);
    if (!review) {
      throw new CustomError(reviewErrors.reviewNotExist, errorCode.review);
    }
    await this.reviewsService.deleteReview(id);
    return {
      message: reviewSuccesses.deleteReview,
    };
  }

  async getReviews(
    data: GetPhoneReviews,
    user_id?: number,
  ): Promise<GetReviews> {
    const { phone_id, take, skip } = data;
    const [reviews, total] = await Promise.all([
      this.reviewsService.getPhoneReviews(phone_id, take, skip, user_id),
      this.reviewsService.reviewsCount(phone_id),
    ]);
    return {
      reviews,
      total,
    };
  }

  async createReview(
    user_id: number,
    data: CreateReview,
  ): Promise<MessageAnswer> {
    const { phone_id } = data;
    const phone = await this.phonesService.findPhoneById(phone_id);
    if (!phone) {
      throw new CustomError(reviewErrors.phoneExist, errorCode.review);
    }
    const methods = async (query: QueryRunner) => {
      try {
        await this.reviewsService.addReview(user_id, data, query);
      } catch (error) {
        throw new CustomError(reviewErrors.reviewExist, errorCode.review);
      }
    };
    await initQueryRunner({
      connect: this.connection,
      methods,
    });
    return {
      message: reviewSuccesses.createReview,
    };
  }
}
