import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Phones } from 'src/entities';
import { Phone } from 'src/resources';

@Injectable()
export class PhonesService {
  constructor(
    @InjectRepository(Phones)
    private phonesRepository: Repository<Phones>,
  ) {}

  async adminAddPhone(data: Phone): Promise<void> {
    const { name, price, brand } = data;
    const phone = this.phonesRepository.create({
      name,
      price,
      brand: {
        id: brand,
      },
    });
    await this.phonesRepository.save(phone);
  }
}