import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class GetPhoneReviews {
  @Field(() => Int)
  @Min(0)
  phone_id: number;

  @Field(() => Int)
  @Min(0)
  take: number;

  @Field(() => Int)
  @Min(0)
  skip: number;
}
