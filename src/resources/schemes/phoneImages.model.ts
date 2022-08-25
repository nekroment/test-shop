import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PhoneImages {
  @Field(() => [String], { nullable: true })
  images: string[];
}
