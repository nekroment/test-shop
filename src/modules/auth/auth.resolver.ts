import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';

import { ContextType, TransformContextPipe } from 'src/resources/pipes';
import { MessageAnswer } from 'src/resources';
import { AuthService } from './auth.service';
import { Registration, User } from './resources';
import { UsersService } from 'src/services/users.service';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/guards';
import { UserIpInterceptor } from 'src/interceptors';

@UseInterceptors(UserIpInterceptor)
@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Query(() => User)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context(TransformContextPipe) { ip }: ContextType,
  ): Promise<User> {
    return await this.authService.login(email, password, ip);
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  async getUserInfo(
    @Context(TransformContextPipe) { id }: ContextType,
  ): Promise<User> {
    return await this.usersService.findUserById(id);
  }

  @Mutation(() => MessageAnswer)
  async registration(
    @Args('data') data: Registration,
    @Context(TransformContextPipe) { ip }: ContextType,
  ): Promise<MessageAnswer> {
    return await this.authService.registration(data, ip);
  }
}
