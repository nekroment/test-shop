import { Field, InputType } from '@nestjs/graphql';

import { Length, Min } from 'class-validator';
import { adminConstants, adminErrors } from '../resources';

@InputType()
export class AddPhoneDto {
  @Field()
  @Length(adminConstants.name.min, adminConstants.name.max, {
    message: adminErrors.name(adminConstants.name.min, adminConstants.name.max),
  })
  name: string;

  @Field()
  @Min(1, {
    message: adminErrors.price,
  })
  price: number;

  @Field()
  brand: number;
}
