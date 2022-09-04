import { Query, Resolver } from '@nestjs/graphql';

import { FiltersService } from './filters.service';

@Resolver()
export class FiltersResolver {
  constructor(private filtersService: FiltersService) {}

  @Query(() => String)
  async getFilters(): Promise<string> {
    await this.filtersService.getFilters();
    return 'test';
  }
}
