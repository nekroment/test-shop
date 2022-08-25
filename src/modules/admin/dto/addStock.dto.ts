import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, Min } from 'class-validator';

@InputType()
export class AddStockDto {
  @Field(() => Int)
  phone: number;

  @Field()
  @Min(1)
  percentage: number;

  @Field()
  @IsDate()
  datetime: Date;
}
