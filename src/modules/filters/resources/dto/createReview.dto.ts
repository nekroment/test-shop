import { Field, InputType, Int } from '@nestjs/graphql';
import { Min, Max, MaxLength } from 'class-validator';
import { filterErrors } from '../messages';

@InputType()
export class CreateReview {
  @Field(() => Int)
  @Min(1, {
    message: filterErrors.rating,
  })
  @Max(5, {
    message: filterErrors.rating,
  })
  rating: number;

  @Field()
  @MaxLength(128, {
    message: filterErrors.commentLength,
  })
  comment: string;

  @Field(() => Int)
  phone_id: number;
}
