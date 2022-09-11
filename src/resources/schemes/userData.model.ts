import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserData {
  @Field()
  id: number;

  @Field()
  first_name: string;

  @Field()
  last_name: string;
}
