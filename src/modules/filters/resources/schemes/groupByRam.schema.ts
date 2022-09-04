import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GroupByRam {
  @Field(() => Int)
  phones: number;

  @Field()
  ram: number;
}
