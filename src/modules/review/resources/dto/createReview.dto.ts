import { Field, InputType, Int } from '@nestjs/graphql';
import { Min, Max, MaxLength } from 'class-validator';

import { reviewErrors } from './../message';

@InputType()
export class CreateReview {
  @Field(() => Int)
  @Min(1, {
    message: reviewErrors.rating,
  })
  @Max(5, {
    message: reviewErrors.rating,
  })
  rating: number;

  @Field()
  @MaxLength(128, {
    message: reviewErrors.commentLength,
  })
  comment: string;

  @Field(() => Int)
  phone_id: number;
}
