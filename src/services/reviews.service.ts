import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { Reviews } from 'src/entities';
import { CreateReview } from 'src/modules/review/resources';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private reviewsRepository: Repository<Reviews>,
  ) {}

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
