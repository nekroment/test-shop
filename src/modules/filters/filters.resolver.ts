import { Query, Resolver } from '@nestjs/graphql';

import { FiltersService } from './filters.service';
import { GetFilters } from './resources';

@Resolver()
export class FiltersResolver {
  constructor(private filtersService: FiltersService) {}

  @Query(() => GetFilters)
  async getFilters(): Promise<GetFilters> {
    return await this.filtersService.getFilters();
  }
}
