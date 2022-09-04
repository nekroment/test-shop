import { Field, ObjectType } from '@nestjs/graphql';

import { PhoneModel } from 'src/resources';

@ObjectType()
export class GetPhones {
  @Field(() => [PhoneModel])
  phones: PhoneModel[];
}
