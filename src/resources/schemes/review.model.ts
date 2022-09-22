import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { UserData } from './userData.model';

@ObjectType()
export class Review {
  @Field(() => ID)
  id: number;

  @Field(() => UserData)
  user: UserData;

  @Field(() => Int)
  rating: number;

  @Field()
  comment: string;

  @Field()
  datetime: string;

  @Field()
  review_rating: number;

  @Field({ nullable: true })
  user_rating: boolean;

  @Field({ nullable: true })
  updated: string;
}
