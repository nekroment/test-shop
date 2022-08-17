import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';

import { loginConstants } from '../constants';
import { authErrors } from '../messages';

@ObjectType()
export class LoginDto {
  @Field()
  @Length(loginConstants.password.min, loginConstants.password.max, {
    message: authErrors.password.length(
      loginConstants.password.min,
      loginConstants.password.max,
    ),
  })
  password: string;

  @Field()
  @IsEmail(
    {},
    {
      message: authErrors.email.format,
    },
  )
  email: string;
}
