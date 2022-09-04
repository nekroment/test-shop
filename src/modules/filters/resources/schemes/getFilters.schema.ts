import { Field, ObjectType } from '@nestjs/graphql';

import { GroupByBattery } from './groupByBattery.schema';
import { GroupByBrands } from './groupByBrands.schema';
import { GroupByCamera } from './groupByCamera.schema';
import { GroupByDiagonal } from './groupByDiagonal.schema';
import { GroupByMemory } from './groupByMemory.schema';
import { GroupByRam } from './groupByRam.schema';
import { PriceRange } from './priceRange.schema';
import { GroupByOs } from './groupByOs.schema';

@ObjectType()
export class GetFilters {
  @Field(() => [GroupByBrands])
  brands: GroupByBrands[];

  @Field(() => [GroupByMemory])
  memories: GroupByMemory[];

  @Field(() => [GroupByRam])
  ram: GroupByRam[];

  @Field(() => [GroupByDiagonal])
  diagonals: GroupByDiagonal[];

  @Field(() => [GroupByBattery])
  batteries: GroupByBattery[];

  @Field(() => [GroupByCamera])
  cameras: GroupByCamera[];

  @Field(() => [GroupByOs])
  os: GroupByOs[];

  @Field(() => PriceRange)
  price: PriceRange;
}
