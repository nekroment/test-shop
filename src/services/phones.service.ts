import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Brands, Phones, Reviews, Stocks } from 'src/entities';
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
import { GetFiltersDto } from 'src/modules/filters/resources';

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

  addFilter(data: GetFiltersDto, query: SelectQueryBuilder<Phones>) {
    const {
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

    const filters = query
      .where('name LIKE :name', { name: `%${name}%` })
      .andWhere('price >= :min', { min: min_price })
      .andWhere('price <= :max', { max: max_price });

    if (memories) {
      filters.andWhere('memory IN (:...memories)', {
        memories,
      });
    }
    if (ram) {
      filters.andWhere('ram IN (:...ram)', {
        ram,
      });
    }

    if (batteries) {
      filters.andWhere('battery IN (:...batteries)', {
        batteries,
      });
    }

    if (diagonals) {
      filters.andWhere('diagonal IN (:...diagonals)', {
        diagonals,
      });
    }

    if (cameras) {
      filters.andWhere('camera IN (:...cameras)', {
        cameras,
      });
    }

    if (os) {
      filters.andWhere('os IN (:...os)', {
        os,
      });
    }

    if (brands) {
      filters.andWhere('brand_id IN (:...brands)', {
        brands,
      });
    }

    return filters;
  }

  async getPhonesByFilters(data: GetPhonesByFilters): Promise<{
    phones: PhoneModel[];
    total: number;
  }> {
    const { take, skip } = data;
    let allPhones = this.getRepositoryPhoneFormat();
    allPhones = this.addFilter(data, allPhones);
    const phones = allPhones.limit(take).offset(skip);

    const total = await allPhones.getCount();
    const result: PhoneModel[] = await phones.execute();
    for (const element of result) {
      element.rating = !element.rating ? 0 : element.rating;
    }
    return {
      total,
      phones: result,
    };
  }

  async findPhoneById(id: number): Promise<PhoneModel> {
    const format = this.getRepositoryPhoneFormat();
    const result = await format.where('id = :id', { id }).getRawOne();
    if (result) {
      result.rating = !result.rating ? 0 : result.rating;
    }
    return result;
  }

  getRepositoryPhoneFormat(): SelectQueryBuilder<Phones> {
    return this.phonesRepository
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
      .leftJoinAndSelect(
        (qb: SelectQueryBuilder<any>) =>
          qb
            .select([
              'phone_id AS stock_phone_id',
              'percentage',
              'start_time',
              'end_time',
            ])
            .from(Stocks, 'st'),
        'stock',
        'stock.stock_phone_id = phone.id',
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
        'stock.percentage AS percentage',
        'stock.start_time AS start_time',
        'stock.end_time AS end_time',
      ]);
  }

  async groupByMemory(
    data: GetFiltersDto,
  ): Promise<
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
      this.addFilter(
        data,
        this.phonesRepository
          .createQueryBuilder('phone')
          .select(['COUNT(id) AS phones', 'memory'])
          .groupBy('memory'),
      ).execute(),
      this.addFilter(
        data,
        this.phonesRepository
          .createQueryBuilder('phone')
          .select(['COUNT(id) AS phones', 'ram'])
          .groupBy('ram'),
      ).execute(),

      this.addFilter(
        data,
        this.phonesRepository
          .createQueryBuilder('phone')
          .select(['COUNT(id) AS phones', 'diagonal'])
          .groupBy('diagonal'),
      ).execute(),

      this.addFilter(
        data,
        this.phonesRepository
          .createQueryBuilder('phone')
          .select(['COUNT(id) AS phones', 'battery'])
          .groupBy('battery'),
      ).execute(),
      this.addFilter(
        data,
        this.phonesRepository
          .createQueryBuilder('phone')
          .select(['COUNT(id) AS phones', 'camera'])
          .groupBy('camera'),
      ).execute(),
      this.addFilter(
        data,
        this.phonesRepository
          .createQueryBuilder('phone')
          .select(['COUNT(id) AS phones', 'os'])
          .groupBy('os'),
      ).execute(),
      this.phonesRepository
        .createQueryBuilder('phone')
        .select(['MIN(price) AS min', 'MAX(price) AS max'])
        .getRawOne(),
    ]);
  }
}
