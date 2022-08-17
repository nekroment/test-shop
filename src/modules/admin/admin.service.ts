import { errorCode } from './../../resources/constants/messages';
import { Injectable } from '@nestjs/common';

import { PhonesService } from 'src/services/phones.service';
import { BrandsService } from 'src/services/brands.service';
import { CustomError, MessageAnswer } from 'src/resources';
import { adminErrors, adminSuccesses } from './resources';
import { AddPhoneDto } from './dto';

@Injectable()
export class AdminSerivce {
  constructor(
    private brandsService: BrandsService,
    private phonesService: PhonesService,
  ) {}

  async addBrand(name: string): Promise<MessageAnswer> {
    await this.brandsService.adminAddBrand(name);
    return {
      message: adminSuccesses.brand,
    };
  }

  async addPhone(data: AddPhoneDto): Promise<MessageAnswer> {
    const brand = await this.brandsService.findBrandById(data.brand);
    if (!brand) {
      throw new CustomError(adminErrors.brand, errorCode.admin);
    }
    await this.phonesService.adminAddPhone(data);
    return {
      message: adminSuccesses.phone,
    };
  }
}
