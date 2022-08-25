import { Field, InputType, Int } from '@nestjs/graphql';

import { Length, Min } from 'class-validator';
import { OS } from 'src/resources';
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

  @Field(() => Int)
  @Min(1)
  memory: number;

  @Field(() => Int)
  @Min(1)
  ram: number;

  @Field()
  @Min(1)
  diagonal: number;

  @Field(() => Int)
  @Min(1)
  camera: number;

  @Field(() => Int)
  @Min(1)
  battery: number;

  @Field(() => OS)
  os: OS;

  @Field(() => [String], {
    nullable: true,
  })
  images?: string[];
}
