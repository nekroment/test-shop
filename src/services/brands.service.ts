import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { GroupByBrands } from './../resources/interfaces/brands';
import { Brands, Phones } from 'src/entities';
import { GetFiltersDto } from 'src/modules/filters/resources';
import { PhonesService } from './phones.service';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brands)
    private brandsRepository: Repository<Brands>,
    private phonesService: PhonesService,
  ) {}

  async adminAddBrand(name: string): Promise<void> {
    const brand = this.brandsRepository.create({
      name,
    });
    await this.brandsRepository.save(brand);
  }

  async findBrandById(id: number): Promise<Brands> {
    return await this.brandsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async groupByBrands(data: GetFiltersDto): Promise<GroupByBrands[]> {
    return await this.brandsRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect(
        (qb: SelectQueryBuilder<any>) =>
          this.phonesService
            .addFilter(data, qb.select(['id AS phone_id', 'brand_id']))
            .from(Phones, 'ph'),
        'phone',
        'phone.brand_id = brand.id',
      )
      .select(['id', 'name', 'COUNT(phone.phone_id) AS phones'])
      .groupBy('id')
      .execute();
  }
}
