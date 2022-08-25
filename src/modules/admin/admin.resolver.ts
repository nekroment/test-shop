import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { MessageAnswer } from 'src/resources';
import { AdminSerivce } from './admin.service';
import { AddPhoneDto, AddStockDto } from './dto';

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

  @Mutation(() => MessageAnswer)
  async adminAddStock(@Args('data') data: AddStockDto): Promise<MessageAnswer> {
    return await this.adminService.addStock(data);
  }
}
