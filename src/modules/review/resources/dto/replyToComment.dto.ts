import { Field, InputType, Int } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

import { reviewErrors } from './../message';

@InputType()
export class ReplyToComment {
  @Field()
  @MaxLength(128, {
    message: reviewErrors.commentLength,
  })
  comment: string;

  @Field(() => Int)
  comment_id: number;
}
