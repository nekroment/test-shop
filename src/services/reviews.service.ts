import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';

import {
  CommentRates,
  Comments,
  ReviewRates,
  Reviews,
  Users,
} from 'src/entities';
import { CreateReview, UpdateReview } from 'src/modules/review/resources';
import { Comment, getFormatDate, Review } from 'src/resources';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private reviewsRepository: Repository<Reviews>,
    @InjectRepository(ReviewRates)
    private reviewRatesRepository: Repository<ReviewRates>,
    @InjectRepository(CommentRates)
    private commentRatesRepository: Repository<CommentRates>,
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
  ) {}

  async replycommentsCount(id: number): Promise<number> {
    return await this.commentsRepository.count({
      relations: ['answer'],
      where: {
        answer: {
          id,
        },
      },
    });
  }

  async commentsCount(id: number): Promise<number> {
    return await this.commentsRepository.count({
      relations: ['review'],
      where: {
        review: {
          id,
        },
      },
    });
  }

  async getReplyComments(
    id: number,
    take: number,
    skip: number,
    user_id?: number,
  ): Promise<Comment[]> {
    const query = this.commentsRepository
      .createQueryBuilder('com')
      .select([
        'id',
        'comment',
        'datetime',
        'updated',
        'comment_rating',
        'review_id',
      ])
      .leftJoinAndSelect(
        (qb: SelectQueryBuilder<any>) =>
          qb
            .select(['id AS user_id', 'first_name', 'last_name'])
            .from(Users, 'u'),
        'user',
        'user.user_id = com.user_id',
      );

    if (user_id) {
      query.leftJoinAndSelect(
        (qb: SelectQueryBuilder<any>) =>
          qb
            .select([
              'comment_id',
              'user_id AS user_rate_id',
              'rate AS user_rating',
            ])
            .from(CommentRates, 'r'),
        'rates',
        `rates.comment_id = com.id AND rates.user_rate_id = ${user_id}`,
      );
    }
    const result = await query
      .where('com.comment_id = :id', { id })
      .offset(skip)
      .limit(take)
      .getRawMany();
    for (const element of result) {
      element.user = {
        id: element.user_id,
        first_name: element.first_name,
        last_name: element.last_name,
      };
    }
    return result;
  }

  async getComments(
    id: number,
    take: number,
    skip: number,
    user_id?: number,
  ): Promise<Comment[]> {
    const query = this.commentsRepository
      .createQueryBuilder('com')
      .select([
        'id',
        'comment',
        'datetime',
        'updated',
        'comment_rating',
        'review_id',
      ])
      .leftJoinAndSelect(
        (qb: SelectQueryBuilder<any>) =>
          qb
            .select(['comment_id', 'COUNT(id) AS answers'])
            .from(Comments, 'c')
            .groupBy('comment_id'),
        'answer',
        'answer.comment_id = com.id',
      )
      .addSelect(['answer.answers'])
      .leftJoinAndSelect(
        (qb: SelectQueryBuilder<any>) =>
          qb
            .select(['id AS user_id', 'first_name', 'last_name'])
            .from(Users, 'u'),
        'user',
        'user.user_id = com.user_id',
      );

    if (user_id) {
      query.leftJoinAndSelect(
        (qb: SelectQueryBuilder<any>) =>
          qb
            .select([
              'comment_id',
              'user_id AS user_rate_id',
              'rate AS user_rating',
            ])
            .from(CommentRates, 'r'),
        'rates',
        `rates.comment_id = com.id AND rates.user_rate_id = ${user_id}`,
      );
    }
    const result = await query
      .where('review_id = :id', { id })
      .offset(skip)
      .limit(take)
      .getRawMany();
    for (const element of result) {
      element.user = {
        id: element.user_id,
        first_name: element.first_name,
        last_name: element.last_name,
      };
      element.answers = element.answers ? element.answers : 0;
    }
    return result;
  }

  async getUserCommentRate(
    comment_id: number,
    user_id: number,
    query: QueryRunner,
  ): Promise<CommentRates> {
    return await query.manager.findOne(CommentRates, {
      relations: ['user', 'comment'],
      where: {
        comment: {
          id: comment_id,
        },
        user: {
          id: user_id,
        },
      },
    });
  }

  async getUserRate(
    review_id: number,
    user_id: number,
    query: QueryRunner,
  ): Promise<ReviewRates> {
    return await query.manager.findOne(ReviewRates, {
      relations: ['user', 'review'],
      where: {
        user: {
          id: user_id,
        },
        review: {
          id: review_id,
        },
      },
    });
  }

  async deleteCommentRate(
    rate_id: number,
    comment_id: number,
    rating: boolean,
    query: QueryRunner,
  ): Promise<void> {
    await query.manager.update(Comments, comment_id, {
      comment_rating: () => `comment_rating + ${rating ? 1 : -1}`,
    });
    await query.manager.delete(CommentRates, rate_id);
  }

  async deleteRate(
    rate_id: number,
    review_id: number,
    rating: boolean,
    query: QueryRunner,
  ): Promise<void> {
    await query.manager.update(Reviews, review_id, {
      review_rating: () => `review_rating + ${rating ? 1 : -1}`,
    });
    await query.manager.delete(ReviewRates, rate_id);
  }

  async addUserCommentRate(
    comment_id: number,
    user_id: number,
    rating: boolean,
    query: QueryRunner,
  ): Promise<void> {
    await query.manager.insert(CommentRates, {
      comment: {
        id: comment_id,
      },
      user: {
        id: user_id,
      },
      rate: rating,
    });
    await query.manager.update(Comments, comment_id, {
      comment_rating: () => `comment_rating + ${rating ? 1 : -1}`,
    });
  }

  async addUserRate(
    review_id: number,
    user_id: number,
    rating: boolean,
    query: QueryRunner,
  ): Promise<void> {
    await query.manager.insert(ReviewRates, {
      review: {
        id: review_id,
      },
      user: {
        id: user_id,
      },
      rate: rating,
    });
    await query.manager.update(Reviews, review_id, {
      review_rating: () => `review_rating + ${rating ? 1 : -1}`,
    });
  }

  async getUserReview(id: number, user_id: number): Promise<Reviews> {
    return await this.reviewsRepository.findOne({
      relations: ['user'],
      where: {
        id,
        user: {
          id: user_id,
        },
      },
    });
  }

  async getCommentById(id: number): Promise<Comments> {
    return await this.commentsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getReviewById(id: number): Promise<Reviews> {
    return await this.reviewsRepository.findOne({
      relations: ['user'],
      where: {
        id,
      },
    });
  }

  async updateReview(data: UpdateReview): Promise<void> {
    const { review_id, comment, rating } = data;
    const updated = getFormatDate();
    await this.reviewsRepository.update(review_id, {
      comment,
      rating,
      updated,
    });
  }

  async deleteReview(id: number): Promise<void> {
    await this.reviewsRepository.delete(id);
  }

  async reviewsCount(id: number): Promise<number> {
    return await this.reviewsRepository.count({
      relations: ['phone'],
      where: {
        phone: {
          id,
        },
      },
    });
  }

  async getPhoneReviews(
    id: number,
    take: number,
    skip: number,
    user_id?: number,
  ): Promise<Review[]> {
    const query = this.reviewsRepository
      .createQueryBuilder('review')
      .select([
        'id',
        'rating',
        'comment',
        'datetime',
        'updated',
        'review_rating',
        'phone_id',
      ])
      .leftJoinAndSelect(
        (qb: SelectQueryBuilder<any>) =>
          qb
            .select(['id AS user_id', 'first_name', 'last_name'])
            .from(Users, 'u'),
        'user',
        'user.user_id = review.user_id',
      );

    if (user_id) {
      query.leftJoinAndSelect(
        (qb: SelectQueryBuilder<any>) =>
          qb
            .select([
              'review_id',
              'user_id AS user_rate_id',
              'rate AS user_rating',
            ])
            .from(ReviewRates, 'r'),
        'rates',
        `rates.review_id = review.id AND rates.user_rate_id = ${user_id}`,
      );
    }
    const result = await query
      .where('phone_id = :id', { id })
      .offset(skip)
      .limit(take)
      .getRawMany();
    for (const element of result) {
      element.user = {
        id: element.user_id,
        first_name: element.first_name,
        last_name: element.last_name,
      };
    }
    return result;
  }

  async replyComment(
    user_id: number,
    comment_id: number,
    comment: string,
  ): Promise<void> {
    await this.commentsRepository.save(
      this.commentsRepository.create({
        answer: {
          id: comment_id,
        },
        user: {
          id: user_id,
        },
        comment,
      }),
    );
  }

  async addComment(
    user_id: number,
    review_id: number,
    comment: string,
  ): Promise<void> {
    await this.commentsRepository.save(
      this.commentsRepository.create({
        review: {
          id: review_id,
        },
        user: {
          id: user_id,
        },
        comment,
      }),
    );
  }

  async addReview(
    user_id: number,
    data: CreateReview,
    query: QueryRunner,
  ): Promise<void> {
    const { phone_id, comment, rating } = data;
    const review = this.reviewsRepository.create({
      phone: {
        id: phone_id,
      },
      comment,
      rating,
      user: {
        id: user_id,
      },
    });
    await query.manager.save(Reviews, review);
  }
}
