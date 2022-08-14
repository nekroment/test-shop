import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class Registration {
  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
