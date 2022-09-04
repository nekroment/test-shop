import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GroupByBrands {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  phones: number;

  @Field()
  name: string;
}
