import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Brands } from 'src/entities';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brands)
    private brandsRepository: Repository<Brands>,
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
}
