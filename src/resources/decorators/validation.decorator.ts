import {
  registerDecorator,
  ValidationOptions as DefaultValidationOptions,
} from 'class-validator';

interface ValidationOptions extends DefaultValidationOptions {
  regExp: RegExp;
  repeatsCount?: number;
}

export function IsRepeatMatches(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRepeatMatches',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            !value ||
            (value.match(validationOptions.regExp) || []).length >=
              (validationOptions.repeatsCount || 1)
          );
        },
      },
    });
  };
}

export const MinLowercase = (message: string, length = 1) =>
  IsRepeatMatches({ regExp: /[a-z]/g, message, repeatsCount: length });
export const MinSymbols = (message: string, length = 1) =>
  IsRepeatMatches({ regExp: /[^a-zA-Z0-9\s]/g, message, repeatsCount: length });
export const MinUppercase = (message: string, length = 1) =>
  IsRepeatMatches({ regExp: /[A-Z]/g, message, repeatsCount: length });
export const MinNumbers = (message: string, length = 1) =>
  IsRepeatMatches({ regExp: /[0-9]/g, message, repeatsCount: length });
