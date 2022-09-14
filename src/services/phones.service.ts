import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Brands, Phones, Reviews } from 'src/entities';
import {
  GroupByMemory,
  GroupByRam,
  GroupByBattery,
  GroupByCamera,
  GroupByDiagonal,
  GroupByOs,
  PriceRange,
  Phone,
  PhoneModel,
} from 'src/resources';
import { GetPhonesByFilters } from 'src/modules/filters/resources/dto/getPhonesByFilters.dto';

@Injectable()
export class PhonesService {
  constructor(
    @InjectRepository(Phones)
    private phonesRepository: Repository<Phones>,
  ) {}

  async adminAddPhone(data: Phone): Promise<void> {
    const { name, price, brand, diagonal, memory, ram, images } = data;
    const phone = this.phonesRepository.create({
      name,
      price,
      brand: {
        id: brand,
      },
      diagonal,
      memory,
      ram,
      image: {
        images,
      },
    });
    await this.phonesRepository.save(phone);
  }

  async getPhonesByFilters(data: GetPhonesByFilters): Promise<PhoneModel[]> {
    const {
      take,
      skip,
      name,
      min_price,
      max_price,
      memories,
      ram,
      batteries,
      diagonals,
      cameras,
      os,
      brands,
    } = data;

    const request = await this.phonesRepository
      .createQueryBuilder('phone')
      .leftJoinAndSelect(
        (qb: SelectQueryBuilder<any>) =>
          qb.select(['id AS id_brand', 'name AS brand_name']).from(Brands, 'b'),
        'brand',
        'brand.id_brand = phone.brand_id',
      )
      .leftJoinAndSelect(
        (qb: SelectQueryBuilder<any>) =>
          qb
            .select(['phone_id', 'AVG(rating) AS rating'])
            .from(Reviews, 'r')
            .groupBy('r.phone_id'),
        'review',
        'review.phone_id = phone.id',
      )
      .select([
        'id',
        'name',
        'price',
        'memory',
        'ram',
        'diagonal',
        'battery',
        'camera',
        'os',
        'image AS phone_images',
        'brand.id_brand AS brand_id',
        'brand.brand_name AS brand_name',
        'review.rating AS rating',
      ])
      .where('name LIKE :name', { name: `%${name}%` })
      .andWhere('price >= :min', { min: min_price })
      .andWhere('price <= :max', { max: max_price })
      .limit(take)
      .offset(skip);

    if (memories) {
      request.andWhere('memory IN (:...memories)', {
        memories,
      });
    }
    if (ram) {
      request.andWhere('ram IN (:...ram)', {
        ram,
      });
    }

    if (batteries) {
      request.andWhere('battery IN (:...batteries)', {
        batteries,
      });
    }

    if (diagonals) {
      request.andWhere('diagonal IN (:...diagonals)', {
        diagonals,
      });
    }

    if (cameras) {
      request.andWhere('camera IN (:...cameras)', {
        cameras,
      });
    }

    if (os) {
      request.andWhere('os IN (:...os)', {
        os,
      });
    }

    if (brands) {
      request.andWhere('brand_id IN (:...brands)', {
        brands,
      });
    }

    const result: PhoneModel[] = await request.execute();
    for (const element of result) {
      element.rating = !element.rating ? 0 : element.rating;
    }
    console.log(result);
    return result;
  }

  async findPhoneById(id: number): Promise<Phones> {
    return await this.phonesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async groupByMemory(): Promise<
    [
      GroupByMemory[],
      GroupByRam[],
      GroupByDiagonal[],
      GroupByBattery[],
      GroupByCamera[],
      GroupByOs[],
      PriceRange,
    ]
  > {
    return await Promise.all([
      this.phonesRepository
        .createQueryBuilder('phone')
        .select(['COUNT(id) AS phones', 'memory'])
        .groupBy('memory')
        .execute(),
      this.phonesRepository
        .createQueryBuilder('phone')
        .select(['COUNT(id) AS phones', 'ram'])
        .groupBy('ram')
        .execute(),
      this.phonesRepository
        .createQueryBuilder('phone')
        .select(['COUNT(id) AS phones', 'diagonal'])
        .groupBy('diagonal')
        .execute(),
      this.phonesRepository
        .createQueryBuilder('phone')
        .select(['COUNT(id) AS phones', 'battery'])
        .groupBy('battery')
        .execute(),
      this.phonesRepository
        .createQueryBuilder('phone')
        .select(['COUNT(id) AS phones', 'camera'])
        .groupBy('camera')
        .execute(),
      this.phonesRepository
        .createQueryBuilder('phone')
        .select(['COUNT(id) AS phones', 'os'])
        .groupBy('os')
        .execute(),
      this.phonesRepository
        .createQueryBuilder('phone')
        .select(['MIN(price) AS min', 'MAX(price) AS max'])
        .getRawOne(),
    ]);
  }
}
