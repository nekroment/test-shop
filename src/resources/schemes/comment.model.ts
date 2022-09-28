import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { UserData } from './userData.model';

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: number;

  @Field(() => UserData)
  user: UserData;

  @Field()
  comment: string;

  @Field()
  datetime: string;

  @Field()
  comment_rating: number;

  @Field({ nullable: true })
  user_rating: boolean;

  @Field({ nullable: true })
  updated: string;
}
