import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  email: string;

  @Field()
  account_status: boolean;

  @Field()
  registration_datetime: string;

  @Field()
  tfa_enabled: boolean;

  @Field({ nullable: true })
  token?: string;
}
