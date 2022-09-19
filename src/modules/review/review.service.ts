import { Injectable } from '@nestjs/common';
import { Connection, QueryRunner } from 'typeorm';

import { ReviewsService } from 'src/services/reviews.service';
import {
  CreateReview,
  reviewErrors,
  reviewSuccesses,
  UpdateReview,
} from './resources';
import {
  CustomError,
  errorCode,
  initQueryRunner,
  MessageAnswer,
} from 'src/resources';
import { PhonesService } from 'src/services/phones.service';

@Injectable()
export class ReviewService {
  constructor(
    private reviewsService: ReviewsService,
    private phonesService: PhonesService,
    private connection: Connection,
  ) {}

  async updateReview(
    user_id: number,
    data: UpdateReview,
  ): Promise<MessageAnswer> {
    const { review_id } = data;
    const review = await this.reviewsService.getReviewById(review_id, user_id);
    if (!review) {
      throw new CustomError(reviewErrors.reviewNotExist, errorCode.review);
    }
    await this.reviewsService.updateReview(data);

    return {
      message: reviewSuccesses.updateReview,
    };
  }

  async deleteReview(user_id: number, id: number): Promise<MessageAnswer> {
    const review = await this.reviewsService.getReviewById(id, user_id);
    if (!review) {
      throw new CustomError(reviewErrors.reviewNotExist, errorCode.review);
    }

    return {
      message: reviewSuccesses.deleteReview,
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
