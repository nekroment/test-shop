import { Args, Query, Resolver } from '@nestjs/graphql';

import { PhonesService } from 'src/services/phones.service';
import { FiltersService } from './filters.service';
import { GetFilters, GetPhones, GetPhonesByFilters } from './resources';

@Resolver()
export class FiltersResolver {
  constructor(
    private filtersService: FiltersService,
    private phonesService: PhonesService,
  ) {}

  @Query(() => GetFilters)
  async getFilters(): Promise<GetFilters> {
    return await this.filtersService.getFilters();
  }

  @Query(() => GetPhones)
  async getPhones(@Args('data') data: GetPhonesByFilters): Promise<GetPhones> {
    const phones = await this.phonesService.getPhonesByFilters(data);
    return {
      phones,
    };
  }
}
