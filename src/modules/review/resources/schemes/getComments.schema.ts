import { ObjectType, Field, Int } from '@nestjs/graphql';

import { Comment } from 'src/resources';

@ObjectType()
export class GetComments {
  @Field(() => [Comment])
  comments: Comment[];

  @Field(() => Int)
  total: number;
}
