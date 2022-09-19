import { Injectable } from '@nestjs/common';

import { PhonesService } from 'src/services/phones.service';
import { BrandsService } from 'src/services/brands.service';
import { GetFilters } from './resources';

@Injectable()
export class FiltersService {
  constructor(
    private brandsService: BrandsService,
    private phonesService: PhonesService,
  ) {}

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
