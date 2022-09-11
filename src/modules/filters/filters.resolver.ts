import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/guards';
import { MessageAnswer, Review } from 'src/resources';
import { ContextType, TransformContextPipe } from 'src/resources/pipes';

import { PhonesService } from 'src/services/phones.service';
import { ReviewsService } from 'src/services/reviews.service';
import { FiltersService } from './filters.service';
import { GetFilters, GetPhones } from './resources';
import { CreateReview, GetPhoneReviews } from './resources/dto';
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
    const phones = await this.phonesService.getPhonesByFilters(data);
    return {
      phones,
    };
  }

  @Query(() => [Review])
  async getReviews(@Args('data') data: GetPhoneReviews): Promise<Review[]> {
    const { phone_id, take, skip } = data;
    return await this.reviewsService.getPhoneReviews(phone_id, take, skip);
  }

  @Mutation(() => MessageAnswer)
  @UseGuards(AuthGuard)
  async createReview(
    @Args('data') data: CreateReview,
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<MessageAnswer> {
    return await this.filtersService.createReview(id, data);
  }
}
