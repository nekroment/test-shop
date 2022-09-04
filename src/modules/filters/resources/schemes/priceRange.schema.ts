import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PriceRange {
  @Field()
  min: number;

  @Field()
  max: number;
}
