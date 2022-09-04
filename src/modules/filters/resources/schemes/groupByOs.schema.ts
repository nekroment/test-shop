import { Field, Int, ObjectType } from '@nestjs/graphql';
import { OS } from 'src/resources';

@ObjectType()
export class GroupByOs {
  @Field(() => Int)
  phones: number;

  @Field(() => OS)
  os: OS;
}
