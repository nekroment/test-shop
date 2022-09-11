import { Injectable } from '@nestjs/common';

import { PhonesService } from 'src/services/phones.service';
import { BrandsService } from 'src/services/brands.service';
import { filterErrors, filterSuccesses, GetFilters } from './resources';
import { CreateReview } from './resources/dto';
import {
  CustomError,
  errorCode,
  initQueryRunner,
  MessageAnswer,
} from 'src/resources';
import { Connection, QueryRunner } from 'typeorm';
import { ReviewsService } from 'src/services/reviews.service';

@Injectable()
export class FiltersService {
  constructor(
    private brandsService: BrandsService,
    private phonesService: PhonesService,
    private reviewsService: ReviewsService,
    private connection: Connection,
  ) {}

  async createReview(
    user_id: number,
    data: CreateReview,
  ): Promise<MessageAnswer> {
    const { phone_id } = data;
    const phone = await this.phonesService.findPhoneById(phone_id);
    if (!phone) {
      throw new CustomError(filterErrors.phoneExist, errorCode.review);
    }
    const methods = async (query: QueryRunner) => {
      try {
        await this.reviewsService.addReview(user_id, data, query);
      } catch (error) {
        throw new CustomError(filterErrors.reviewExist, errorCode.review);
      }
    };
    await initQueryRunner({
      connect: this.connection,
      methods,
    });
    return {
      message: filterSuccesses.createReview,
    };
  }

  async getFilters(): Promise<GetFilters> {
    const [brands, filters] = await Promise.all([
      this.brandsService.groupByBrands(),
      this.phonesService.groupByMemory(),
    ]);
    return {
      brands,
      memories: filters[0],
      ram: filters[1],
      diagonals: filters[2],
      batteries: filters[3],
      cameras: filters[4],
      os: filters[5],
      price: filters[6],
    };
  }
}
