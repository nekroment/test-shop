import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber, Length } from 'class-validator';
import {
  MinLowercase,
  MinNumbers,
  MinSymbols,
  MinUppercase,
} from 'src/resources';
import { loginConstants } from '../constants';
import { authErrors } from '../messages';
import { Trim } from 'src/resources/decorators';

@InputType()
export class Registration {
  @Field()
  @Length(loginConstants.name.min, loginConstants.name.max, {
    message: authErrors.name.length(
      loginConstants.name.min,
      loginConstants.name.max,
    ),
  })
  @Trim()
  first_name: string;

  @Field()
  @Length(loginConstants.name.min, loginConstants.name.max, {
    message: authErrors.name.length(
      loginConstants.name.min,
      loginConstants.name.max,
    ),
  })
  @Trim()
  last_name: string;

  @Field()
  @IsEmail(
    {},
    {
      message: authErrors.email.format,
    },
  )
  email: string;

  @Field()
  @Length(loginConstants.password.min, loginConstants.password.max, {
    message: authErrors.password.length(
      loginConstants.password.min,
      loginConstants.password.max,
    ),
  })
  @MinLowercase(authErrors.password.lowercase)
  @MinUppercase(authErrors.password.uppercase)
  @MinNumbers(authErrors.password.number)
  @MinSymbols(authErrors.password.symbol)
  password: string;

  @Field()
  @IsPhoneNumber('UA')
  phone_number: string;
}
