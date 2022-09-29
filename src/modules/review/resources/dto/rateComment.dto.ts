import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RateComment {
  @Field(() => Int)
  comment_id: number;

  @Field()
  rating: boolean;
}
