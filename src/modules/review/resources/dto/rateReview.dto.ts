import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RateReview {
  @Field(() => Int)
  review_id: number;

  @Field()
  rating: boolean;
}
