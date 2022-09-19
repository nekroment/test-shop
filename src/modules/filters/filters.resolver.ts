import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { PhoneModel, Review } from 'src/resources';
import { PhonesService } from 'src/services/phones.service';
import { ReviewsService } from 'src/services/reviews.service';
import { FiltersService } from './filters.service';
import { GetFilters, GetPhones } from './resources';
import { GetPhoneReviews } from './resources/dto';
import { GetPhonesByFilters } from './resources/dto/getPhonesByFilters.dto';

@Resolver()
export class FiltersResolver {
  constructor(
    private filtersService: FiltersService,
    private phonesService: PhonesService,
    private reviewsService: ReviewsService,
  ) {}

  @Query(() => GetFilters)
  async getFilters(): Promise<GetFilters> {
    return await this.filtersService.getFilters();
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

  @Query(() => [Review])
  async getReviews(@Args('data') data: GetPhoneReviews): Promise<Review[]> {
    const { phone_id, take, skip } = data;
    return await this.reviewsService.getPhoneReviews(phone_id, take, skip);
  }
}
