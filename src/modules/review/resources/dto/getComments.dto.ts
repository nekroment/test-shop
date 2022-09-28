import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class GetReviewComments {
  @Field(() => Int)
  @Min(0)
  review_id: number;

  @Field(() => Int)
  @Min(0)
  take: number;

  @Field(() => Int)
  @Min(0)
  skip: number;
}
