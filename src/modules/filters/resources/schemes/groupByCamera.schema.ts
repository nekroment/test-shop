import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GroupByCamera {
  @Field(() => Int)
  phones: number;

  @Field()
  camera: number;
}
