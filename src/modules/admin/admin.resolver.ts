import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { MessageAnswer } from 'src/resources';
import { AdminSerivce } from './admin.service';
import { AddPhoneDto } from './dto';

@Resolver()
export class AdminResolver {
  constructor(private adminService: AdminSerivce) {}

  @Mutation(() => MessageAnswer)
  async adminAddBrand(@Args('name') name: string): Promise<MessageAnswer> {
    return await this.adminService.addBrand(name);
  }

  @Mutation(() => MessageAnswer)
  async adminAddPhone(@Args('data') data: AddPhoneDto): Promise<MessageAnswer> {
    return await this.adminService.addPhone(data);
  }
}
