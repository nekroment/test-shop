import { Injectable } from '@nestjs/common';
import { Connection, QueryRunner } from 'typeorm';

import { ReviewsService } from 'src/services/reviews.service';
import {
  CreateComment,
  CreateReview,
  GetPhoneReviews,
  GetReviews,
  RateReview,
  reviewErrors,
  reviewSuccesses,
  UpdateReview,
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
