import { Field, InputType } from '@nestjs/graphql';
import { Min } from 'class-validator';

import { OS } from 'src/resources';

@InputType()
export class GetFiltersDto {
  @Field()
  name: string;

  @Min(0)
  @Field()
  min_price: number;

  @Min(0)
  @Field()
  max_price: number;

  @Field(() => [Number], {
    nullable: true,
  })
  memories: number[];

  @Field(() => [Number], {
    nullable: true,
  })
  ram: number[];

  @Field(() => [Number], {
    nullable: true,
  })
  diagonals: number[];

  @Field(() => [Number], {
    nullable: true,
  })
  batteries: number[];

  @Field(() => [Number], {
    nullable: true,
  })
  cameras: number[];

  @Field(() => [OS], {
    nullable: true,
  })
  os: OS[];

  @Field(() => [Number], {
    nullable: true,
  })
  brands: number[];
}
