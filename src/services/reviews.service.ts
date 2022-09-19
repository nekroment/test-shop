import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { Reviews } from 'src/entities';
import { CreateReview, UpdateReview } from 'src/modules/review/resources';
import { getFormatDate } from 'src/resources';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private reviewsRepository: Repository<Reviews>,
  ) {}

  async getReviewById(id: number, user_id: number): Promise<Reviews> {
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

  async updateREview(data: UpdateReview): Promise<void> {
    const { review_id, comment, rating } = data;
    const updated = getFormatDate();
    await this.reviewsRepository.update(review_id, {
      comment,
      rating,
      updated,
    });
  }

  async getPhoneReviews(
    id: number,
    take: number,
    skip: number,
  ): Promise<Reviews[]> {
    return await this.reviewsRepository.find({
      relations: ['phone', 'user'],
      where: {
        phone: {
          id,
        },
      },
      take,
      skip,
    });
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
