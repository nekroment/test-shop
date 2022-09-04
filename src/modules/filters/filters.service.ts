import { Injectable } from '@nestjs/common';

import { PhonesService } from 'src/services/phones.service';
import { BrandsService } from 'src/services/brands.service';

@Injectable()
export class FiltersService {
  constructor(
    private brandsService: BrandsService,
    private phonesService: PhonesService,
  ) {}

  async getFilters() {
    const brandsFilter = await this.brandsService.groupByBrands();
    const phonesFilter = await this.phonesService.groupByMemory();
  }
}
