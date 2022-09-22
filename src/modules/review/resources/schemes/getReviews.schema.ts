import { ObjectType, Field, Int } from '@nestjs/graphql';

import { Review } from 'src/resources';

@ObjectType()
export class GetReviews {
  @Field(() => [Review])
  reviews: Review[];

  @Field(() => Int)
  total: number;
}
