import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GroupByMemory {
  @Field(() => Int)
  phones: number;

  @Field()
  memory: number;
}
