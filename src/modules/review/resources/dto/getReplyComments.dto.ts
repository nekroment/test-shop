import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class GetReplyComments {
  @Field(() => Int)
  @Min(0)
  comment_id: number;

  @Field(() => Int)
  @Min(0)
  take: number;

  @Field(() => Int)
  @Min(0)
  skip: number;
}
