import { GraphQLError } from 'graphql';

export class CustomError extends GraphQLError {
  constructor(
    message: string,
    public code: string = '',
    public additional = {},
  ) {
    super(message);
    this.additional = additional;
    this.code = code;
  }
}
