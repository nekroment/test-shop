import { Field, InputType, Int } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

import { reviewErrors } from './../message';

@InputType()
export class CreateComment {
  @Field()
  @MaxLength(128, {
    message: reviewErrors.commentLength,
  })
  comment: string;

  @Field(() => Int)
  review_id: number;
}
