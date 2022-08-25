import { registerEnumType } from '@nestjs/graphql';

export enum OS {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
}

registerEnumType(OS, {
  name: 'OS',
});
