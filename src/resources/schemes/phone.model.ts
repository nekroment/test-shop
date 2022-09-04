import { Field, Int, ObjectType } from '@nestjs/graphql';
import { OS } from '../enums';
import { PhoneImages } from './phoneImages.model';

@ObjectType()
export class PhoneModel {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field(() => Int)
  memory: number;

  @Field(() => Int)
  ram: number;

  @Field()
  diagonal: number;

  @Field(() => Int)
  battery: number;

  @Field(() => Int)
  camera: number;

  @Field(() => OS)
  os: OS;

  @Field(() => PhoneImages, { nullable: true })
  phone_images: PhoneImages;

  @Field(() => Int)
  brand_id: number;

  @Field()
  brand_name: string;
}
