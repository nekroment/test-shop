import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { PhoneModel } from 'src/resources';
import { PhonesService } from 'src/services/phones.service';
import { FiltersService } from './filters.service';
import { GetFilters, GetFiltersDto, GetPhones } from './resources';
import { GetPhonesByFilters } from './resources/dto/getPhonesByFilters.dto';

@Resolver()
export class FiltersResolver {
  constructor(
    private filtersService: FiltersService,
    private phonesService: PhonesService,
  ) {}

  @Query(() => GetFilters)
  async getFilters(@Args('data') data: GetFiltersDto): Promise<GetFilters> {
    return await this.filtersService.getFilters(data);
  }

  @Query(() => GetPhones)
  async getPhones(@Args('data') data: GetPhonesByFilters): Promise<GetPhones> {
    return await this.phonesService.getPhonesByFilters(data);
  }

  @Query(() => PhoneModel)
  async getPhone(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PhoneModel> {
    return await this.phonesService.findPhoneById(id);
  }
}
