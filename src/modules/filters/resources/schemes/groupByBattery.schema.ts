import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GroupByBattery {
  @Field(() => Int)
  phones: number;

  @Field()
  battery: number;
}
