import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class QrCodeTfa {
  @Field()
  qr: string;
}
