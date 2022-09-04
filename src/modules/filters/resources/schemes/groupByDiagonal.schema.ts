import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GroupByDiagonal {
  @Field(() => Int)
  phones: number;

  @Field()
  diagonal: number;
}
